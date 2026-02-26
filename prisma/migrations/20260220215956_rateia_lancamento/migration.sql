/*
  Warnings:

  - You are about to drop the column `reateia` on the `lancamentoscondominios` table. All the data in the column will be lost.
  - Added the required column `rateia` to the `lancamentoscondominios` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lancamentoscondominios" DROP COLUMN "reateia",
ADD COLUMN     "rateia" TEXT NOT NULL;
