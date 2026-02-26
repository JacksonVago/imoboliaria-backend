import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import {
  Injectable,
} from '@nestjs/common';
import { Boleto, BoletoStatus, lancamentoStatus, Prisma } from '@prisma/client';

@Injectable()
export class RepassesService {
  constructor(
    private filesService: FilesService,
    private readonly prismaService: PrismaService,
  ) { }

  async delete(id: number) {

    //atualiza lançamentos relacionados
    const result = await this.prismaService.lancamentoLocacao.updateMany({
      where: {
        boletoId: id,
      },
      data: {
        status: lancamentoStatus.ABERTO,
      },
    });

    const locacao = await this.prismaService.boleto.delete({
      where: {
        id: id,
      },
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.boleto.findUnique({
      where: {
        id: id,
      },
      include: {
        documentos: true,
        lanctoLocacao: {
          include: {
            lancamentotipo: true
          }
        },
        lanctoCondominio: {
          include: {
            lancamentotipo: true
          }
        },
        locatario: {
          include: {
            pessoa: {
              include: {
                endereco: true,
              }
            }
          }
        },
        boletosBancarios: true,
        locacao: {
          include: {
            imovel: {
              include: {
                endereco: true,
              }
            },
          }
        }
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    statusPagamento: BoletoStatus | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<Boleto>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (statusPagamento !== undefined) {
      if (statusPagamento.toString() === 'undefined') {
        statusPagamento = undefined;
      }
    }

    let dataFim: Date = dataFinal;
    dataFim.setDate(dataFinal.getDate() + 1);

    const where: Prisma.BoletoWhereInput = {
      OR: [
        {
          lanctoLocacao: {
            every: {
              observacao: {
                contains: search,
                mode: 'insensitive'
              },
            }
          },
          lanctoCondominio: {
            every: {
              observacao: {
                contains: search,
                mode: 'insensitive'
              },
            }
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
                },
              },
            },
          },
        },
      ],
      AND: [
        ((statusPagamento === null || statusPagamento === undefined || statusPagamento.toString() === "") ? {} : {
          status: {
            equals: statusPagamento
          }
        }),
        {
          dataVencimento: {
            gte: dataInicial,
            lt: dataFim,
          },
        },
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.boleto.findMany({
        where,
        include: {
          locatario: {
            include: {
              pessoa: {
                include: {
                  endereco: true
                }
              }
            }
          },
          locacao: {
            include: {
              imovel: {
                include: {
                  endereco: true,
                  proprietarios: {
                    include: {
                      pessoa: true
                    }
                  }
                }
              },
            },
          },
          lanctoLocacao: {
            include: {
              lancamentotipo: true
            }
          },
          lanctoCondominio: {
            include: {
              lancamentotipo: true
            }
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.boleto.count({ where }),
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
}
