-- CreateEnum
CREATE TYPE "PageTemplate" AS ENUM ('DEFAULT', 'POLICY', 'LANDING', 'CONTACT', 'ABOUT', 'FAQ');

-- AlterEnum
ALTER TYPE "PageType" ADD VALUE 'LANDING';

-- AlterTable
ALTER TABLE "Page" ADD COLUMN     "sections" JSONB,
ADD COLUMN     "settings" JSONB,
ADD COLUMN     "template" "PageTemplate" NOT NULL DEFAULT 'DEFAULT',
ADD COLUMN     "type" "PageType" NOT NULL DEFAULT 'NORMAL';

-- CreateIndex
CREATE INDEX "Page_type_idx" ON "Page"("type");

-- CreateIndex
CREATE INDEX "Page_template_idx" ON "Page"("template");

-- CreateIndex
CREATE INDEX "Page_status_idx" ON "Page"("status");
