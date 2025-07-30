/*
  Warnings:

  - You are about to drop the column `tipo` on the `pessoas` table. All the data in the column will be lost.
  - You are about to drop the `Locacao` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `finalidade` to the `imoveis` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ImovelFinalidade" AS ENUM ('ALUGUEL', 'VENDA', 'AMBOS');

-- DropForeignKey
ALTER TABLE "DepositoCalcao" DROP CONSTRAINT "DepositoCalcao_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_imovelId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "SeguroFianca" DROP CONSTRAINT "SeguroFianca_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "TituloCapitalizacao" DROP CONSTRAINT "TituloCapitalizacao_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "_LocacaoToLocatario" DROP CONSTRAINT "_LocacaoToLocatario_A_fkey";

-- DropForeignKey
ALTER TABLE "fiadores" DROP CONSTRAINT "fiadores_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "valor_aluguel_historico" DROP CONSTRAINT "valor_aluguel_historico_locacaoId_fkey";

-- AlterTable
ALTER TABLE "imoveis" ADD COLUMN     "finalidade" "ImovelFinalidade" NOT NULL;

-- AlterTable
ALTER TABLE "pessoas" DROP COLUMN "tipo";

-- DropTable
DROP TABLE "Locacao";

-- DropEnum
DROP TYPE "TipoPessoa";

-- CreateTable
CREATE TABLE "locacoes" (
    "id" SERIAL NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "status" "LocacaoStatus" NOT NULL DEFAULT 'ATIVA',
    "imovelId" INTEGER,
    "garantiaLocacaoTipo" "GarantiaLocacaoTypes",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "locacoes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fiadores" ADD CONSTRAINT "fiadores_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locacoes" ADD CONSTRAINT "locacoes_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositoCalcao" ADD CONSTRAINT "DepositoCalcao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroFianca" ADD CONSTRAINT "SeguroFianca_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloCapitalizacao" ADD CONSTRAINT "TituloCapitalizacao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valor_aluguel_historico" ADD CONSTRAINT "valor_aluguel_historico_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocacaoToLocatario" ADD CONSTRAINT "_LocacaoToLocatario_A_fkey" FOREIGN KEY ("A") REFERENCES "locacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
