/*
  Warnings:

  - You are about to drop the column `nome` on the `generic_anexos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "generic_anexos" DROP COLUMN "nome",
ADD COLUMN     "name" TEXT,
ADD COLUMN     "size" INTEGER,
ADD COLUMN     "type" TEXT;
