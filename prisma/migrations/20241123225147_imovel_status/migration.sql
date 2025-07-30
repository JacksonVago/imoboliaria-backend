/*
  Warnings:

  - Changed the type of `status` on the `imoveis` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "ImovelStatus" AS ENUM ('DISPONIVEL', 'ALUGADO', 'VENDIDO', 'INDISPONIVEL');

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "status",
ADD COLUMN     "status" "ImovelStatus" NOT NULL;
