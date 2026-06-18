import "dotenv/config";
import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";
import { yarnSeedData } from "./seed-data/yarns";
import { patternSeedData } from "./seed-data/patterns";

async function seedYarns(): Promise<Map<string, string>> {
  const nameToId = new Map<string, string>();

  for (const data of yarnSeedData) {
    const slug = slugify(data.nameVi);
    const existing = await prisma.yarnType.findUnique({ where: { slug } });

    const yarn = existing
      ? await prisma.yarnType.update({ where: { id: existing.id }, data })
      : await prisma.yarnType.create({ data: { ...data, slug } });

    nameToId.set(data.nameVi, yarn.id);
  }

  console.log(`Sợi: ${yarnSeedData.length} bản ghi (tạo mới hoặc cập nhật).`);
  return nameToId;
}

async function seedPatterns(yarnNameToId: Map<string, string>) {
  for (const data of patternSeedData) {
    const slug = slugify(data.title);
    const { suitableYarnNames, steps, ...fields } = data;
    const suitableYarnIds = (suitableYarnNames ?? [])
      .map((name) => yarnNameToId.get(name))
      .filter((id): id is string => Boolean(id));

    const existing = await prisma.pattern.findUnique({ where: { slug } });

    if (existing) {
      await prisma.step.deleteMany({ where: { patternId: existing.id } });
      await prisma.pattern.update({
        where: { id: existing.id },
        data: {
          ...fields,
          suitableYarns: { set: suitableYarnIds.map((id) => ({ id })) },
          steps: { create: steps },
        },
      });
    } else {
      await prisma.pattern.create({
        data: {
          slug,
          ...fields,
          suitableYarns: { connect: suitableYarnIds.map((id) => ({ id })) },
          steps: { create: steps },
        },
      });
    }
  }

  console.log(`Mẫu: ${patternSeedData.length} bản ghi (tạo mới hoặc cập nhật).`);
}

async function main() {
  console.log("⚠️  Đang seed dữ liệu VÍ DỤ — xem prisma/seed-data/*.ts để thay bằng nội dung thật.");
  const yarnNameToId = await seedYarns();
  await seedPatterns(yarnNameToId);
  console.log("Hoàn tất. PriceListing không được seed ở đây — import qua /admin/prices/import.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
