import "dotenv/config";
import { prisma } from "../lib/prisma";
import { seedPatterns, seedYarns } from "./seed-lib";
import { demoYarnSeedData } from "./seed-data/demo-yarns";
import { demoPatternSeedData } from "./seed-data/demo-patterns";

async function main() {
  console.log("🧶 Đang seed dữ liệu DEMO dễ thương để xem trước...");
  const yarnNameToId = await seedYarns(demoYarnSeedData);
  await seedPatterns(demoPatternSeedData, yarnNameToId);
  console.log("Hoàn tất demo. Thay bằng nội dung thật của bạn bất cứ lúc nào.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
