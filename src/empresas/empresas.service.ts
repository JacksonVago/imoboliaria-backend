import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from './empresas.controller';

@Injectable()
export class EmpresasService {
  constructor(private PrismaService: PrismaService) { }
  async createUser(createEmpresaDto: CreateEmpresaDto) {
    const checkIfUserExists = await this.PrismaService.empresa.findUnique({
      where: {
        cnpj: createEmpresaDto.cnpj,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' empresa exists');
    }

    return await this.PrismaService.empresa.create({
      data: {
        nome: createEmpresaDto.nome,
        cnpj: createEmpresaDto.cnpj,
        telefone: createEmpresaDto.telefone,
        email: createEmpresaDto.email,
        status: createEmpresaDto.status,
        avisosReajusteLocacao: createEmpresaDto.avisosReajusteLocacao,
        avisosRenovacaoContrato: createEmpresaDto.avisosRenovacaoContrato,
        avisosSeguroFianca: createEmpresaDto.avisosSeguroFianca,
        avisosSeguroIncendio: createEmpresaDto.avisosSeguroIncendio,
        avisosTituloCapitalizacao: createEmpresaDto.avisosTituloCapitalizacao,
        avisosDepositoCalcao: createEmpresaDto.avisosDepositoCalcao,
        porcentagemComissao: createEmpresaDto.porcentagemComissao,
        emiteBoleto: createEmpresaDto.emiteBoleto,
        valorTaxaBoleto: createEmpresaDto.valorTaxaBoleto,
        emissaoBoletoAntecedencia: createEmpresaDto.emissaoBoletoAntecedencia,
        porcentagemMultaAtraso: createEmpresaDto.porcentagemMultaAtraso,
        porcentagemJurosAtraso: createEmpresaDto.porcentagemJurosAtraso,

        endereco: {
          create: {
            logradouro: createEmpresaDto?.logradouro,
            numero: createEmpresaDto?.numero,
            bairro: createEmpresaDto?.bairro,
            cidade: createEmpresaDto?.cidade,
            estado: createEmpresaDto?.estado,
            cep: createEmpresaDto?.cep,
            complemento: createEmpresaDto?.complemento,
          },
        }
      },
      include: {
        endereco: true
      },
    });
  }

  async update(id: number, data: CreateEmpresaDto) {
    await this.checkEmpresaExists(id);

    const {
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      complemento,
      ...empresaData
    } = data;
    // Atualiza os dados do imóvel

    const result = await this.PrismaService.empresa.update({
      where: { id },
      data: {
        nome: data.nome,
        cnpj: data.cnpj,
        telefone: data.telefone,
        email: data.email,
        status: data.status,
        emiteBoleto: data.emiteBoleto,
        avisosReajusteLocacao: data.avisosReajusteLocacao,
        avisosRenovacaoContrato: data.avisosRenovacaoContrato,
        avisosSeguroFianca: data.avisosSeguroFianca,
        avisosSeguroIncendio: data.avisosSeguroIncendio,
        avisosTituloCapitalizacao: data.avisosTituloCapitalizacao,
        avisosDepositoCalcao: data.avisosDepositoCalcao,
        porcentagemComissao: data.porcentagemComissao,
        valorTaxaBoleto: data.valorTaxaBoleto,
        emissaoBoletoAntecedencia: data.emissaoBoletoAntecedencia,
        porcentagemMultaAtraso: data.porcentagemMultaAtraso,
        porcentagemJurosAtraso: data.porcentagemJurosAtraso,

        //if we have any address data, update it
        endereco:
          logradouro ||
            numero ||
            bairro ||
            cidade ||
            estado ||
            cep ||
            complemento
            ? {
              update: {
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                complemento,
              },
            }
            : undefined,
      },
      include: { endereco: true },
    });
    //check if we have a new valores to gerenate ImovelValorHistorico

    /*
    if (
      data.valor_iptu ||
      data.valor_condominio ||
      data.valor_aluguel ||
      data.valor_venda
    ) {
      if (data.valor_iptu) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.IPTU,
            valor: data.valor_iptu,
            imovelId: id,
          },
        });
      }

      if (data.valor_condominio) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.CONDOMINIO,
            valor: data.valor_condominio,
            imovelId: id,
          },
        });
      }

      if (data.valor_aluguel) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.ALUGUEL,
            valor: data.valor_aluguel,
            imovelId: id,
          },
        });
      }

      if (data.valor_venda) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.VENDA,
            valor: data.valor_venda,
            imovelId: id,
          },
        });
      }

      if (data.valor_agua) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.AGUA,
            valor: data.valor_agua,
            imovelId: id,
          },
        });
      }

      if (data.valor_taxa_lixo) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.TAXA_LIXO,
            valor: data.valor_taxa_lixo,
            imovelId: id,
          },
        });
      }
    }*/

    return result;
  }

  async get() {
    return await this.PrismaService.imovelTipo.findMany({
    });
  }

  private async checkEmpresaExists(id: number) {
    const empresa = await this.PrismaService.empresa.findUnique({
      where: {
        id: id,
      },
    });

    if (!empresa) {
      throw new NotFoundException('Empresa not found');
    }
  }
}
