import { prisma } from "./prisma";
import { slugify } from "./utils";
import { parseExcelBuffer } from "./excel-import";
import type { Prisma } from "./generated/prisma/client";

export interface ImportLogEntry {
  yarns: { id: string; nameVi: string }[];
  sellers: { id: string; name: string }[];
  errors: { row: number; reason: string }[];
}

export interface ImportResult {
  batchId: string;
  rowCount: number;
  successCount: number;
  newYarnCount: number;
  newSellerCount: number;
  errorCount: number;
  newYarns: { id: string; nameVi: string }[];
  newSellers: { id: string; name: string }[];
  errors: { row: number; reason: string }[];
}

async function uniqueSlug(model: "yarnType" | "seller", base: string): Promise<string> {
  const baseSlug = slugify(base) || "item";
  let candidate = baseSlug;
  let suffix = 1;

  while (true) {
    const exists =
      model === "yarnType"
        ? await prisma.yarnType.findUnique({ where: { slug: candidate } })
        : await prisma.seller.findUnique({ where: { slug: candidate } });
    if (!exists) return candidate;
    suffix++;
    candidate = `${baseSlug}-${suffix}`;
  }
}

export async function processExcelImport(
  buffer: Buffer,
  fileName: string,
  uploadedBy: string,
): Promise<ImportResult> {
  const rows = await parseExcelBuffer(buffer);

  const newYarns: { id: string; nameVi: string }[] = [];
  const newSellers: { id: string; name: string }[] = [];
  const errors: { row: number; reason: string }[] = [];
  let successCount = 0;

  const yarnCache = new Map<string, { id: string }>();
  const sellerCache = new Map<string, { id: string }>();

  for (const row of rows) {
    const yarnName = row.yarnName.trim();
    const sellerName = row.sellerName.trim();

    if (!yarnName || !sellerName) {
      errors.push({ row: row.rowNumber, reason: "Thiếu tên sợi hoặc tên shop" });
      continue;
    }

    const priceNum = Number(row.priceRaw);
    if (!row.priceRaw || !Number.isFinite(priceNum) || priceNum <= 0) {
      errors.push({ row: row.rowNumber, reason: `Giá không hợp lệ: "${row.priceRaw}"` });
      continue;
    }

    const yarnKey = yarnName.toLowerCase();
    let yarn = yarnCache.get(yarnKey);
    if (!yarn) {
      const existing = await prisma.yarnType.findFirst({
        where: { nameVi: { equals: yarnName, mode: "insensitive" }, deletedAt: null },
      });
      if (existing) {
        yarn = existing;
      } else {
        const slug = await uniqueSlug("yarnType", yarnName);
        const created = await prisma.yarnType.create({ data: { nameVi: yarnName, slug } });
        yarn = created;
        newYarns.push({ id: created.id, nameVi: created.nameVi });
      }
      yarnCache.set(yarnKey, yarn);
    }

    const sellerKey = sellerName.toLowerCase();
    let seller = sellerCache.get(sellerKey);
    if (!seller) {
      const existing = await prisma.seller.findFirst({
        where: { name: { equals: sellerName, mode: "insensitive" }, deletedAt: null },
      });
      if (existing) {
        seller = existing;
      } else {
        const slug = await uniqueSlug("seller", sellerName);
        const created = await prisma.seller.create({
          data: {
            name: sellerName,
            slug,
            type: "unclassified",
            verified: false,
            createdVia: "excel_auto_create",
          },
        });
        seller = created;
        newSellers.push({ id: created.id, name: created.name });
      }
      sellerCache.set(sellerKey, seller);
    }

    await prisma.priceListing.upsert({
      where: { yarnTypeId_sellerId: { yarnTypeId: yarn.id, sellerId: seller.id } },
      update: { pricePer100g: priceNum, lastVerified: new Date(), source: "excel_import" },
      create: {
        yarnTypeId: yarn.id,
        sellerId: seller.id,
        pricePer100g: priceNum,
        lastVerified: new Date(),
        source: "excel_import",
      },
    });

    successCount++;
  }

  const status =
    errors.length === 0
      ? "completed"
      : rows.length > 0 && errors.length === rows.length
        ? "failed"
        : "completed_with_errors";

  const log: ImportLogEntry = { yarns: newYarns, sellers: newSellers, errors };

  const batch = await prisma.priceImportBatch.create({
    data: {
      fileName,
      uploadedBy,
      rowCount: rows.length,
      successCount,
      newYarnCount: newYarns.length,
      newSellerCount: newSellers.length,
      errorCount: errors.length,
      status,
      log: log as unknown as Prisma.InputJsonValue,
    },
  });

  return {
    batchId: batch.id,
    rowCount: rows.length,
    successCount,
    newYarnCount: newYarns.length,
    newSellerCount: newSellers.length,
    errorCount: errors.length,
    newYarns,
    newSellers,
    errors,
  };
}
