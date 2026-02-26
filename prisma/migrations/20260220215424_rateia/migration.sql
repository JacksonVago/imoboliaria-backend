/*
  Warnings:

  - Added the required column `reateia` to the `lancamentoscondominios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lancamentoscondominios" ADD COLUMN     "reateia" TEXT NOT NULL;
