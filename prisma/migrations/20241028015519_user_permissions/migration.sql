/*
  Warnings:

  - You are about to drop the `ContratoLocacao` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Proprietario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ContratoLocacaoToLocatario` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `imoveis` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `internal_users` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `locatarios` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('CREATE_USER', 'VIEW_PROPERTIES', 'MANAGE_LISTINGS');

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- DropForeignKey
ALTER TABLE "_ContratoLocacaoToLocatario" DROP CONSTRAINT "_ContratoLocacaoToLocatario_A_fkey";

-- DropForeignKey
ALTER TABLE "_ContratoLocacaoToLocatario" DROP CONSTRAINT "_ContratoLocacaoToLocatario_B_fkey";

-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_proprietarioId_fkey";

-- DropTable
DROP TABLE "ContratoLocacao";

-- DropTable
DROP TABLE "Proprietario";

-- DropTable
DROP TABLE "_ContratoLocacaoToLocatario";

-- DropTable
DROP TABLE "imoveis";

-- DropTable
DROP TABLE "internal_users";

-- DropTable
DROP TABLE "locatarios";

-- DropEnum
DROP TYPE "EstadoCivil";

-- DropEnum
DROP TYPE "TipoImovel";

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "permissions" "Permission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
