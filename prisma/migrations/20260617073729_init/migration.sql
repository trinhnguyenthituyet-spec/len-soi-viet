-- CreateEnum
CREATE TYPE "FiberCategory" AS ENUM ('animal', 'plant', 'synthetic', 'blend');

-- CreateEnum
CREATE TYPE "WeightCategory" AS ENUM ('lace', 'fingering', 'sport', 'dk', 'worsted', 'bulky', 'super_bulky');

-- CreateEnum
CREATE TYPE "Washability" AS ENUM ('machine', 'hand', 'dry_clean_only');

-- CreateEnum
CREATE TYPE "AllergyRisk" AS ENUM ('low', 'medium', 'high');

-- CreateEnum
CREATE TYPE "SellerType" AS ENUM ('online_shop', 'facebook_page', 'shopee', 'lazada', 'tiki', 'physical_store', 'unclassified');

-- CreateEnum
CREATE TYPE "SellerCreatedVia" AS ENUM ('manual', 'excel_auto_create');

-- CreateEnum
CREATE TYPE "PriceSource" AS ENUM ('manual', 'excel_import');

-- CreateEnum
CREATE TYPE "ImportBatchStatus" AS ENUM ('processing', 'completed', 'completed_with_errors', 'failed');

-- CreateEnum
CREATE TYPE "CraftType" AS ENUM ('knitting', 'crochet', 'both');

-- CreateEnum
CREATE TYPE "Difficulty" AS ENUM ('beginner', 'intermediate', 'advanced');

-- CreateEnum
CREATE TYPE "PatternCategory" AS ENUM ('clothing', 'accessories', 'home_decor', 'amigurumi', 'baby');

-- CreateTable
CREATE TABLE "yarn_types" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name_vi" TEXT NOT NULL,
    "name_en" TEXT,
    "fiber_category" "FiberCategory",
    "fiber_composition" TEXT,
    "weight_category" "WeightCategory",
    "texture" TEXT[],
    "warmth" INTEGER,
    "softness" INTEGER,
    "durability" INTEGER,
    "stretch" INTEGER,
    "washability" "Washability",
    "allergy_risk" "AllergyRisk",
    "use_cases" TEXT[],
    "care_instructions" TEXT,
    "description_vi" TEXT,
    "pros" TEXT[],
    "cons" TEXT[],
    "tags" TEXT[],
    "hero_image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "yarn_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sellers" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "SellerType" NOT NULL DEFAULT 'unclassified',
    "url" TEXT,
    "location" TEXT,
    "logo_url" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "notes" TEXT,
    "created_via" "SellerCreatedVia" NOT NULL DEFAULT 'manual',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sellers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_listings" (
    "id" TEXT NOT NULL,
    "yarn_type_id" TEXT NOT NULL,
    "seller_id" TEXT NOT NULL,
    "price_per_100g" INTEGER NOT NULL,
    "in_stock" BOOLEAN NOT NULL DEFAULT true,
    "last_verified" TIMESTAMP(3) NOT NULL,
    "source" "PriceSource" NOT NULL DEFAULT 'manual',
    "import_batch_id" TEXT,

    CONSTRAINT "price_listings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "price_import_batches" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "uploaded_by" TEXT NOT NULL,
    "row_count" INTEGER NOT NULL,
    "success_count" INTEGER NOT NULL,
    "new_yarn_count" INTEGER NOT NULL,
    "new_seller_count" INTEGER NOT NULL,
    "error_count" INTEGER NOT NULL,
    "status" "ImportBatchStatus" NOT NULL DEFAULT 'processing',
    "log" JSONB NOT NULL,

    CONSTRAINT "price_import_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "patterns" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "craft_type" "CraftType" NOT NULL,
    "difficulty" "Difficulty" NOT NULL,
    "category" "PatternCategory" NOT NULL,
    "subcategory" TEXT,
    "thumbnail_url" TEXT,
    "images" TEXT[],
    "yarn_weight" "WeightCategory",
    "hook_needle_size" TEXT,
    "gauge" TEXT,
    "finished_size" TEXT,
    "yarn_amount" TEXT,
    "time_estimate" TEXT,
    "description" TEXT,
    "tags" TEXT[],
    "source_url" TEXT,
    "source_credit" TEXT,
    "is_original" BOOLEAN NOT NULL DEFAULT true,
    "saved_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "steps" (
    "id" TEXT NOT NULL,
    "pattern_id" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "image_url" TEXT,
    "video_url" TEXT,
    "tip" TEXT,

    CONSTRAINT "steps_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PatternSuitableYarns" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_PatternSuitableYarns_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "yarn_types_slug_key" ON "yarn_types"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "sellers_slug_key" ON "sellers"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "price_listings_yarn_type_id_seller_id_key" ON "price_listings"("yarn_type_id", "seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "patterns_slug_key" ON "patterns"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "steps_pattern_id_order_key" ON "steps"("pattern_id", "order");

-- CreateIndex
CREATE INDEX "_PatternSuitableYarns_B_index" ON "_PatternSuitableYarns"("B");

-- AddForeignKey
ALTER TABLE "price_listings" ADD CONSTRAINT "price_listings_yarn_type_id_fkey" FOREIGN KEY ("yarn_type_id") REFERENCES "yarn_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_listings" ADD CONSTRAINT "price_listings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "sellers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "price_listings" ADD CONSTRAINT "price_listings_import_batch_id_fkey" FOREIGN KEY ("import_batch_id") REFERENCES "price_import_batches"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "steps" ADD CONSTRAINT "steps_pattern_id_fkey" FOREIGN KEY ("pattern_id") REFERENCES "patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatternSuitableYarns" ADD CONSTRAINT "_PatternSuitableYarns_A_fkey" FOREIGN KEY ("A") REFERENCES "patterns"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PatternSuitableYarns" ADD CONSTRAINT "_PatternSuitableYarns_B_fkey" FOREIGN KEY ("B") REFERENCES "yarn_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
