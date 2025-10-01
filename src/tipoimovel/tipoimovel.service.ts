import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { CreateTipoDto } from './tipoimovel.controller';

@Injectable()
export class TipoImovelService {
  constructor(private PrismaService: PrismaService) { }
  async createUser(createTipoDto: CreateTipoDto) {
    const { name } = createTipoDto;
    const checkIfUserExists = await this.PrismaService.imovelTipo.findUnique({
      where: {
        name: name,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' imovel type exists');
    }

    return await this.PrismaService.imovelTipo.create({
      data: {
        name: name
      },
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
    });
  }

  async getTipos() {
    return await this.PrismaService.imovelTipo.findMany({
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
    });
  }
}
