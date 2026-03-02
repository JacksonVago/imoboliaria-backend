import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { PrismaService } from '@/prisma/prisma.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { BoletoStatus, LancamentoLocacao, lancamentoStatus, Locacao, LocacaoStatus, Prisma } from '@prisma/client';
import { CreateLancamentoDto, gerarBoletoDto } from './lancamentos.controller';

@Injectable()
export class LancamentosService {
  constructor(
    private readonly prismaService: PrismaService,
  ) { }

  async create(createLancamentoDto: CreateLancamentoDto) {

    const locacao = await this.prismaService.locacao.findUnique({
      where: {
        id: createLancamentoDto.locacaoId,
        status: LocacaoStatus.ATIVA,
      },
    });

    if (!locacao) {
      throw new BadRequestException('Locacao not found');
    }

    const result = await this.prismaService.lancamentoLocacao.create({
      data: {
        parcela: createLancamentoDto.parcela,
        tipoId: createLancamentoDto.tipoId,
        valorLancamento: createLancamentoDto.valorLancamento,
        dataLancamento: createLancamentoDto.dataLancamento,
        vencimentoLancamento: createLancamentoDto.vencimentoLancamento,
        observacao: createLancamentoDto.observacao ? createLancamentoDto.observacao : '',
        linhaDigitavel: createLancamentoDto.linhaDigitavel ? createLancamentoDto.linhaDigitavel : '',
        status: createLancamentoDto.status,
        locacaoId: createLancamentoDto.locacaoId
      },
      include: {
        locacao: true,
      },
    });

    return result;
  }

  async createPagamento(gerarPagamentoDto: gerarBoletoDto) {

    const locacao = await this.prismaService.locacao.findUnique({
      where: {
        id: gerarPagamentoDto.id,
        status: LocacaoStatus.ATIVA,
      },
    });

    if (!locacao) {
      throw new BadRequestException('Locacao not found');
    }

    //Monta dados do pagamento/boleto
    const resultPag = await this.prismaService.boleto.create({
      data: {
        status: BoletoStatus.PENDENTE,
        valorOriginal: gerarPagamentoDto.lancamentos.reduce((sum, lancamento) => sum + lancamento.valorLancamento, 0) + gerarPagamentoDto.valorAluguel,
        valorPago: null,
        dataEmissao: new Date(),
        dataVencimento: gerarPagamentoDto.lancamentos[0].vencimentoLancamento,
        dataPagamento: null,
        locacao: { connect: { id: gerarPagamentoDto.id } },
        locatario: {
          connect: { id: gerarPagamentoDto.locatarios[0].id },
        },
        lanctoLocacao: {
          connect: gerarPagamentoDto.lancamentos.map(lancamento => ({ id: lancamento.id })),
        },
      },
      include: {
        locacao: true,
        locatario: true,
        lanctoLocacao: true,
      },
    });


    //Atualiza os lançamentos vinculando o pagamento
    const result = await this.prismaService.lancamentoLocacao.updateMany({
      where: {
        id: {
          in: gerarPagamentoDto.lancamentos.map(lancamento => lancamento.id),
        },
      },
      data: {
        status: lancamentoStatus.CONFIRMADO,
      },
    });

    //Gera os novos lançamentos automáticos ou se houver parcelas
    gerarPagamentoDto.lancamentos.forEach(async (lancamento) => {
      if (lancamento.parcela < lancamento.lancamentotipo.parcelas || (lancamento.lancamentotipo.automatico === 'S' && lancamento.lancamentotipo.parcelas === 0)) {
        const novaParcela = lancamento.lancamentotipo.parcelas > 0 ? lancamento.parcela + 1 : 1;
        const novaDataLancamento = new Date();
        const novoVencimentoLancamento = new Date(lancamento.vencimentoLancamento);
        novoVencimentoLancamento.setMonth(novoVencimentoLancamento.getMonth() + 1);

        console.log('Gerando novo lancamento automatico para locacaoId:', lancamento.lancamentotipo.name);

        await this.prismaService.lancamentoLocacao.create({
          data: {
            parcela: novaParcela,
            tipoId: lancamento.tipoId,
            valorLancamento: lancamento.valorLancamento,
            dataLancamento: novaDataLancamento,
            vencimentoLancamento: novoVencimentoLancamento,
            observacao: lancamento.observacao ? lancamento.observacao : '',
            status: lancamentoStatus.ABERTO,
            locacaoId: gerarPagamentoDto.id
          },
        });
      }
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.lancamentoLocacao.findUnique({
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
  ): Promise<BasePaginationData<LancamentoLocacao>> {
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

    const where: Prisma.LancamentoLocacaoWhereInput = {
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
      /*AND: [
        ((statusLocacao === null || statusLocacao === undefined) ? {} : { status: { equals: statusLocacao } }),
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]*/
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.lancamentoLocacao.findMany({
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
      this.prismaService.lancamentoLocacao.count({ where }),
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

  async findManyLocacao(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    statusLancamento: lancamentoStatus | null | undefined,
    exclude: string | null,
    dataInicial: Date,
    dataFinal: Date,
  ): Promise<BasePaginationData<Locacao>> {
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

    const where: Prisma.LocacaoWhereInput = {
      OR: [
        {
          lancamentos: {
            every: {
              observacao: {
                contains: search,
                mode: 'insensitive'
              },
            }
          }
        },
        {
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
      ],
      AND: [
        {
          status: {
            equals: LocacaoStatus.ATIVA
          }
        },
        /*{
          lancamentos:
          {
            every: {
              dataLancamento: {
                gte: dataInicial,
                lte: dataFim
              }
            },
          }
        },
        {
          lancamentos:
          {
            none: {
              dataLancamento: {
                gte: dataInicial,
                lte: dataFim
              }
            },
          }
        }*/
        empresaId ? { empresaId: empresaId } : {},
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.locacao.findMany({
        where,
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
          lancamentos: {
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
    return await this.prismaService.lancamentoLocacao.delete({
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

  async update(lancamentoId: number, data: CreateLancamentoDto) {
    try {

      const existingLocacao = await this.prismaService.locacao.findFirst({
        where: {
          id: data.locacaoId,
        }
      });

      if (!existingLocacao) {
        throw new BadRequestException('Locacao not found');
      }

      const result = await this.prismaService.lancamentoLocacao.update({
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
          observacao: data.observacao
        },
        include: {
          locacao: true
        },
      });


      return await this.prismaService.lancamentoLocacao.findFirst({
        where: {
          id: lancamentoId,
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

  async updateStatus(lancamentoId: number, data: CreateLancamentoDto) {
    try {

      const result = await this.prismaService.lancamentoLocacao.update({
        where: {
          id: lancamentoId,
        },
        data: {
          status: data.status,
        },
        include: {
          locacao: true
        },
      });


      return await this.prismaService.lancamentoLocacao.findFirst({
        where: {
          id: lancamentoId,
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
