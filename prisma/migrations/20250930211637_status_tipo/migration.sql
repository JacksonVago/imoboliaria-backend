-- AlterTable
ALTER TABLE "empresas" ADD COLUMN     "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA';

-- AlterTable
ALTER TABLE "imovel_tipo" ADD COLUMN     "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA';
