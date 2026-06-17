"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import type { SellerType } from "@/lib/generated/prisma/client";

export interface SellerFormState {
  error?: string;
}

function toErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "code" in err && err.code === "P2002") {
    return "Tên shop này đã tồn tại (trùng slug). Hãy đổi tên shop.";
  }
  if (err instanceof Error) return err.message;
  return "Đã có lỗi xảy ra, vui lòng thử lại.";
}

function optionalString(value: FormDataEntryValue | null): string | null {
  const text = typeof value === "string" ? value.trim() : "";
  return text.length > 0 ? text : null;
}

function buildSellerData(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  if (!name) throw new Error("Tên shop là bắt buộc.");

  return {
    name,
    type: (String(formData.get("type") ?? "unclassified") as SellerType) ?? "unclassified",
    url: optionalString(formData.get("url")),
    location: optionalString(formData.get("location")),
    logoUrl: optionalString(formData.get("logoUrl")),
    notes: optionalString(formData.get("notes")),
    verified: formData.get("verified") === "on",
  };
}

export async function createSeller(
  _prevState: SellerFormState | undefined,
  formData: FormData,
): Promise<SellerFormState> {
  try {
    const data = buildSellerData(formData);
    const slug = slugify(data.name);
    await prisma.seller.create({ data: { ...data, slug } });
  } catch (err) {
    return { error: toErrorMessage(err) };
  }

  revalidatePath("/admin/sellers");
  redirect("/admin/sellers");
}

export async function updateSeller(
  id: string,
  _prevState: SellerFormState | undefined,
  formData: FormData,
): Promise<SellerFormState> {
  try {
    const data = buildSellerData(formData);
    await prisma.seller.update({ where: { id }, data });
  } catch (err) {
    return { error: toErrorMessage(err) };
  }

  revalidatePath("/admin/sellers");
  revalidatePath("/yarn");
  redirect("/admin/sellers");
}

export async function toggleSellerVerified(id: string, nextVerified: boolean) {
  await prisma.seller.update({ where: { id }, data: { verified: nextVerified } });
  revalidatePath("/admin/sellers");
  revalidatePath("/yarn");
}
