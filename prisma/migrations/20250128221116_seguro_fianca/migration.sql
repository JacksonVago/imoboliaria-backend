/*
  Warnings:

  - You are about to drop the column `numeroApolice` on the `SeguroFianca` table. All the data in the column will be lost.
  - Added the required column `numeroSeguro` to the `SeguroFianca` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeguroFianca" DROP COLUMN "numeroApolice",
ADD COLUMN     "numeroSeguro" TEXT NOT NULL;
