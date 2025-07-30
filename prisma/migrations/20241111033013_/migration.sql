/*
  Warnings:

  - You are about to drop the column `endereco` on the `imoveis` table. All the data in the column will be lost.
  - Added the required column `enderecoId` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nome` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `porcentagem_imobiliaria` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `imoveis` table without a default value. This is not possible if the table is not empty.
  - Added the required column `valor` to the `imoveis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "endereco",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "enderecoId" INTEGER NOT NULL,
ADD COLUMN     "nome" TEXT NOT NULL,
ADD COLUMN     "porcentagem_imobiliaria" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "valor" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "valor_aluguel" DOUBLE PRECISION,
ADD COLUMN     "valor_condominio" DOUBLE PRECISION,
ADD COLUMN     "valor_iptu" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Endereco" (
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

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
