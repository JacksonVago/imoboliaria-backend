import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmpresaDto } from './empresas.controller';

@Injectable()
export class EmpresasService {
  constructor(private PrismaService: PrismaService) { }
  async create(createEmpresaDto: CreateEmpresaDto) {
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
        lancamentoTipo: createEmpresaDto.tipoId ? { connect: { id: createEmpresaDto.tipoId } } : undefined,

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
        lancamentoTipo: data.tipoId ? { connect: { id: data.tipoId } } : undefined,

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

    return result;
  }

  async get(id: number) {
    return await this.PrismaService.empresa.findUnique({
      where: {
        id: id,
      },
      include: {
        endereco: true
      }
    });
  }

  async getMany() {
    return await this.PrismaService.empresa.findMany({
      include: {
        endereco: true
      }
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
