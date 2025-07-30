-- CreateTable
CREATE TABLE "SeguroFianca" (
    "id" SERIAL NOT NULL,
    "numeroApolice" TEXT NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "SeguroFianca_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeguroFianca_locacaoId_key" ON "SeguroFianca"("locacaoId");

-- AddForeignKey
ALTER TABLE "SeguroFianca" ADD CONSTRAINT "SeguroFianca_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
