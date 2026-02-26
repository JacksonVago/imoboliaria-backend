import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { FileData } from '@/common/interfaces/file-data';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { getFileType } from '@/proprietarios/proprietarios.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { Boleto, BoletoStatus, lancamentoStatus, LocacaoStatus, Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { MemoryStoredFile } from 'nestjs-form-data';
import { CreateBoletoDto, UpdateBoletoDto } from './pagamentos.controller';

@Injectable()
export class PagamentosService {
  constructor(
    private filesService: FilesService,
    private readonly prismaService: PrismaService,
  ) { }

  async create(createBoletoDto: CreateBoletoDto) {

    const locacao = await this.prismaService.locacao.findUnique({
      where: {
        id: createBoletoDto.locacaoId,
        status: LocacaoStatus.ATIVA,
      },
    });

    if (!locacao) {
      throw new BadRequestException('Locacao not found');
    }

    const result = await this.prismaService.boleto.create({
      data: {
        locacao: createBoletoDto.locacaoId ? { connect: { id: createBoletoDto.locacaoId } } : undefined,
        locatario: createBoletoDto.locatarioId ? { connect: { id: createBoletoDto.locatarioId } } : undefined,
        status: createBoletoDto.status,
        dataEmissao: createBoletoDto.dataEmissao,
        dataPagamento: createBoletoDto.dataPagamento,
        dataVencimento: createBoletoDto.dataVencimento,
        valorOriginal: createBoletoDto.valorOriginal,
        valorPago: createBoletoDto.valorPago,
      },
      include: {
        locacao: true
      },
    });

    //Verifica se tem anexos
    if (createBoletoDto?.documentos?.length) {
      await this.createPagamentoDocuments(result.id, createBoletoDto.documentos);
    }

    return result;
  }

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

    const where: Prisma.BoletoWhereInput = {
      OR: [
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
      this.prismaService.boleto.findMany({
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

  async findManyPagamento(
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

  async update(pagamentoId: number, data: UpdateBoletoDto) {
    try {

      const existingLocacao = await this.prismaService.locacao.findFirst({
        where: {
          id: data.locacaoId,
        }
      });

      if (!existingLocacao) {
        throw new BadRequestException('Locacao not found');
      }

      const result = await this.prismaService.boleto.update({
        where: {
          id: pagamentoId,
        },
        data: {
          status: data.status,
          dataEmissao: data.dataEmissao,
          dataPagamento: data.dataPagamento,
          dataVencimento: data.dataVencimento,
          valorOriginal: data.valorOriginal,
          valorPago: data.valorPago,
        },
        include: {
          locacao: true
        },
      });

      console.log(data);
      if (data.documentos) {
        await this.createPagamentoDocuments(pagamentoId, data.documentos);
      }

      if (data.documentosToDeleteIds) {
        await this.prismaService.genericAnexo.deleteMany({
          where: {
            id: {
              in: data.documentosToDeleteIds,
            },
          },
        });

        //Exlcui arquivos do storage
        //await this.filesService.deleteFile(data.documentosToDeleteIds.map(d => d.file));
      }

      return await this.prismaService.lancamentoLocacao.findFirst({
        where: {
          id: pagamentoId,
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

  async updateStatus(pagamentoId: number, data: CreateBoletoDto) {
    try {

      const result = await this.prismaService.boleto.update({
        where: {
          id: pagamentoId,
        },
        data: {
          status: data.status,
        },
        include: {
          locacao: true
        },
      });


      return await this.prismaService.boleto.findFirst({
        where: {
          id: pagamentoId,
        },
        include: {
          locacao: true,
          lanctoLocacao: true,
          lanctoCondominio: true,
          locatario: true,
          boletosBancarios: true
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

  async createPagamentoDocuments(
    pagamentoId: number,
    files: MemoryStoredFile[],
  ) {
    try {
      // Crie uma lista de promessas para processar cada arquivo
      const documentPromisses = files.map(async (file) => {
        // Converta o MemoryStoredFile para o formato necessário
        const adaptedFile: FileData = {
          filename: `${randomUUID()}.${file.originalName?.split('.').pop()}`,
          originalname: file.originalName,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
          encoding: file.encoding,
        };

        const str_url = await this.filesService.uploadFile(adaptedFile);
        const fileType = getFileType(file);

        return this.prismaService.genericAnexo.create({
          data: {
            tipoArquivo: fileType,
            size: file.size,
            url: str_url,
            type: file.mimetype,
            name: file.originalName,
            pagamento: {
              connect: {
                id: pagamentoId,
              },
            },
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createPagamentoDocuments', error);
    }
  }

}
