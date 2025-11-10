/*
  Warnings:

  - Made the column `tipoId` on table `imoveis` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_tipoId_fkey";

-- AlterTable
ALTER TABLE "imoveis" ALTER COLUMN "finalidade" SET DEFAULT 'ALUGUEL',
ALTER COLUMN "tipoId" SET NOT NULL;

-- CreateTable
CREATE TABLE "Reajuste" (
    "id" SERIAL NOT NULL,
    "percentualRejuste" DOUBLE PRECISION NOT NULL,
    "valorRejuste" DOUBLE PRECISION NOT NULL,
    "dataReajuste" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "Reajuste_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "imovel_tipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reajuste" ADD CONSTRAINT "Reajuste_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
