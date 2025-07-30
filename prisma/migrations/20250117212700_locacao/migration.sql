/*
  Warnings:

  - You are about to drop the column `pessoaId` on the `Locacao` table. All the data in the column will be lost.
  - Added the required column `garantiaLocacaoTipo` to the `Locacao` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GarantiaLocacaoTypes" AS ENUM ('SEGURO_FIANCA', 'TITULO_CAPITALIZACAO', 'DEPOSITO_CALCAO', 'FIADOR');

-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_pessoaId_fkey";

-- AlterTable
ALTER TABLE "Locacao" DROP COLUMN "pessoaId",
ADD COLUMN     "garantiaFiadorId" INTEGER,
ADD COLUMN     "garantiaLocacaoTipo" "GarantiaLocacaoTypes" NOT NULL,
ADD COLUMN     "garantiaSeguroFiancaId" INTEGER;

-- CreateTable
CREATE TABLE "TituloCapitalizacao" (
    "id" SERIAL NOT NULL,
    "numeroTitulo" TEXT NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "TituloCapitalizacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TituloCapitalizacao_locacaoId_key" ON "TituloCapitalizacao"("locacaoId");

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_garantiaFiadorId_fkey" FOREIGN KEY ("garantiaFiadorId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloCapitalizacao" ADD CONSTRAINT "TituloCapitalizacao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
