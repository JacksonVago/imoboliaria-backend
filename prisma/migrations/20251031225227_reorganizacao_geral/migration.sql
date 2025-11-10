/*
  Warnings:

  - You are about to drop the column `id_boleto` on the `boletos` table. All the data in the column will be lost.
  - You are about to drop the column `tipo_arquivo` on the `genericAnexos` table. All the data in the column will be lost.
  - You are about to drop the column `porcentagem_lucro_imobiliaria` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `valor_aluguel` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `dia_vencimento` on the `locacoes` table. All the data in the column will be lost.
  - You are about to drop the column `valor_aluguel` on the `locacoes` table. All the data in the column will be lost.
  - You are about to drop the column `anexoId` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `cota_imovel` on the `proprietarios` table. All the data in the column will be lost.
  - You are about to drop the `pagamentoAnexos` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `idBoletoBanco` to the `boletos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipoArquivo` to the `genericAnexos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `porcentagemLucroImobiliaria` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diaVencimento` to the `locacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valorAluguel` to the `locacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "PagamentoStatus" ADD VALUE 'CANCELADO';

-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_anexoId_fkey";

-- AlterTable
ALTER TABLE "boletos" DROP COLUMN "id_boleto",
ADD COLUMN     "idBoletoBanco" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "genericAnexos" DROP COLUMN "tipo_arquivo",
ADD COLUMN     "pagamentoId" INTEGER,
ADD COLUMN     "tipoArquivo" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "porcentagem_lucro_imobiliaria",
DROP COLUMN "valor_aluguel",
ADD COLUMN     "porcentagemLucroImobiliaria" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valorAluguel" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "locacoes" DROP COLUMN "dia_vencimento",
DROP COLUMN "valor_aluguel",
ADD COLUMN     "diaVencimento" INTEGER NOT NULL,
ADD COLUMN     "valorAluguel" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "pagamentos" DROP COLUMN "anexoId";

-- AlterTable
ALTER TABLE "proprietarios" DROP COLUMN "cota_imovel",
ADD COLUMN     "cotaImovel" DOUBLE PRECISION NOT NULL DEFAULT 100;

-- DropTable
DROP TABLE "pagamentoAnexos";

-- AddForeignKey
ALTER TABLE "genericAnexos" ADD CONSTRAINT "genericAnexos_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "pagamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;
