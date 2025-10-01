/*
  Warnings:

  - You are about to drop the column `tipo` on the `imoveis` table. All the data in the column will be lost.
  - Added the required column `tipoId` to the `imoveis` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "tipo",
ADD COLUMN     "tipoId" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "ImovelTipo";

-- CreateTable
CREATE TABLE "tipo_imovel" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tipo_imovel_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tipo_imovel_name_key" ON "tipo_imovel"("name");

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "tipo_imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
