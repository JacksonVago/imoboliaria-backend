/*
  Warnings:

  - You are about to drop the column `dataFim` on the `SeguroIncendio` table. All the data in the column will be lost.
  - You are about to drop the column `dataInicio` on the `SeguroIncendio` table. All the data in the column will be lost.
  - You are about to drop the column `numeroSeguro` on the `SeguroIncendio` table. All the data in the column will be lost.
  - Added the required column `numeroApolice` to the `SeguroIncendio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vigenciaFim` to the `SeguroIncendio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vigenciaInicio` to the `SeguroIncendio` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SeguroIncendio" DROP COLUMN "dataFim",
DROP COLUMN "dataInicio",
DROP COLUMN "numeroSeguro",
ADD COLUMN     "numeroApolice" TEXT NOT NULL,
ADD COLUMN     "vigenciaFim" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "vigenciaInicio" TIMESTAMP(3) NOT NULL;
