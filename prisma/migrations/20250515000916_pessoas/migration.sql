/*
  Warnings:

  - You are about to drop the column `proprietarioId` on the `fiadores` table. All the data in the column will be lost.
  - You are about to drop the `_ImovelToProprietario` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[pessoaId]` on the table `fiadores` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pessoaId` to the `fiadores` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imovelId` to the `proprietarios` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_ImovelToProprietario" DROP CONSTRAINT "_ImovelToProprietario_A_fkey";

-- DropForeignKey
ALTER TABLE "_ImovelToProprietario" DROP CONSTRAINT "_ImovelToProprietario_B_fkey";

-- DropForeignKey
ALTER TABLE "fiadores" DROP CONSTRAINT "fiadores_proprietarioId_fkey";

-- AlterTable
ALTER TABLE "fiadores" DROP COLUMN "proprietarioId",
ADD COLUMN     "pessoaId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "proprietarios" ADD COLUMN     "imovelId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_ImovelToProprietario";

-- CreateIndex
CREATE UNIQUE INDEX "fiadores_pessoaId_key" ON "fiadores"("pessoaId");

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiadores" ADD CONSTRAINT "fiadores_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
