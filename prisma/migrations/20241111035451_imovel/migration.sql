/*
  Warnings:

  - The primary key for the `imoveis` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `imoveis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id");
