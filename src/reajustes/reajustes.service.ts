import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { LocacaoStatus, Prisma, Reajuste } from '@prisma/client';
import { CreateReajusteDto } from './reajustes.controller';

@Injectable()
export class ReajustesService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createReajusteDto: CreateReajusteDto) {

    const locacao = await this.prismaService.locacao.findUnique({
      where: {
        id: createReajusteDto.locacaoId,
        status: LocacaoStatus.ATIVA,
      },
    });

    if (!locacao) {
      throw new BadRequestException('Locacao not found');
    }

    const result = await this.prismaService.reajuste.create({
      data: {
        percentualRejuste: createReajusteDto.percentualRejuste,
        valorAluguel: createReajusteDto.valorAluguel,
        valorRejuste: createReajusteDto.valorRejuste,
        dataReajuste: createReajusteDto.dataReajuste,
        observacao: createReajusteDto.observacao,
        locacaoId: createReajusteDto.locacaoId
      },
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.reajuste.findUnique({
      where: {
        id: id,
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<BasePaginationData<Reajuste>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.ReajusteWhereInput = {
      OR: [
        {
          observacao: {
            contains: search,
            mode: 'insensitive'
          },
        },
        {
          locacao: {
            imovel: {
              description: {
                contains: search,
                mode: 'insensitive'
              },
            },
            locatarios: {
              every: {
                pessoa: {
                  email: {
                    contains: search,
                    mode: 'insensitive',
                  },
                }

              }
            }
          },
        },
      ],
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.reajuste.findMany({
        where,
        include: {
          locacao: {
            include: {
              locatarios: {
                include: {
                  pessoa: {
                    include: {
                      endereco: true
                    }
                  }
                }
              },
              imovel: {
                include: {
                  endereco: true,
                }
              },
            }
          }
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.reajuste.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data?.length, //current position in the list e.g. 10 of 100
      totalPages,
    };
  }

  async delete(id: number) {
    return await this.prismaService.reajuste.delete({
      where: {
        id: id,
      }
    });
  }

  async update(reajusteId: number, data: CreateReajusteDto) {
    try {

      const existingLocacao = await this.prismaService.locacao.findFirst({
        where: {
          id: data.locacaoId,
        }
      });

      if (!existingLocacao) {
        throw new BadRequestException('Locacao not found');
      }

      const result = await this.prismaService.reajuste.update({
        where: {
          id: reajusteId,
        },
        data: {
          percentualRejuste: data.percentualRejuste,
          valorAluguel: data.valorAluguel,
          valorRejuste: data.valorRejuste,
          dataReajuste: data.dataReajuste,
          observacao: data.observacao,
        },
        include: {
          locacao: true
        },
      });


      return await this.prismaService.lancamento.findFirst({
        where: {
          id: reajusteId,
        },
        include: {
          locacao: true,
        },
      });

      //TODO: clean the type documents and data if it changes
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'A lancamento already exists for this property',
        );
      } else {
        throw error;
      }
    }
  }
}
