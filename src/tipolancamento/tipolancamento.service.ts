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
      },
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
    });
  }

  async getTipos() {
    return await this.PrismaService.lancamentoTipo.findMany({
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
    });
  }
}
