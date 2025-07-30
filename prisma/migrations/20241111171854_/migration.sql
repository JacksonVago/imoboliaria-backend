/*
  Warnings:

  - You are about to drop the column `endereco` on the `Proprietario` table. All the data in the column will be lost.
  - Added the required column `enderecoId` to the `Proprietario` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Proprietario" DROP COLUMN "endereco",
ADD COLUMN     "enderecoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Proprietario" ADD CONSTRAINT "Proprietario_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
