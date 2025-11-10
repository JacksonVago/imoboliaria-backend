/*
  Warnings:

  - Added the required column `vencimentoLancamento` to the `lancamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "lancamentos" ADD COLUMN     "vencimentoLancamento" TIMESTAMP(3) NOT NULL;
