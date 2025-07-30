-- CreateEnum
CREATE TYPE "TipoPessoa" AS ENUM ('FIADOR', 'LOCATARIO', 'PROPRIETARIO');

-- AlterTable
ALTER TABLE "Locacao" ADD COLUMN     "pessoaId" INTEGER;

-- AlterTable
ALTER TABLE "generic_anexos" ADD COLUMN     "pessoaId" INTEGER;

-- AlterTable
ALTER TABLE "imoveis" ADD COLUMN     "pessoaId" INTEGER;

-- CreateTable
CREATE TABLE "persons" (
    "id" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tipo" "TipoPessoa" NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "enderecoId" INTEGER NOT NULL,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "persons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "persons_documento_key" ON "persons"("documento");

-- AddForeignKey
ALTER TABLE "persons" ADD CONSTRAINT "persons_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
