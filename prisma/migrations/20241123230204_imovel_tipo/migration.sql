/*
  Warnings:

  - Changed the type of `tipo` on the `imoveis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ImovelTipo" AS ENUM ('CASA', 'APARTAMENTO', 'TERRENO');

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "tipo",
ADD COLUMN     "tipo" "ImovelTipo" NOT NULL;
