import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateAssinaturaDto } from './assinatura.controller';

@Injectable()
export class AssinaturaService {
  constructor(
    private PrismaService: PrismaService,
  ) { }

  async create(createAssinaturaDto: CreateAssinaturaDto) {
    return await this.PrismaService.assinatura.create({
      data: {
        name: createAssinaturaDto.name,
        descricao: createAssinaturaDto.descricao,
        tipo: createAssinaturaDto.tipo,
        frequencia: createAssinaturaDto.frequencia,
        valor: createAssinaturaDto.valor,
      },
    });
  }

  async update(id: number, createAssinaturaDto: CreateAssinaturaDto) {
    return await this.PrismaService.assinatura.update({
      where: {
        id,
      },
      data: {
        name: createAssinaturaDto.name,
        descricao: createAssinaturaDto.descricao,
        tipo: createAssinaturaDto.tipo,
        frequencia: createAssinaturaDto.frequencia,
        valor: createAssinaturaDto.valor,
      },
    });
  }

  async getAssinaturas() {
    return await this.PrismaService.assinatura.findMany({
    });
  }


  async getAssinatura(id: number) {
    return await this.PrismaService.assinatura.findUnique({
      where: {
        id,
      }
    });
  }

  async delete(id: number) {
    return await this.PrismaService.assinatura.delete({
      where: {
        id,
      }
    });
  }
}

