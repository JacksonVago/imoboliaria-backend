-- DropForeignKey
ALTER TABLE "Locacao" DROP CONSTRAINT "Locacao_imovelId_fkey";

-- DropIndex
DROP INDEX "Locacao_imovelId_key";

-- AlterTable
ALTER TABLE "Locacao" ALTER COLUMN "imovelId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;
