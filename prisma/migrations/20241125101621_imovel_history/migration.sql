/*
  Warnings:

  - The primary key for the `Locacao` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Locacao` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `locatarios` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `locatarios` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `Endereco` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proprietario` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `locatarioId` on the `Locacao` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_locatarioId_fkey";

-- DropForeignKey
ALTER TABLE "Proprietario" DROP CONSTRAINT "Proprietario_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "_ImovelToProprietario" DROP CONSTRAINT "_ImovelToProprietario_B_fkey";

-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "locatarios" DROP CONSTRAINT "locatarios_enderecoId_fkey";

-- AlterTable
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "locatarioId",
ADD COLUMN     "locatarioId" INTEGER NOT NULL,
ADD CONSTRAINT "Locacao_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "locatarios" DROP CONSTRAINT "locatarios_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "enderecoId" DROP NOT NULL,
ADD CONSTRAINT "locatarios_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "Endereco";

-- DropTable
DROP TABLE "Proprietario";

-- CreateTable
CREATE TABLE "proprietarios" (
    "id" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "enderecoId" INTEGER NOT NULL,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "proprietarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valor_imovel_historico" (
    "id" SERIAL NOT NULL,
    "proprietarioId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DECIMAL(65,30) NOT NULL,
    "observacao" TEXT,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "valor_imovel_historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valor_aluguel_historico" (
    "id" SERIAL NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "novoValor" DECIMAL(65,30) NOT NULL,
    "motivo" TEXT,

    CONSTRAINT "valor_aluguel_historico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "anexos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "anexos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "proprietarios_documento_key" ON "proprietarios"("documento");

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valor_imovel_historico" ADD CONSTRAINT "valor_imovel_historico_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locatarios" ADD CONSTRAINT "locatarios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valor_aluguel_historico" ADD CONSTRAINT "valor_aluguel_historico_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ImovelToProprietario" ADD CONSTRAINT "_ImovelToProprietario_B_fkey" FOREIGN KEY ("B") REFERENCES "proprietarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
