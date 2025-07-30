/*
  Warnings:

  - You are about to drop the `persons` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_PESSOA';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_PESSOA';
ALTER TYPE "Permission" ADD VALUE 'DELETE_PESSOA';
ALTER TYPE "Permission" ADD VALUE 'VIEW_PESSOAS';

-- DropForeignKey
ALTER TABLE "generic_anexos" DROP CONSTRAINT "generic_anexos_pessoaId_fkey";

-- DropForeignKey
ALTER TABLE "locatarios" DROP CONSTRAINT "locatarios_pesssoaId_fkey";

-- DropForeignKey
ALTER TABLE "persons" DROP CONSTRAINT "persons_enderecoId_fkey";

-- DropForeignKey
ALTER TABLE "proprietarios" DROP CONSTRAINT "proprietarios_pesssoaId_fkey";

-- DropTable
DROP TABLE "persons";

-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoPessoa" NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "enderecoId" INTEGER NOT NULL,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_documento_key" ON "pessoas"("documento");

-- AddForeignKey
ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_pesssoaId_fkey" FOREIGN KEY ("pesssoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locatarios" ADD CONSTRAINT "locatarios_pesssoaId_fkey" FOREIGN KEY ("pesssoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;
