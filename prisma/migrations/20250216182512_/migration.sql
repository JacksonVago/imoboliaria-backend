/*
  Warnings:

  - Added the required column `updatedAt` to the `Locacao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Locacao" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "quantidadeMesesDepositoCalcao" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valorDepositoCalcao" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "generic_anexos" ADD COLUMN     "depositoCalcaoId" INTEGER;

-- CreateTable
CREATE TABLE "DepositoCalcao" (
    "id" SERIAL NOT NULL,
    "valorDeposito" DOUBLE PRECISION NOT NULL,
    "quantidadeMeses" INTEGER NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "DepositoCalcao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DepositoCalcao_locacaoId_key" ON "DepositoCalcao"("locacaoId");

-- AddForeignKey
ALTER TABLE "DepositoCalcao" ADD CONSTRAINT "DepositoCalcao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_depositoCalcaoId_fkey" FOREIGN KEY ("depositoCalcaoId") REFERENCES "DepositoCalcao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
