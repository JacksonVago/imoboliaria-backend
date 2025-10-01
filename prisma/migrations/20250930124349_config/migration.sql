/*
  Warnings:

  - A unique constraint covering the columns `[login]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "users_email_key";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "login" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "avisosReajusteLocacao" INTEGER NOT NULL DEFAULT 30,
    "avisosRenovacaoContrato" INTEGER NOT NULL DEFAULT 30,
    "avisosSeguroFianca" INTEGER NOT NULL DEFAULT 30,
    "avisosSeguroIncendio" INTEGER NOT NULL DEFAULT 30,
    "avisosTituloCapitalizacao" INTEGER NOT NULL DEFAULT 30,
    "avisosDepositoCalcao" INTEGER NOT NULL DEFAULT 30,
    "porcentagemComissao" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "valorTaxaBoleto" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "emissaoBoletoAntecedencia" INTEGER NOT NULL DEFAULT 5,
    "porcentagemMultaAtraso" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "porcentagemJurosAtraso" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
