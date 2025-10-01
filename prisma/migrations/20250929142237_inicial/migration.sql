/*
  Warnings:

  - You are about to drop the `tipo_imovel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_tipoId_fkey";

-- DropTable
DROP TABLE "tipo_imovel";

-- CreateTable
CREATE TABLE "imovel_tipo" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imovel_tipo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "imovel_tipo_name_key" ON "imovel_tipo"("name");

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "imovel_tipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
