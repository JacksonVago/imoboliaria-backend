/*
  Warnings:

  - You are about to drop the column `nome` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `porcentagem_imobiliaria` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `valor` on the `imoveis` table. All the data in the column will be lost.
  - Added the required column `porcentagem_lucro_imobiliaria` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `imoveis` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_proprietarioId_fkey";

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "nome",
DROP COLUMN "porcentagem_imobiliaria",
DROP COLUMN "valor",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "porcentagem_lucro_imobiliaria" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "valor_venda" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "imovel_photos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "imovel_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacoes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "observacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacao_anexos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacaoId" INTEGER NOT NULL,

    CONSTRAINT "observacao_anexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ImovelToProprietario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ImovelToProprietario_AB_unique" ON "_ImovelToProprietario"("A", "B");

-- CreateIndex
CREATE INDEX "_ImovelToProprietario_B_index" ON "_ImovelToProprietario"("B");

-- AddForeignKey
ALTER TABLE "imovel_photos" ADD CONSTRAINT "imovel_photos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacoes" ADD CONSTRAINT "observacoes_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacao_anexos" ADD CONSTRAINT "observacao_anexos_observacaoId_fkey" FOREIGN KEY ("observacaoId") REFERENCES "observacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToProprietario" ADD CONSTRAINT "_ImovelToProprietario_A_fkey" FOREIGN KEY ("A") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToProprietario" ADD CONSTRAINT "_ImovelToProprietario_B_fkey" FOREIGN KEY ("B") REFERENCES "Proprietario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
