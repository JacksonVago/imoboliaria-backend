/*
  Warnings:

  - You are about to drop the column `diaVencimentoPagamento` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the column `statusPagamento` on the `pagamentos` table. All the data in the column will be lost.
  - You are about to drop the `anexos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `generic_anexos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imovel_photos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imovel_tipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `lacamento_tipo` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `observacao_anexos` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `valor_imovel_historico` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `status` to the `pagamentos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `vencimentoPagamento` to the `pagamentos` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PagamentoStatus" AS ENUM ('PENDENTE', 'PAGO', 'ATRASADO');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_PAGAMENTO';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_PAGAMENTO';
ALTER TYPE "Permission" ADD VALUE 'DELETE_PAGAMENTO';
ALTER TYPE "Permission" ADD VALUE 'VIEW_PAGAMENTOS';

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_imovelId_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_tipoId_fkey";

-- DropForeignKey
ALTER TABLE "imovel_photos" DROP CONSTRAINT "imovel_photos_imovelId_fkey";

-- DropForeignKey
ALTER TABLE "lancamentos" DROP CONSTRAINT "lancamentos_tipoId_fkey";

-- DropForeignKey
ALTER TABLE "observacao_anexos" DROP CONSTRAINT "observacao_anexos_observacaoId_fkey";

-- DropForeignKey
ALTER TABLE "pagamentos" DROP CONSTRAINT "pagamentos_anexoId_fkey";

-- DropForeignKey
ALTER TABLE "valor_imovel_historico" DROP CONSTRAINT "valor_imovel_historico_imovelId_fkey";

-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "tipoId" INTEGER;

-- AlterTable
ALTER TABLE "lancamentos" ADD COLUMN     "boletoId" INTEGER,
ADD COLUMN     "pagamentoId" INTEGER,
ADD COLUMN     "parcela" INTEGER;

-- AlterTable
ALTER TABLE "pagamentos" DROP COLUMN "diaVencimentoPagamento",
DROP COLUMN "statusPagamento",
ADD COLUMN     "status" "PagamentoStatus" NOT NULL,
ADD COLUMN     "vencimentoPagamento" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "anexos";

-- DropTable
DROP TABLE "generic_anexos";

-- DropTable
DROP TABLE "imovel_photos";

-- DropTable
DROP TABLE "imovel_tipo";

-- DropTable
DROP TABLE "lacamento_tipo";

-- DropTable
DROP TABLE "observacao_anexos";

-- DropTable
DROP TABLE "valor_imovel_historico";

-- CreateTable
CREATE TABLE "lancamentoTipos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tipo" "lancamentoTipo" NOT NULL DEFAULT 'DEBITO',
    "automatico" TEXT NOT NULL DEFAULT 'S',
    "parcelas" INTEGER NOT NULL DEFAULT 0,
    "geraObservacao" TEXT NOT NULL DEFAULT 'N',
    "valorFixo" DOUBLE PRECISION,
    "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lancamentoTipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imovelTipos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imovelTipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valorImovelHistorico" (
    "id" SERIAL NOT NULL,
    "proprietarioId" INTEGER,
    "tipo" "ValorImovelTipo" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DECIMAL(65,30) NOT NULL,
    "observacao" TEXT,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "valorImovelHistorico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imovelPhotos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imovelPhotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacaoAnexos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacaoId" INTEGER NOT NULL,

    CONSTRAINT "observacaoAnexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentoAnexos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagamentoAnexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genericAnexos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "size" INTEGER,
    "type" TEXT,
    "tipo_arquivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pessoaId" INTEGER,
    "locacaoId" INTEGER,
    "imovelId" INTEGER,

    CONSTRAINT "genericAnexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" SERIAL NOT NULL,
    "id_boleto" TEXT NOT NULL,
    "pagamentoId" INTEGER NOT NULL,
    "valorBoleto" DOUBLE PRECISION NOT NULL,
    "dataBoleto" TIMESTAMP(3) NOT NULL,
    "vencimentoBoleto" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "status" "PagamentoStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lancamentoTipos_name_key" ON "lancamentoTipos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "imovelTipos_name_key" ON "imovelTipos"("name");

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "lancamentoTipos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valorImovelHistorico" ADD CONSTRAINT "valorImovelHistorico_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "imovelTipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imovelPhotos" ADD CONSTRAINT "imovelPhotos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacaoAnexos" ADD CONSTRAINT "observacaoAnexos_observacaoId_fkey" FOREIGN KEY ("observacaoId") REFERENCES "observacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericAnexos" ADD CONSTRAINT "genericAnexos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericAnexos" ADD CONSTRAINT "genericAnexos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericAnexos" ADD CONSTRAINT "genericAnexos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "pagamentoAnexos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "lancamentoTipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "pagamentos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_pagamentoId_fkey" FOREIGN KEY ("pagamentoId") REFERENCES "pagamentos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
