/*
  Warnings:

  - A unique constraint covering the columns `[documento]` on the table `Proprietario` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Proprietario_documento_key" ON "Proprietario"("documento");
