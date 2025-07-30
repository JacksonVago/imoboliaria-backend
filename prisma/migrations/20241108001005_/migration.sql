/*
  Warnings:

  - The primary key for the `Proprietario` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Proprietario` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `proprietarioId` column on the `imoveis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_proprietarioId_fkey";

-- AlterTable
ALTER TABLE "Proprietario" DROP CONSTRAINT "Proprietario_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Proprietario_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "proprietarioId",
ADD COLUMN     "proprietarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_proprietarioId_fkey" FOREIGN KEY ("proprietarioId") REFERENCES "Proprietario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
