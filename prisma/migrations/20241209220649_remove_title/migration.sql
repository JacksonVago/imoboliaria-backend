/*
  Warnings:

  - You are about to drop the column `title` on the `imoveis` table. All the data in the column will be lost.
  - Made the column `dataFim` on table `Locacao` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `dataVencimentoPagamento` to the `Pagamento` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Locacao" ALTER COLUMN "dataFim" SET NOT NULL;

-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "dataVencimentoPagamento" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "title";
