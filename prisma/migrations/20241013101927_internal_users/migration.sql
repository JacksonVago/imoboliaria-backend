/*
  Warnings:

  - You are about to drop the `Imovel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Locatario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Imovel" DROP CONSTRAINT "Imovel_proprietarioId_fkey";

-- DropForeignKey
ALTER TABLE "_ContratoLocacaoToLocatario" DROP CONSTRAINT "_ContratoLocacaoToLocatario_B_fkey";

-- DropTable
DROP TABLE "Imovel";

-- DropTable
DROP TABLE "Locatario";

-- CreateTable
CREATE TABLE "internal_users" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "endereco" TEXT,
    "email" TEXT,
    "telefone" TEXT,
    "funcao" TEXT,

    CONSTRAINT "internal_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locatarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "endereco" TEXT,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "locatarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imoveis" (
    "id" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "proprietarioId" TEXT,

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "internal_users_nome_key" ON "internal_users"("nome");

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContratoLocacaoToLocatario" ADD CONSTRAINT "_ContratoLocacaoToLocatario_B_fkey" FOREIGN KEY ("B") REFERENCES "locatarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
