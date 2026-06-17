-- AlterTable
ALTER TABLE "patterns" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "sellers" ADD COLUMN     "deleted_at" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "yarn_types" ADD COLUMN     "deleted_at" TIMESTAMP(3);
