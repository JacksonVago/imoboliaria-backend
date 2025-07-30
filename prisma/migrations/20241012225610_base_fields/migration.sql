-- CreateEnum
CREATE TYPE "TipoImovel" AS ENUM ('CASA', 'APARTAMENTO', 'TERRENO');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO');

-- CreateTable
CREATE TABLE "Proprietario" (
    "id" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "endereco" TEXT,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "Proprietario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locatario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "endereco" TEXT,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "Locatario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContratoLocacao" (
    "id" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ContratoLocacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "proprietarioId" TEXT,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ContratoLocacaoToLocatario" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ContratoLocacaoToLocatario_AB_unique" ON "_ContratoLocacaoToLocatario"("A", "B");

-- CreateIndex
CREATE INDEX "_ContratoLocacaoToLocatario_B_index" ON "_ContratoLocacaoToLocatario"("B");

-- AddForeignKey
ALTER TABLE "Imovel" ADD CONSTRAINT "Imovel_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContratoLocacaoToLocatario" ADD CONSTRAINT "_ContratoLocacaoToLocatario_A_fkey" FOREIGN KEY ("A") REFERENCES "ContratoLocacao"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ContratoLocacaoToLocatario" ADD CONSTRAINT "_ContratoLocacaoToLocatario_B_fkey" FOREIGN KEY ("B") REFERENCES "Locatario"("id") ON DELETE CASCADE ON UPDATE CASCADE;
