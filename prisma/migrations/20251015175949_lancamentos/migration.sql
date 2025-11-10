/*
  Warnings:

  - You are about to drop the column `valor_agua` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `valor_condominio` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `valor_iptu` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `valor_taxa_lixo` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `valor_venda` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the `Pagamento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Reajuste` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `valor_aluguel_historico` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "lancamentoTipo" AS ENUM ('DEBITO', 'CREDITO');

-- CreateEnum
CREATE TYPE "lancamentoStatus" AS ENUM ('ABERTO', 'CONFIRMADO');

-- AlterEnum
ALTER TYPE "ImovelStatus" ADD VALUE 'INATIVO';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_TIPO_LANC';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_TIPO_LANC';
ALTER TYPE "Permission" ADD VALUE 'DELETE_TPO_LANC';
ALTER TYPE "Permission" ADD VALUE 'VIEW_TIPOS_LANC';

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_anexoId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "Reajuste" DROP CONSTRAINT "Reajuste_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "valor_aluguel_historico" DROP CONSTRAINT "valor_aluguel_historico_locacaoId_fkey";

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "valor_agua",
DROP COLUMN "valor_condominio",
DROP COLUMN "valor_iptu",
DROP COLUMN "valor_taxa_lixo",
DROP COLUMN "valor_venda",
ALTER COLUMN "valor_aluguel" SET DEFAULT 0;

-- DropTable
DROP TABLE "Pagamento";

-- DropTable
DROP TABLE "Reajuste";

-- DropTable
DROP TABLE "valor_aluguel_historico";

-- CreateTable
CREATE TABLE "lacamento_tipo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tipo" "lancamentoTipo" NOT NULL DEFAULT 'DEBITO',
    "automatico" TEXT NOT NULL DEFAULT 'S',
    "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lacamento_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguroIncendio" (
    "id" SERIAL NOT NULL,
    "numeroSeguro" TEXT NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeguroIncendio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "statusPagamento" TEXT NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "diaVencimentoPagamento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "locatarioId" INTEGER,
    "anexoId" INTEGER,

    CONSTRAINT "pagamentos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reajustes" (
    "id" SERIAL NOT NULL,
    "percentualRejuste" DOUBLE PRECISION NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "valorRejuste" DOUBLE PRECISION NOT NULL,
    "dataReajuste" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "reajustes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentos" (
    "id" SERIAL NOT NULL,
    "lancamentoId" INTEGER NOT NULL,
    "valorLancamento" DOUBLE PRECISION NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "status" "lancamentoStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "lancamentos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "lacamento_tipo_name_key" ON "lacamento_tipo"("name");

-- CreateIndex
CREATE UNIQUE INDEX "SeguroIncendio_locacaoId_key" ON "SeguroIncendio"("locacaoId");

-- AddForeignKey
ALTER TABLE "SeguroIncendio" ADD CONSTRAINT "SeguroIncendio_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "anexos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentos" ADD CONSTRAINT "pagamentos_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reajustes" ADD CONSTRAINT "reajustes_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_lancamentoId_fkey" FOREIGN KEY ("lancamentoId") REFERENCES "lacamento_tipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
