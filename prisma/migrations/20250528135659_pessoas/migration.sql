/*
  Warnings:

  - You are about to drop the column `pesssoaId` on the `locatarios` table. All the data in the column will be lost.
  - You are about to drop the column `pesssoaId` on the `proprietarios` table. All the data in the column will be lost.
  - Added the required column `pessoaId` to the `locatarios` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pessoaId` to the `proprietarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "locatarios" DROP CONSTRAINT "locatarios_pesssoaId_fkey";

-- DropForeignKey
ALTER TABLE "proprietarios" DROP CONSTRAINT "proprietarios_pesssoaId_fkey";

-- AlterTable
ALTER TABLE "locatarios" DROP COLUMN "pesssoaId",
ADD COLUMN     "pessoaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "proprietarios" DROP COLUMN "pesssoaId",
ADD COLUMN     "pessoaId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locatarios" ADD CONSTRAINT "locatarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
