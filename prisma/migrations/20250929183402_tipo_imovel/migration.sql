-- DropForeignKey
ALTER TABLE "imoveis" DROP CONSTRAINT "imoveis_tipoId_fkey";

-- AlterTable
ALTER TABLE "imoveis" ALTER COLUMN "tipoId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "imovel_tipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;
