/*
  Warnings:

  - You are about to drop the column `diaVencimentoPagamento` on the `locacoes` table. All the data in the column will be lost.
  - Added the required column `diaVencimentoPagamento` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "diaVencimentoPagamento" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "locacoes" DROP COLUMN "diaVencimentoPagamento";
