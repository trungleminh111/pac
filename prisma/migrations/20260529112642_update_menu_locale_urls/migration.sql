/*
  Warnings:

  - You are about to drop the column `url` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "url",
ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "urlEn" TEXT,
ADD COLUMN     "urlVi" TEXT;
