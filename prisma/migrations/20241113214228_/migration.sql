/*
  Warnings:

  - A unique constraint covering the columns `[imovelId]` on the table `Locacao` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Locacao_imovelId_key" ON "Locacao"("imovelId");
