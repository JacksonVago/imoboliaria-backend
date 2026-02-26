import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { CreateTipoDto } from './tipolancamento.controller';

@Injectable()
export class TipoLancamentoService {
  constructor(private PrismaService: PrismaService) { }
  async createTipo(createTipoDto: CreateTipoDto) {
    const createTipo = createTipoDto;
    const checkIfUserExists = await this.PrismaService.lancamentoTipo.findUnique({
      where: {
        name: createTipo.name,
      },
      include: { empresa: true },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' tipo type exists');
    }

    return await this.PrismaService.lancamentoTipo.create({
      data: {
        name: createTipo.name,
        tipo: createTipo.tipo,
        automatico: createTipo.automatico,
        parcelas: createTipo.parcelas,
        geraObservacao: createTipo.geraObservacao,
        valorFixo: createTipo.valorFixo,
        empresa: createTipo.empresaId ? { connect: { id: createTipo.empresaId } } : undefined,
      },
      include: { empresa: true },
    });
  }

  async updateTipo(id: number, createTipo: CreateTipoDto) {
    return await this.PrismaService.lancamentoTipo.update({
      where: {
        id,
      },
      data: {
        name: createTipo.name,
        tipo: createTipo.tipo,
        automatico: createTipo.automatico,
        parcelas: createTipo.parcelas,
        geraObservacao: createTipo.geraObservacao,
        valorFixo: createTipo.valorFixo,
      },
      include: { empresa: true },
    });
  }

  async getTipos(empresa_id: number) {
    return await this.PrismaService.lancamentoTipo.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: { empresa: true },
    });
  }


  async deleteTipo(id: number) {
    return await this.PrismaService.lancamentoTipo.delete({
      where: {
        id,
      }
    });
  }
  async ativaTipo(id: number) {
    return await this.PrismaService.lancamentoTipo.update({
      where: {
        id,
      },
      data: {
        status: PessoaStatus.ATIVA,
      },
      include: { empresa: true },
    });
  }
  async desativaTipo(id: number) {
    return await this.PrismaService.lancamentoTipo.update({
      where: {
        id,
      },
      data: {
        status: PessoaStatus.CANCELADA,
      },
      include: { empresa: true },
    });
  }
}
