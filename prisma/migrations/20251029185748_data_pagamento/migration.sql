-- AlterTable
ALTER TABLE "pagamentos" ALTER COLUMN "dataPagamento" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDENTE';
