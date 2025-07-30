/*
  Warnings:

  - You are about to drop the column `garantiaFiadorId` on the `Locacao` table. All the data in the column will be lost.
  - You are about to drop the column `garantiaSeguroFiancaId` on the `Locacao` table. All the data in the column will be lost.
  - You are about to drop the column `pessoaId` on the `Locacao` table. All the data in the column will be lost.
  - You are about to drop the column `quantidadeMesesDepositoCalcao` on the `Locacao` table. All the data in the column will be lost.
  - You are about to drop the column `valorDepositoCalcao` on the `Locacao` table. All the data in the column will be lost.
  - You are about to drop the column `PessoaId` on the `Pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `pessoaId` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `persons` table. All the data in the column will be lost.
  - You are about to drop the `Fiador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ImovelToPessoa` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Fiador" DROP CONSTRAINT "Fiador_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_garantiaFiadorId_fkey";

-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_PessoaId_fkey";

-- DropForeignKey
ALTER TABLE "_ImovelToPessoa" DROP CONSTRAINT "_ImovelToPessoa_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImovelToPessoa" DROP CONSTRAINT "_ImovelToPessoa_B_fkey";

-- AlterTable
ALTER TABLE "Locacao" DROP COLUMN "garantiaFiadorId",
DROP COLUMN "garantiaSeguroFiancaId",
DROP COLUMN "pessoaId",
DROP COLUMN "quantidadeMesesDepositoCalcao",
DROP COLUMN "valorDepositoCalcao";

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "PessoaId",
ADD COLUMN     "locatarioId" INTEGER;

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "pessoaId",
ADD COLUMN     "fiadorId" INTEGER;

-- AlterTable
ALTER TABLE "persons" DROP COLUMN "status";

-- DropTable
DROP TABLE "Fiador";

-- DropTable
DROP TABLE "_ImovelToPessoa";

-- CreateTable
CREATE TABLE "proprietarios" (
    "id" SERIAL NOT NULL,
    "pesssoaId" INTEGER NOT NULL,
    "cota_imovel" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "proprietarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiadores" (
    "id" SERIAL NOT NULL,
    "proprietarioId" INTEGER NOT NULL,
    "locacaoId" INTEGER,

    CONSTRAINT "fiadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locatarios" (
    "id" SERIAL NOT NULL,
    "pesssoaId" INTEGER NOT NULL,

    CONSTRAINT "locatarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LocacaoToLocatario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_ImovelToProprietario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocacaoToLocatario_AB_unique" ON "_LocacaoToLocatario"("A", "B");

-- CreateIndex
CREATE INDEX "_LocacaoToLocatario_B_index" ON "_LocacaoToLocatario"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_ImovelToProprietario_AB_unique" ON "_ImovelToProprietario"("A", "B");

-- CreateIndex
CREATE INDEX "_ImovelToProprietario_B_index" ON "_ImovelToProprietario"("B");

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_pesssoaId_fkey" FOREIGN KEY ("pesssoaId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiadores" ADD CONSTRAINT "fiadores_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "proprietarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiadores" ADD CONSTRAINT "fiadores_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locatarios" ADD CONSTRAINT "locatarios_pesssoaId_fkey" FOREIGN KEY ("pesssoaId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_fiadorId_fkey" FOREIGN KEY ("fiadorId") REFERENCES "fiadores"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocacaoToLocatario" ADD CONSTRAINT "_LocacaoToLocatario_A_fkey" FOREIGN KEY ("A") REFERENCES "Locacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocacaoToLocatario" ADD CONSTRAINT "_LocacaoToLocatario_B_fkey" FOREIGN KEY ("B") REFERENCES "locatarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToProprietario" ADD CONSTRAINT "_ImovelToProprietario_A_fkey" FOREIGN KEY ("A") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToProprietario" ADD CONSTRAINT "_ImovelToProprietario_B_fkey" FOREIGN KEY ("B") REFERENCES "proprietarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
