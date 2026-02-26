-- CreateEnum
CREATE TYPE "Permission" AS ENUM ('ALL', 'CREATE_EMPRESA', 'UPDATE_EMPRESA', 'DELETE_EMPRESA', 'VIEW_EMPRESAS', 'CREATE_TIPO', 'UPDATE_TIPO', 'DELETE_TIPO', 'VIEW_TIPOS', 'CREATE_TIPO_LANC', 'UPDATE_TIPO_LANC', 'DELETE_TIPO_LANC', 'VIEW_TIPOS_LANC', 'CREATE_CONDOMINIO', 'UPDATE_CONDOMINIO', 'DELETE_CONDOMINIO', 'VIEW_CONDOMINIOS', 'CREATE_BLOCO', 'UPDATE_BLOCO', 'DELETE_BLOCO', 'VIEW_BLOCOS', 'CREATE_IMOVEL', 'UPDATE_IMOVEL', 'DELETE_IMOVEL', 'VIEW_IMOVELS', 'CREATE_LOCATARIO', 'UPDATE_LOCATARIO', 'DELETE_LOCATARIO', 'VIEW_LOCATARIOS', 'CREATE_PESSOA', 'UPDATE_PESSOA', 'DELETE_PESSOA', 'VIEW_PESSOAS', 'CREATE_PROPRIETARIO', 'UPDATE_PROPRIETARIO', 'DELETE_PROPRIETARIO', 'VIEW_PROPRIETARIOS', 'CREATE_LOCACAO', 'UPDATE_LOCACAO', 'DELETE_LOCACAO', 'VIEW_LOCACOES', 'CREATE_LOCACAO_LANCAMENTO', 'UPDATE_LOCACAO_LANCAMENTO', 'DELETE_LOCACAO_LANCAMENTO', 'VIEW_LOCACAO_LANCAMENTOS', 'CREATE_CONDOMINIO_LANCAMENTO', 'UPDATE_CONDOMINIO_LANCAMENTO', 'DELETE_CONDOMINIO_LANCAMENTO', 'VIEW_CONDOMINIO_LANCAMENTOS', 'CREATE_PAGAMENTO', 'UPDATE_PAGAMENTO', 'DELETE_PAGAMENTO', 'VIEW_PAGAMENTOS', 'CREATE_REAJUSTE', 'UPDATE_REAJUSTE', 'DELETE_REAJUSTE', 'VIEW_REAJUSTES', 'PAGSEGURO_CREATE_ORDER', 'PAGSEGURO_UPDATE_ORDER', 'PAGSEGURO_DELETE_ORDER', 'PAGSEGURO_VIEW_ORDERS');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'COLLABORATOR');

-- CreateEnum
CREATE TYPE "EstadoCivil" AS ENUM ('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL');

-- CreateEnum
CREATE TYPE "ImovelStatus" AS ENUM ('DISPONIVEL', 'ALUGADO', 'VENDIDO', 'INDISPONIVEL', 'INATIVO');

-- CreateEnum
CREATE TYPE "TipoAssinatura" AS ENUM ('BASICO', 'PADRAO', 'PREMIU');

-- CreateEnum
CREATE TYPE "FrequenciaAssinatura" AS ENUM ('ANUAL', 'SEMESTRAL', 'TRIMESTRAL', 'MENSAL');

-- CreateEnum
CREATE TYPE "ValorImovelTipo" AS ENUM ('VENDA', 'ALUGUEL', 'IPTU', 'CONDOMINIO', 'AGUA', 'TAXA_LIXO', 'PORCENTAGEM_LUCRO_IMOBILIARIA');

-- CreateEnum
CREATE TYPE "GarantiaLocacaoTypes" AS ENUM ('SEGURO_FIANCA', 'TITULO_CAPITALIZACAO', 'DEPOSITO_CALCAO', 'FIADOR');

-- CreateEnum
CREATE TYPE "LocacaoStatus" AS ENUM ('ATIVA', 'ENCERRADA', 'AGUARDANDO_DOCUMENTOS');

-- CreateEnum
CREATE TYPE "PessoaStatus" AS ENUM ('ATIVA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "lancamentoTipo" AS ENUM ('DEBITO', 'CREDITO');

-- CreateEnum
CREATE TYPE "lancamentoStatus" AS ENUM ('ABERTO', 'CONFIRMADO');

-- CreateEnum
CREATE TYPE "ImovelFinalidade" AS ENUM ('ALUGUEL', 'VENDA', 'AMBOS');

-- CreateEnum
CREATE TYPE "BoletoStatus" AS ENUM ('PENDENTE', 'CONFIRMADO', 'ATRASADO', 'PAGO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "LocalDeposito" AS ENUM ('IMOBILIARIA', 'PROPRIETARIO');

-- CreateEnum
CREATE TYPE "FormaRateio" AS ENUM ('IGUALITARIO', 'FRACAO_IDEAL');

-- CreateTable
CREATE TABLE "empresas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "enderecoId" INTEGER NOT NULL,
    "telefone" TEXT,
    "email" TEXT,
    "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA',
    "avisosReajusteLocacao" INTEGER NOT NULL DEFAULT 30,
    "avisosRenovacaoContrato" INTEGER NOT NULL DEFAULT 30,
    "avisosSeguroFianca" INTEGER NOT NULL DEFAULT 30,
    "avisosSeguroIncendio" INTEGER NOT NULL DEFAULT 30,
    "avisosTituloCapitalizacao" INTEGER NOT NULL DEFAULT 30,
    "avisosDepositoCalcao" INTEGER NOT NULL DEFAULT 30,
    "porcentagemComissao" DOUBLE PRECISION NOT NULL DEFAULT 8,
    "emiteBoleto" TEXT NOT NULL DEFAULT 'N',
    "valorTaxaBoleto" DOUBLE PRECISION NOT NULL DEFAULT 5,
    "tipoLancamento" INTEGER,
    "emissaoBoletoAntecedencia" INTEGER NOT NULL DEFAULT 5,
    "porcentagemMultaAtraso" DOUBLE PRECISION NOT NULL DEFAULT 2,
    "porcentagemJurosAtraso" DOUBLE PRECISION NOT NULL DEFAULT 0.1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentotipos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tipo" "lancamentoTipo" NOT NULL DEFAULT 'DEBITO',
    "automatico" TEXT NOT NULL DEFAULT 'S',
    "parcelas" INTEGER NOT NULL DEFAULT 0,
    "geraObservacao" TEXT NOT NULL DEFAULT 'N',
    "valorFixo" DOUBLE PRECISION,
    "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "lancamentotipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imoveltipos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "status" "PessoaStatus" NOT NULL DEFAULT 'ATIVA',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "imoveltipos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'COLLABORATOR',
    "permissions" "Permission"[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" SERIAL NOT NULL,
    "logradouro" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "complemento" TEXT,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "estado" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pessoas" (
    "id" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "profissao" TEXT,
    "estadoCivil" "EstadoCivil",
    "enderecoId" INTEGER NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "status" "PessoaStatus" NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "condominios" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "observacao" TEXT,
    "enderecoId" INTEGER NOT NULL,
    "formaRateio" "FormaRateio" NOT NULL DEFAULT 'IGUALITARIO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "condominios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blocos" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "observacao" TEXT,
    "qtdUnidades" INTEGER NOT NULL,
    "totalAndares" INTEGER,
    "possuiElevador" TEXT,
    "anoConstrucao" INTEGER,
    "condominioId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blocos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imoveis" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "status" "ImovelStatus" NOT NULL,
    "description" TEXT,
    "tipoId" INTEGER NOT NULL,
    "finalidade" "ImovelFinalidade" NOT NULL DEFAULT 'ALUGUEL',
    "porcentagemLucroImobiliaria" DOUBLE PRECISION NOT NULL,
    "valorAluguel" DOUBLE PRECISION DEFAULT 0,
    "metrage" DOUBLE PRECISION,
    "quartos" INTEGER,
    "banheiros" INTEGER,
    "vagasEstacionamento" INTEGER,
    "andar" INTEGER,
    "enderecoId" INTEGER NOT NULL,
    "condominioId" INTEGER,
    "blocoId" INTEGER,
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "proprietarios" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,
    "cotaImovel" DOUBLE PRECISION NOT NULL DEFAULT 100,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "proprietarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locatarios" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,

    CONSTRAINT "locatarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fiadores" (
    "id" SERIAL NOT NULL,
    "pessoaId" INTEGER NOT NULL,

    CONSTRAINT "fiadores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imovelphotos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "imovelId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "imovelphotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacoes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "observacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "observacaoanexos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "url" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "observacaoId" INTEGER NOT NULL,

    CONSTRAINT "observacaoanexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "valorimovelhistorico" (
    "id" SERIAL NOT NULL,
    "proprietarioId" INTEGER,
    "tipo" "ValorImovelTipo" NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valor" DECIMAL(65,30) NOT NULL,
    "observacao" TEXT,
    "imovelId" INTEGER NOT NULL,

    CONSTRAINT "valorimovelhistorico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "locacoes" (
    "id" SERIAL NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "status" "LocacaoStatus" NOT NULL DEFAULT 'ATIVA',
    "imovelId" INTEGER,
    "diaVencimento" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "garantiaLocacaoTipo" "GarantiaLocacaoTypes",
    "empresaId" INTEGER NOT NULL,

    CONSTRAINT "locacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepositoCalcao" (
    "id" SERIAL NOT NULL,
    "valorDeposito" DOUBLE PRECISION NOT NULL,
    "quantidadeMeses" INTEGER NOT NULL,
    "localDeposito" "LocalDeposito" NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "DepositoCalcao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguroFianca" (
    "id" SERIAL NOT NULL,
    "numeroSeguro" TEXT NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "SeguroFianca_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SeguroIncendio" (
    "id" SERIAL NOT NULL,
    "numeroApolice" TEXT NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "vigenciaInicio" TIMESTAMP(3) NOT NULL,
    "vigenciaFim" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeguroIncendio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TituloCapitalizacao" (
    "id" SERIAL NOT NULL,
    "numeroTitulo" TEXT NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "TituloCapitalizacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "genericanexos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "name" TEXT,
    "size" INTEGER,
    "type" TEXT,
    "tipoArquivo" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "pessoaId" INTEGER,
    "locacaoId" INTEGER,
    "imovelId" INTEGER,
    "boletoId" INTEGER,
    "condominioId" INTEGER,
    "blocoId" INTEGER,

    CONSTRAINT "genericanexos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reajustes" (
    "id" SERIAL NOT NULL,
    "percentualRejuste" DOUBLE PRECISION NOT NULL,
    "valorAluguel" DOUBLE PRECISION NOT NULL,
    "valorRejuste" DOUBLE PRECISION NOT NULL,
    "dataReajuste" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,

    CONSTRAINT "reajustes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentoslocacoes" (
    "id" SERIAL NOT NULL,
    "parcela" INTEGER,
    "tipoId" INTEGER NOT NULL,
    "valorLancamento" DOUBLE PRECISION NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "vencimentoLancamento" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "status" "lancamentoStatus" NOT NULL DEFAULT 'ABERTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "boletoId" INTEGER,

    CONSTRAINT "lancamentoslocacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletos" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "locacaoId" INTEGER NOT NULL,
    "status" "BoletoStatus" NOT NULL DEFAULT 'PENDENTE',
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "valorOriginal" DOUBLE PRECISION NOT NULL,
    "valorPago" DOUBLE PRECISION,
    "locatarioId" INTEGER,

    CONSTRAINT "boletos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "boletosbancarios" (
    "id" SERIAL NOT NULL,
    "boletoId" INTEGER NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "dataBoleto" TIMESTAMP(3) NOT NULL,
    "dataVencimento" TIMESTAMP(3) NOT NULL,
    "dataPagamento" TIMESTAMP(3),
    "formaPix" TEXT NOT NULL,
    "codigoBarras" TEXT NOT NULL,
    "linhaDigitavel" TEXT NOT NULL,
    "nossoNumero" TEXT NOT NULL,
    "urlBoleto" TEXT NOT NULL,
    "registrado" TEXT NOT NULL,
    "emvPIX" TEXT NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "observacao" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "boletosbancarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lancamentoscondominios" (
    "id" SERIAL NOT NULL,
    "parcela" INTEGER,
    "tipoId" INTEGER NOT NULL,
    "valorLancamento" DOUBLE PRECISION NOT NULL,
    "dataLancamento" TIMESTAMP(3) NOT NULL,
    "vencimentoLancamento" TIMESTAMP(3) NOT NULL,
    "observacao" TEXT NOT NULL,
    "status" "lancamentoStatus" NOT NULL DEFAULT 'ABERTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blocoId" INTEGER NOT NULL,
    "boletoId" INTEGER,

    CONSTRAINT "lancamentoscondominios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "assinaturas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "descricao" TEXT NOT NULL,
    "tipo" "TipoAssinatura" NOT NULL,
    "frequencia" "FrequenciaAssinatura" NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "assinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "empresasassinaturas" (
    "id" SERIAL NOT NULL,
    "empresaId" INTEGER NOT NULL,
    "assinaturaId" INTEGER NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFim" TIMESTAMP(3) NOT NULL,
    "status" "BoletoStatus" NOT NULL DEFAULT 'PENDENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "empresasassinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentosassinaturas" (
    "id" SERIAL NOT NULL,
    "empassinaturaId" INTEGER NOT NULL,
    "dataPagamento" TIMESTAMP(3) NOT NULL,
    "valorPago" DOUBLE PRECISION NOT NULL,
    "metodoPagamento" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "empresa_pagamento" TEXT NOT NULL,
    "id_request" TEXT,
    "reference_id" TEXT,
    "created_at" TIMESTAMP(3),
    "costumer_name" TEXT,
    "costumer_email" TEXT,
    "costumer_tax_id" TEXT,
    "costumer_phone_type" TEXT,
    "costumer_phone_country" TEXT,
    "costumer_phone_area" TEXT,
    "costumer_phone_number" TEXT,
    "items_reference_id" TEXT,
    "items_name" TEXT,
    "items_quantity" INTEGER,
    "items_unit_amount" DOUBLE PRECISION,
    "shipping_address_street" TEXT,
    "shipping_address_number" TEXT,
    "shipping_address_locality" TEXT,
    "shipping_address_city" TEXT,
    "shipping_address_region_code" TEXT,
    "shipping_address_country" TEXT,
    "shipping_address_postal_code" TEXT,
    "charges_id" TEXT,
    "charges_reference_id" TEXT,
    "charges_status" TEXT,
    "charges_created_at" TIMESTAMP(3),
    "charges_paid_at" TIMESTAMP(3),
    "charges_description" TEXT,
    "charges_amount_value" DOUBLE PRECISION,
    "charges_amount_currency" TEXT,
    "charges_amount_summary_total" DOUBLE PRECISION,
    "charges_amount_summary_paid" DOUBLE PRECISION,
    "charges_amount_summary_refunded" DOUBLE PRECISION NOT NULL,
    "charges_payment_response_code" INTEGER,
    "charges_payment_response_message" TEXT,
    "charges_payment_response_reference" TEXT,
    "charges_payment_response_raw_data_authorization_code" TEXT,
    "charges_payment_response_raw_data_nsu" TEXT,
    "charges_payment_response_raw_data_tid" TEXT,
    "charges_payment_response_raw_data_reason_code" TEXT,
    "charges_payment_method_type" TEXT,
    "charges_payment_method_installments" INTEGER,
    "charges_payment_method_capture" BOOLEAN,
    "charges_payment_method_soft_description" TEXT,
    "charges_payment_method_card_id" TEXT,
    "charges_payment_method_card_brand" TEXT,
    "charges_payment_method_card_first_digits" TEXT,
    "charges_payment_method_card_last_digits" TEXT,
    "charges_payment_method_card_exp_month" TEXT,
    "charges_payment_method_card_exp_year" TEXT,
    "charges_payment_method_card_store" BOOLEAN,
    "charges_payment_method_holder_name" TEXT,
    "charges_payment_method_holder_tax_id" TEXT,

    CONSTRAINT "pagamentosassinaturas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagamentolinks" (
    "id" SERIAL NOT NULL,
    "pagamentoAssinaturaId" INTEGER NOT NULL,
    "rel" TEXT,
    "href" TEXT NOT NULL,
    "media" TEXT,
    "method" TEXT,

    CONSTRAINT "pagamentolinks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FiadorToLocacao" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "_LocacaoToLocatario" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "empresas_cnpj_key" ON "empresas"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "lancamentotipos_name_key" ON "lancamentotipos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "imoveltipos_name_key" ON "imoveltipos"("name");

-- CreateIndex
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_documento_key" ON "pessoas"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "fiadores_pessoaId_key" ON "fiadores"("pessoaId");

-- CreateIndex
CREATE UNIQUE INDEX "DepositoCalcao_locacaoId_key" ON "DepositoCalcao"("locacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "SeguroFianca_locacaoId_key" ON "SeguroFianca"("locacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "SeguroIncendio_locacaoId_key" ON "SeguroIncendio"("locacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "TituloCapitalizacao_locacaoId_key" ON "TituloCapitalizacao"("locacaoId");

-- CreateIndex
CREATE UNIQUE INDEX "_FiadorToLocacao_AB_unique" ON "_FiadorToLocacao"("A", "B");

-- CreateIndex
CREATE INDEX "_FiadorToLocacao_B_index" ON "_FiadorToLocacao"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_LocacaoToLocatario_AB_unique" ON "_LocacaoToLocatario"("A", "B");

-- CreateIndex
CREATE INDEX "_LocacaoToLocatario_B_index" ON "_LocacaoToLocatario"("B");

-- AddForeignKey
ALTER TABLE "empresas" ADD CONSTRAINT "empresas_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentotipos" ADD CONSTRAINT "lancamentotipos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveltipos" ADD CONSTRAINT "imoveltipos_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pessoas" ADD CONSTRAINT "pessoas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios" ADD CONSTRAINT "condominios_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "condominios" ADD CONSTRAINT "condominios_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blocos" ADD CONSTRAINT "blocos_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "imoveltipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_enderecoId_fkey" FOREIGN KEY ("enderecoId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "condominios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "proprietarios" ADD CONSTRAINT "proprietarios_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locatarios" ADD CONSTRAINT "locatarios_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fiadores" ADD CONSTRAINT "fiadores_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imovelphotos" ADD CONSTRAINT "imovelphotos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacoes" ADD CONSTRAINT "observacoes_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "observacaoanexos" ADD CONSTRAINT "observacaoanexos_observacaoId_fkey" FOREIGN KEY ("observacaoId") REFERENCES "observacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "valorimovelhistorico" ADD CONSTRAINT "valorimovelhistorico_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locacoes" ADD CONSTRAINT "locacoes_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "locacoes" ADD CONSTRAINT "locacoes_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepositoCalcao" ADD CONSTRAINT "DepositoCalcao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroFianca" ADD CONSTRAINT "SeguroFianca_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeguroIncendio" ADD CONSTRAINT "SeguroIncendio_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TituloCapitalizacao" ADD CONSTRAINT "TituloCapitalizacao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_pessoaId_fkey" FOREIGN KEY ("pessoaId") REFERENCES "pessoas"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "condominios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "genericanexos" ADD CONSTRAINT "genericanexos_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reajustes" ADD CONSTRAINT "reajustes_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentoslocacoes" ADD CONSTRAINT "lancamentoslocacoes_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "lancamentotipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentoslocacoes" ADD CONSTRAINT "lancamentoslocacoes_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentoslocacoes" ADD CONSTRAINT "lancamentoslocacoes_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "locacoes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletos" ADD CONSTRAINT "boletos_locatarioId_fkey" FOREIGN KEY ("locatarioId") REFERENCES "locatarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "boletosbancarios" ADD CONSTRAINT "boletosbancarios_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentoscondominios" ADD CONSTRAINT "lancamentoscondominios_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "lancamentotipos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentoscondominios" ADD CONSTRAINT "lancamentoscondominios_blocoId_fkey" FOREIGN KEY ("blocoId") REFERENCES "blocos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lancamentoscondominios" ADD CONSTRAINT "lancamentoscondominios_boletoId_fkey" FOREIGN KEY ("boletoId") REFERENCES "boletos"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresasassinaturas" ADD CONSTRAINT "empresasassinaturas_empresaId_fkey" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "empresasassinaturas" ADD CONSTRAINT "empresasassinaturas_assinaturaId_fkey" FOREIGN KEY ("assinaturaId") REFERENCES "assinaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentosassinaturas" ADD CONSTRAINT "pagamentosassinaturas_empassinaturaId_fkey" FOREIGN KEY ("empassinaturaId") REFERENCES "empresasassinaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagamentolinks" ADD CONSTRAINT "pagamentolinks_pagamentoAssinaturaId_fkey" FOREIGN KEY ("pagamentoAssinaturaId") REFERENCES "pagamentosassinaturas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FiadorToLocacao" ADD CONSTRAINT "_FiadorToLocacao_A_fkey" FOREIGN KEY ("A") REFERENCES "fiadores"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FiadorToLocacao" ADD CONSTRAINT "_FiadorToLocacao_B_fkey" FOREIGN KEY ("B") REFERENCES "locacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocacaoToLocatario" ADD CONSTRAINT "_LocacaoToLocatario_A_fkey" FOREIGN KEY ("A") REFERENCES "locacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocacaoToLocatario" ADD CONSTRAINT "_LocacaoToLocatario_B_fkey" FOREIGN KEY ("B") REFERENCES "locatarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
