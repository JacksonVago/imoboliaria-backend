/*
  Warnings:

  - You are about to drop the column `locatarioId` on the `Locacao` table. All the data in the column will be lost.
  - You are about to drop the column `locatarioId` on the `Pagamento` table. All the data in the column will be lost.
  - You are about to drop the column `locatarioId` on the `generic_anexos` table. All the data in the column will be lost.
  - You are about to drop the column `proprietarioId` on the `generic_anexos` table. All the data in the column will be lost.
  - You are about to drop the column `locatarioId` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the `_ImovelToProprietario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locatarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `proprietarios` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `pessoaId` to the `Locacao` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_garantiaFiadorId_fkey";

-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "Pagamento" DROP CONSTRAINT "Pagamento_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "_ImovelToProprietario" DROP CONSTRAINT "_ImovelToProprietario_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImovelToProprietario" DROP CONSTRAINT "_ImovelToProprietario_B_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_proprietarioId_fkey";

-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "locatarios" DROP CONSTRAINT "locatarios_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "proprietarios" DROP CONSTRAINT "proprietarios_enderecoId_fkey";

-- AlterTable
ALTER TABLE "Locacao" DROP COLUMN "locatarioId",
ADD COLUMN     "pessoaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Pagamento" DROP COLUMN "locatarioId";

-- AlterTable
ALTER TABLE "generic_anexos" DROP COLUMN "locatarioId",
DROP COLUMN "proprietarioId";

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "locatarioId";

-- DropTable
DROP TABLE "_ImovelToProprietario";

-- DropTable
DROP TABLE "locatarios";

-- DropTable
DROP TABLE "proprietarios";

-- CreateTable
CREATE TABLE "Fiador" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,

    CONSTRAINT "Fiador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ImovelToPessoa" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImovelToPessoa_AB_unique" ON "_ImovelToPessoa"("A", "B");

-- CreateIndex
CREATE INDEX "_ImovelToPessoa_B_index" ON "_ImovelToPessoa"("B");

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_garantiaFiadorId_fkey" FOREIGN KEY ("garantiaFiadorId") REFERENCES "Fiador"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fiador" ADD CONSTRAINT "Fiador_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "persons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToPessoa" ADD CONSTRAINT "_ImovelToPessoa_A_fkey" FOREIGN KEY ("A") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToPessoa" ADD CONSTRAINT "_ImovelToPessoa_B_fkey" FOREIGN KEY ("B") REFERENCES "persons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
