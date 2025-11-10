/*
  Warnings:

  - You are about to drop the column `dataBoleto` on the `boletos` table. All the data in the column will be lost.
  - You are about to drop the column `idBoletoBanco` on the `boletos` table. All the data in the column will be lost.
  - You are about to drop the column `observacao` on the `boletos` table. All the data in the column will be lost.
  - You are about to drop the column `pagamentoId` on the `boletos` table. All the data in the column will be lost.
  - You are about to drop the column `valorBoleto` on the `boletos` table. All the data in the column will be lost.
  - You are about to drop the column `vencimentoBoleto` on the `boletos` table. All the data in the column will be lost.
  - The `status` column on the `boletos` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `pagamentoId` on the `genericAnexos` table. All the data in the column will be lost.
  - You are about to drop the column `pagamentoId` on the `lancamentos` table. All the data in the column will be lost.
  - You are about to drop the `pagamentos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `localDeposito` to the `DepositoCalcao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataEmissao` to the `boletos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dataVencimento` to the `boletos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorOriginal` to the `boletos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorPago` to the `boletos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "BoletoStatus" AS ENUM ('PENDENTE', 'CONFIRMADO', 'ATRASADO', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "LocalDeposito" AS ENUM ('IMOBILIARIA', 'PROPRIETARIO');

-- DropForeignKey
ALTER TABLE "boletos" DROP CONSTRAINT "boletos_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "genericAnexos" DROP CONSTRAINT "genericAnexos_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "lancamentos" DROP CONSTRAINT "lancamentos_pagamentoId_fkey";

-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_locatarioId_fkey";

-- AlterTable
ALTER TABLE "DepositoCalcao" ADD COLUMN     "localDeposito" "LocalDeposito" NOT NULL;

-- AlterTable
ALTER TABLE "boletos" DROP COLUMN "dataBoleto",
DROP COLUMN "idBoletoBanco",
DROP COLUMN "observacao",
DROP COLUMN "pagamentoId",
DROP COLUMN "valorBoleto",
DROP COLUMN "vencimentoBoleto",
ADD COLUMN     "dataEmissao" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "dataPagamento" TIMESTAMP(3),
ADD COLUMN     "dataVencimento" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "locatarioId" INTEGER,
ADD COLUMN     "valorOriginal" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valorPago" DOUBLE PRECISION NOT NULL,
DROP COLUMN "status",
ADD COLUMN     "status" "BoletoStatus" NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "genericAnexos" DROP COLUMN "pagamentoId",
ADD COLUMN     "boletoId" INTEGER;

-- AlterTable
ALTER TABLE "lancamentos" DROP COLUMN "pagamentoId";

-- DropTable
DROP TABLE "pagamentos";

-- DropEnum
DROP TYPE "PagamentoStatus";

-- CreateTable
CREATE TABLE "boletosBancarios" (
    "id" SERIAL NOT NULL,
    "boletoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "dataBoleto" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "formaPix" TEXT NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "linhaDigitavel" TEXT NOT NULL,
    "nossoNumero" TEXT NOT NULL,
    "urlBoleto" TEXT NOT NULL,
    "registrado" TEXT NOT NULL,
    "emvPIX" TEXT NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boletosBancarios_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "genericAnexos" ADD CONSTRAINT "genericAnexos_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletosBancarios" ADD CONSTRAINT "boletosBancarios_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
