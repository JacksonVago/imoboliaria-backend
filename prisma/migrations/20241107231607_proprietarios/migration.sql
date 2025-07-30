-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

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
CREATE TABLE "imoveis" (
    "id" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "proprietarioId" TEXT,

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
