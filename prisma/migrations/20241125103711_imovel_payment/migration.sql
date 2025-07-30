-- CreateTable
CREATE TABLE "Pagamento" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "statusPagamento" TEXT NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "locatarioId" INTEGER,
    "anexoId" INTEGER,

    CONSTRAINT "Pagamento_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_anexoId_fkey" FOREIGN KEY ("anexoId") REFERENCES "anexos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
