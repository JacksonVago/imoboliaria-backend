-- CreateTable
CREATE TABLE "locatarios" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "documento" TEXT NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "enderecoId" INTEGER NOT NULL,
    "email" TEXT,
    "telefone" TEXT,

    CONSTRAINT "locatarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locacao" (
    "id" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3),
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "locatarioId" TEXT NOT NULL,

    CONSTRAINT "Locacao_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "locatarios" ADD CONSTRAINT "locatarios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "Endereco"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
