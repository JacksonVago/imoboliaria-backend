/*
  Warnings:

  - The values [CREATE_USER,VIEW_PROPERTIES,MANAGE_LISTINGS] on the enum `Permission` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `proprietarioId` on the `imoveis` table. All the data in the column will be lost.
  - Added the required column `tipo` to the `valor_imovel_historico` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ValorImovelTipo" AS ENUM ('VENDA', 'ALUGUEL', 'IPTU', 'CONDOMINIO', 'AGUA', 'TAXA_LIXO', 'PORCENTAGEM_LUCRO_IMOBILIARIA');

-- AlterEnum
BEGIN;
CREATE TYPE "Permission_new" AS ENUM ('ALL', 'CREATE_IMOVEL', 'UPDATE_IMOVEL', 'DELETE_IMOVEL', 'VIEW_IMOVELS', 'CREATE_LOCATARIO', 'UPDATE_LOCATARIO', 'DELETE_LOCATARIO', 'VIEW_LOCATARIOS', 'CREATE_PROPRIETARIO', 'UPDATE_PROPRIETARIO', 'DELETE_PROPRIETARIO', 'VIEW_PROPRIETARIOS', 'CREATE_LOCACAO', 'UPDATE_LOCACAO', 'DELETE_LOCACAO', 'VIEW_LOCACOES');
ALTER TABLE "users" ALTER COLUMN "permissions" TYPE "Permission_new"[] USING ("permissions"::text::"Permission_new"[]);
ALTER TYPE "Permission" RENAME TO "Permission_old";
ALTER TYPE "Permission_new" RENAME TO "Permission";
DROP TYPE "Permission_old";
COMMIT;

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "proprietarioId";

-- AlterTable
ALTER TABLE "valor_imovel_historico" ADD COLUMN     "tipo" "ValorImovelTipo" NOT NULL,
ALTER COLUMN "proprietarioId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "generic_anexos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "tipo_arquivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "proprietarioId" INTEGER,

    CONSTRAINT "generic_anexos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "proprietarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
