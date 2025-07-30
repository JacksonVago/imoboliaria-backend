-- AlterTable
ALTER TABLE "generic_anexos" ADD COLUMN     "locatarioId" INTEGER;

-- AddForeignKey
ALTER TABLE "generic_anexos" ADD CONSTRAINT "generic_anexos_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
