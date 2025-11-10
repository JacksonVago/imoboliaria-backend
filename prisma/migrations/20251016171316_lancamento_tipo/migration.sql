/*
  Warnings:

  - You are about to drop the column `lancamentoId` on the `lancamentos` table. All the data in the column will be lost.
  - Added the required column `tipoId` to the `lancamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Permission" ADD VALUE 'CREATE_LANCAMENTO';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_LANCAMENTO';
ALTER TYPE "Permission" ADD VALUE 'DELETE_LANCAMENTO';
ALTER TYPE "Permission" ADD VALUE 'VIEW_LANCAMENTOS';
ALTER TYPE "Permission" ADD VALUE 'CREATE_REAJUSTE';
ALTER TYPE "Permission" ADD VALUE 'UPDATE_REAJUSTE';
ALTER TYPE "Permission" ADD VALUE 'DELETE_REAJUSTE';
ALTER TYPE "Permission" ADD VALUE 'VIEW_REAJUSTES';

-- DropForeignKey
ALTER TABLE "lancamentos" DROP CONSTRAINT "lancamentos_lancamentoId_fkey";

-- AlterTable
ALTER TABLE "lancamentos" DROP COLUMN "lancamentoId",
ADD COLUMN     "tipoId" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ABERTO';

-- AddForeignKey
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "lacamento_tipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
