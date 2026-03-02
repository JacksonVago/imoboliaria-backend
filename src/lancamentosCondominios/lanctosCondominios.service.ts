import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import {
  ConflictException,
  Injectable
} from '@nestjs/common';
import { Condominio, LancamentoCondominio, lancamentoStatus, LocacaoStatus, Prisma } from '@prisma/client';
import { CreateLanctoCondominioDto } from './lanctosCondominios.controller';

@Injectable()
export class LanctosCondominiosService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createLancamentoDto: CreateLanctoCondominioDto) {

    const result = await this.prismaService.lancamentoCondominio.create({
      data: {
        parcela: createLancamentoDto.parcela,
        lancamentotipo: { connect: { id: createLancamentoDto.tipoId } },
        valorLancamento: createLancamentoDto.valorLancamento,
        dataLancamento: createLancamentoDto.dataLancamento,
        vencimentoLancamento: createLancamentoDto.vencimentoLancamento,
        rateia: createLancamentoDto.rateia,
        linhaDigitavel: createLancamentoDto.linhaDigitavel ? createLancamentoDto.linhaDigitavel : '',
        observacao: createLancamentoDto.observacao ? createLancamentoDto.observacao : '',
        status: createLancamentoDto.status,
        bloco: createLancamentoDto.blocoId ? { connect: { id: createLancamentoDto.blocoId } } : undefined,
      },
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.lancamentoCondominio.findUnique({
      where: {
        id: id,
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    statusLancamento: lancamentoStatus | null | undefined,
    exclude: string | null,
  ): Promise<BasePaginationData<LancamentoCondominio>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (statusLancamento !== undefined) {
      if (statusLancamento.toString() === 'undefined') {
        statusLancamento = undefined;
      }
    }

    const where: Prisma.LancamentoCondominioWhereInput = {
      OR: [
        {
          observacao: {
            contains: search,
            mode: 'insensitive'
          },
        },
        {
          bloco: {
            imovels: {
              every: {
                description: {
                  contains: search,
                  mode: 'insensitive'
                },
              }
            },
          },
        },
      ],
      /*AND: [
        ((statusLocacao === null || statusLocacao === undefined) ? {} : { status: { equals: statusLocacao } }),
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]*/
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.lancamentoCondominio.findMany({
        where,
        include: {
          bloco: {
            include: {
              imovels: true,
            }
          }
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.lancamentoCondominio.count({ where }),
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

  async findManyCondominio(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    statusLancamento: lancamentoStatus | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<Condominio>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (statusLancamento !== undefined) {
      if (statusLancamento.toString() === 'undefined') {
        statusLancamento = undefined;
      }
    }

    let dataFim: Date = dataFinal;
    dataFim.setDate(dataFinal.getDate() + 1);

    const where: Prisma.CondominioWhereInput = {
      OR: [
        {
          blocos: {
            every: {
              lancamentosCondominios: {
                every: {
                  observacao: {
                    contains: search,
                    mode: 'insensitive'
                  },
                }
              },
              imovels: {
                every: {
                  description: {
                    contains: search,
                    mode: 'insensitive'
                  },
                  locacoes: {
                    every: {
                      locatarios: {
                        every: {
                          pessoa: {
                            email: {
                              contains: search,
                              mode: 'insensitive',
                            },
                          }
                        },
                      }
                    }
                  },
                },
              },
            },
          },
        },],
      AND: [
        empresaId ? { empresaId: empresaId } : {},
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.condominio.findMany({
        where,
        include: {
          endereco: true,
          blocos: {
            include: {
              lancamentosCondominios: {
                where: {
                  dataLancamento: {
                    gte: dataInicial,
                    lte: dataFim
                  }
                },
                include: {
                  lancamentotipo: true
                }
              },
              imovels: {
                include: {
                  locacoes: {
                    include: {
                      locatarios: {
                        include: {
                          pessoa: true
                        }
                      }
                    }
                  }
                }
              }
            }
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.condominio.count({ where }),
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

  async findLocacoesByLocatarioId(id: number) {
    return this.prismaService.locatario.findUnique({
      where: {
        id: id,
      },
      include: {
        locacoes: {
          include: {
            imovel: true,
          },
        },
      },
    });
  }

  async delete(id: number) {
    return await this.prismaService.lancamentoCondominio.delete({
      where: {
        id: id,
      }
    });
  }

  async findManyLocacoes(
    locatarioId: number,
    search: string,
    page: number,
    pageSize: number,
  ) {
    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.LocacaoWhereInput = {
      OR: [
        {
          imovel: {
            endereco: {
              logradouro: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              bairro: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              cidade: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              estado: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
        {
          imovel: {
            endereco: {
              cep: {
                contains: search,
                mode: 'insensitive',
              },
            },
          },
        },
      ],
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.locacao.findMany({
        where,
        include: {
          imovel: {
            include: {
              endereco: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.locacao.count({ where }),
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

  async update(lancamentoId: number, data: CreateLanctoCondominioDto) {
    try {

      const result = await this.prismaService.lancamentoCondominio.update({
        where: {
          id: lancamentoId,
        },
        data: {
          parcela: data.parcela,
          tipoId: data.tipoId,
          dataLancamento: data.dataLancamento,
          valorLancamento: data.valorLancamento,
          vencimentoLancamento: data.vencimentoLancamento,
          status: data.status,
          linhaDigitavel: data.linhaDigitavel ? data.linhaDigitavel : '',
          observacao: data.observacao,
          rateia: data.rateia,
        },
        include: {
          bloco: true
        },
      });


      return await this.prismaService.lancamentoCondominio.findFirst({
        where: {
          id: lancamentoId,
        },
        include: {
          bloco: true,
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

  async updateStatus(lancamentoId: number, data: CreateLanctoCondominioDto) {
    try {

      const result = await this.prismaService.lancamentoCondominio.update({
        where: {
          id: lancamentoId,
        },
        data: {
          status: data.status,
        },
        include: {
          bloco: true
        },
      });


      return await this.prismaService.lancamentoCondominio.findFirst({
        where: {
          id: lancamentoId,
        },
        include: {
          bloco: true,
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

  async gerarLancamentoAutomatico() {
    //Identifica todas as locações ativas
    const locacoesAtivas = await this.prismaService.locacao.findMany({
      where: {
        status: LocacaoStatus.ATIVA,
        boletos: {

        }
      },
      include: {
        lancamentos: {
          where: {
            AND: [
              {
                status: lancamentoStatus.CONFIRMADO,

              },
              {
                dataLancamento: {
                  gte: new Date(),
                  lte: new Date(),
                }
              },
            ]
          }
        },
      },
    });
  }
}
