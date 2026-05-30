/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Media` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Media" ADD COLUMN     "hash" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Media_hash_key" ON "Media"("hash");
