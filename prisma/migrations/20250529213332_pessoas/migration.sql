/*
  Warnings:

  - You are about to drop the column `valorAluguel` on the `locacoes` table. All the data in the column will be lost.
  - Added the required column `dia_vencimento` to the `locacoes` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor_aluguel` to the `locacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "LocacaoStatus" ADD VALUE 'AGUARDANDO_DOCUMENTOS';

-- AlterTable
ALTER TABLE "locacoes" DROP COLUMN "valorAluguel",
ADD COLUMN     "dia_vencimento" INTEGER NOT NULL,
ADD COLUMN     "valor_aluguel" DOUBLE PRECISION NOT NULL;
