import "dotenv/config";
import { prisma } from "../lib/prisma";
import { seedPatterns, seedYarns } from "./seed-lib";
import { yarnSeedData } from "./seed-data/yarns";
import { patternSeedData } from "./seed-data/patterns";

async function main() {
  console.log("⚠️  Đang seed dữ liệu VÍ DỤ — xem prisma/seed-data/*.ts để thay bằng nội dung thật.");
  const yarnNameToId = await seedYarns(yarnSeedData);
  await seedPatterns(patternSeedData, yarnNameToId);
  console.log("Hoàn tất. PriceListing không được seed ở đây — import qua /admin/prices/import.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
