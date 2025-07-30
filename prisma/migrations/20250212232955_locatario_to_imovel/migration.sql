-- AlterTable
ALTER TABLE "imoveis" ADD COLUMN     "locatarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
