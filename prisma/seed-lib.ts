import { prisma } from "../lib/prisma";
import { slugify } from "../lib/utils";
import type { YarnSeedData } from "./seed-data/yarns";
import type { PatternSeedData } from "./seed-data/patterns";

export async function seedYarns(yarnSeedData: YarnSeedData[]): Promise<Map<string, string>> {
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

export async function seedPatterns(patternSeedData: PatternSeedData[], yarnNameToId: Map<string, string>) {
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
