/*
  Warnings:

  - You are about to drop the column `diaVencimentoPagamento` on the `Pagamento` table. All the data in the column will be lost.
  - Added the required column `diaVencimentoPagamento` to the `locacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "diaVencimentoPagamento";

-- AlterTable
ALTER TABLE "locacoes" ADD COLUMN     "diaVencimentoPagamento" TIMESTAMP(3) NOT NULL;
