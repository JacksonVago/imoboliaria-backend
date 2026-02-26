import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { CreateTipoDto } from './tipoimovel.controller';

@Injectable()
export class TipoImovelService {
  constructor(private PrismaService: PrismaService) { }
  async createTipo(createTipoDto: CreateTipoDto) {
    const { name, empresaId } = createTipoDto;
    const checkIfUserExists = await this.PrismaService.imovelTipo.findUnique({
      where: {
        name: name,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' tipo type exists');
    }

    return await this.PrismaService.imovelTipo.create({
      data: {
        name: name,
        empresa: empresaId ? { connect: { id: empresaId } } : undefined,
      },
      include: { empresa: true },
    });
  }

  async updateTipo(id: number, { name }: CreateTipoDto) {
    return await this.PrismaService.imovelTipo.update({
      where: {
        id,
      },
      data: {
        name: name,
      },
      include: { empresa: true },
    });
  }

  async getTipos(empresa_id: number) {
    return await this.PrismaService.imovelTipo.findMany({
      where: {
        empresaId: empresa_id,
      },
      include: { empresa: true },
    });
  }


  async deleteTipo(id: number) {
    return await this.PrismaService.imovelTipo.delete({
      where: {
        id,
      }
    });
  }
  async ativaTipo(id: number) {
    return await this.PrismaService.imovelTipo.update({
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
    return await this.PrismaService.imovelTipo.update({
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
