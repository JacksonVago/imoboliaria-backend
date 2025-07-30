/*
  Warnings:

  - You are about to drop the column `locacaoId` on the `fiadores` table. All the data in the column will be lost.
  - You are about to drop the column `fiadorId` on the `imoveis` table. All the data in the column will be lost.
  - Added the required column `status` to the `pessoas` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "fiadores" DROP CONSTRAINT "fiadores_locacaoId_fkey";

-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_fiadorId_fkey";

-- AlterTable
ALTER TABLE "fiadores" DROP COLUMN "locacaoId";

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "fiadorId";

-- AlterTable
ALTER TABLE "pessoas" ADD COLUMN     "status" "PessoaStatus" NOT NULL;

-- CreateTable
CREATE TABLE "_FiadorToLocacao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_FiadorToLocacao_AB_unique" ON "_FiadorToLocacao"("A", "B");

-- CreateIndex
CREATE INDEX "_FiadorToLocacao_B_index" ON "_FiadorToLocacao"("B");

-- AddForeignKey
ALTER TABLE "_FiadorToLocacao" ADD CONSTRAINT "_FiadorToLocacao_A_fkey" FOREIGN KEY ("A") REFERENCES "fiadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FiadorToLocacao" ADD CONSTRAINT "_FiadorToLocacao_B_fkey" FOREIGN KEY ("B") REFERENCES "locacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
