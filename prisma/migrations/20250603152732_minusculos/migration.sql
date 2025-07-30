/*
  Warnings:

  - You are about to drop the column `depositoCalcaoId` on the `generic_anexos` table. All the data in the column will be lost.
  - You are about to drop the column `seguroFiancaId` on the `generic_anexos` table. All the data in the column will be lost.
  - You are about to drop the column `tituloCapitalizacaoId` on the `generic_anexos` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_depositoCalcaoId_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_seguroFiancaId_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_tituloCapitalizacaoId_fkey";

-- AlterTable
ALTER TABLE "generic_anexos" DROP COLUMN "depositoCalcaoId",
DROP COLUMN "seguroFiancaId",
DROP COLUMN "tituloCapitalizacaoId";
