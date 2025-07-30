/*
  Warnings:

  - You are about to drop the column `dataVencimentoPagamento` on the `Pagamento` table. All the data in the column will be lost.
  - Added the required column `diaVencimentoPagamento` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "dataVencimentoPagamento",
ADD COLUMN     "diaVencimentoPagamento" TIMESTAMP(3) NOT NULL;
