/*
  Warnings:

  - You are about to drop the column `metrage` on the `imoveis` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "metrage",
ADD COLUMN     "metragem" DOUBLE PRECISION;
