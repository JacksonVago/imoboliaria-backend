-- AlterTable
ALTER TABLE "generic_anexos" ADD COLUMN     "locacaoId" INTEGER,
ADD COLUMN     "seguroFiancaId" INTEGER,
ADD COLUMN     "tituloCapitalizacaoId" INTEGER;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_seguroFiancaId_fkey" FOREIGN KEY ("seguroFiancaId") REFERENCES "SeguroFianca"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_tituloCapitalizacaoId_fkey" FOREIGN KEY ("tituloCapitalizacaoId") REFERENCES "TituloCapitalizacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;
