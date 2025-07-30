-- CreateEnum
CREATE TYPE "PessoaStatus" AS ENUM ('ATIVA', 'CANCELADA');

-- AlterTable
ALTER TABLE "Pagamento" ADD COLUMN     "PessoaId" INTEGER;

-- AlterTable
ALTER TABLE "persons" ADD COLUMN     "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA';

-- AddForeignKey
ALTER TABLE "Pagamento" ADD CONSTRAINT "Pagamento_PessoaId_fkey" FOREIGN KEY ("PessoaId") REFERENCES "persons"("id") ON DELETE SET NULL ON UPDATE CASCADE;
