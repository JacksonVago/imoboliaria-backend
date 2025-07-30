-- CreateEnum
CREATE TYPE "LocacaoStatus" AS ENUM ('ATIVA', 'ENCERRADA');

-- AlterTable
ALTER TABLE "Locacao" ADD COLUMN     "status" "LocacaoStatus" NOT NULL DEFAULT 'ATIVA';

-- AlterTable
ALTER TABLE "imoveis" ADD COLUMN     "valor_agua" DOUBLE PRECISION,
ADD COLUMN     "valor_taxa_lixo" DOUBLE PRECISION;
