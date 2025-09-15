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
import { GarantiaLocacaoTypes, Locacao, LocacaoStatus, Prisma } from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { randomUUID } from 'node:crypto';
import {
  CreateLocacaoDto
} from './locacoes.controller';

@Injectable()
export class LocacaoService {
  constructor(
    private readonly prismaService: PrismaService,
    private filesService: FilesService,
  ) { }

  async create(createLocacaoDto: CreateLocacaoDto) {
    const {
      dataInicio,
      dataFim,
    } = createLocacaoDto;

    let str_fiador: string = createLocacaoDto.fiador.toString();

    let fiadores_aux = str_fiador.split(',').map((item) => {
      return { pessoaId: parseInt(item) };
    });

    const isValid = this.checkIsValid({
      dataInicio,
      dataFim,
    });

    if (!isValid) {
      throw new BadRequestException(
        'The rental period must be at least one month',
      );
    }

    const result = await this.prismaService.locacao.create({
      data: {
        dataInicio: createLocacaoDto.dataInicio,
        dataFim: createLocacaoDto.dataFim,
        valor_aluguel: createLocacaoDto.valor_aluguel,
        status: createLocacaoDto.status,
        imovelId: createLocacaoDto.imovelId,
        dia_vencimento: createLocacaoDto.dia_vencimento,
        garantiaLocacaoTipo: createLocacaoDto.garantiaLocacaoTipo,

        garantiaTituloCapitalizacao:
          createLocacaoDto.garantiaLocacaoTipo === GarantiaLocacaoTypes.TITULO_CAPITALIZACAO ?
            {
              create: {
                numeroTitulo: createLocacaoDto.numeroTitulo
              }
            } : undefined,
        garantiaDepositoCalcao:
          createLocacaoDto.garantiaLocacaoTipo === GarantiaLocacaoTypes.DEPOSITO_CALCAO ?
            {
              create: {
                valorDeposito: createLocacaoDto.valorDeposito,
                quantidadeMeses: createLocacaoDto.quantidadeMeses
              }
            } : undefined,
        garantiaSeguroFianca:
          createLocacaoDto.garantiaLocacaoTipo === GarantiaLocacaoTypes.SEGURO_FIANCA ?
            {
              create: {
                numeroSeguro: createLocacaoDto.numeroSeguro
              }
            } : undefined,
        fiadores:
          createLocacaoDto.garantiaLocacaoTipo === GarantiaLocacaoTypes.FIADOR ?
            {
              connectOrCreate: fiadores_aux.map((fiador) => {
                return {
                  where: {
                    pessoaId: fiador.pessoaId
                  },
                  create: { pessoaId: fiador.pessoaId }
                };
              })
            } : undefined,
        locatarios: {
          create: {
            pessoaId: createLocacaoDto.pessoaId
          }
        }
      },
      // também retornar o endereço e a locação criados
      include: {
        locatarios: true,
        fiadores: true,
        pagamentos: true,
      },
    });

    return result;
  }

  async findById(id: number) {
    return await this.prismaService.locacao.findUnique({
      where: {
        id: id,
      },
      include: {
        locatarios: {
          include: {
            pessoa: {
              include: {
                endereco: true,
              }
            }
          }
        },
        documentos: true,
        fiadores: {
          include: {
            pessoa: {
              include: {
                endereco: true,
              }
            }
          }
        },
        imovel: {
          include: {
            endereco: true,
          }
        },
        garantiaDepositoCalcao: true,
        garantiaSeguroFianca: true,
        garantiaTituloCapitalizacao: true,
        pagamentos: true,
      }
    });
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    statusLocacao: LocacaoStatus | null | undefined,
    exclude: string | null,
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

    if (statusLocacao !== undefined) {
      if (statusLocacao.toString() === 'undefined') {
        statusLocacao = undefined;
      }
    }

    const where: Prisma.LocacaoWhereInput = {
      OR: [
        /*{
          id: {
            equals: parseInt(search),
          },
        },*/
        {
          locatarios: {
            every: {
              pessoa: {
                nome: {
                  contains: search,
                  mode: 'insensitive',
                }
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                email: {
                  contains: search,
                  mode: 'insensitive',
                },
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                telefone: {
                  contains: search,
                  mode: 'insensitive',
                },
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                endereco: {
                  logradouro: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                endereco: {
                  bairro: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                endereco: {
                  cidade: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                endereco: {
                  estado: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              }
            }
          },
        },
        {
          locatarios: {
            every: {
              pessoa: {
                endereco: {
                  estado: {
                    contains: search,
                    mode: 'insensitive',
                  },
                },
              }
            }
          },
        },
      ],
      AND: [
        ((statusLocacao === null || statusLocacao === undefined) ? {} : { status: { equals: statusLocacao } }),
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]
    };

    console.log('WHERE LOCACAO', where.AND);
    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.locacao.findMany({
        where,
        include: {
          locatarios: {
            include: {
              pessoa: true
            }
          },
          documentos: true,
          fiadores: {
            include: {
              pessoa: true
            }
          },
          imovel: {
            include: {
              endereco: true,
            }
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.locacao.count({ where }),
    ]);

    console.log('DATA LOCACAO', data.length);
    console.log('DATA LOCACAO', data);
    const totalPages = Math.ceil(total / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data?.length, //current position in the list e.g. 10 of 100
      totalPages,
    };
  }

  async updateLocatario(id: number, updateLocatarioDto: any) {//} UpdateLocatarioDto) {
    //atualizar status da locação, atualizar preço do aluguel, atualizar status do imóvel, atualizar as datas de início e fim da locação, adicionar obersevações vinculadas a locação, imovel e ao locatário (opcional ter locatario)

    /*const result = await this.prismaService.locatario.update({
      where: {
        id: id,
      },
      data: {
        estadoCivil: updateLocatarioDto.estadoCivil,
        nome: updateLocatarioDto.nome,
        documento: updateLocatarioDto.documento,
        email: updateLocatarioDto.email,
        telefone: updateLocatarioDto.telefone,
        profissao: updateLocatarioDto.profissao,
        endereco:
          logradouro ||
          bairro ||
          cidade ||
          estado ||
          cep ||
          numero ||
          complemento
            ? {
                update: {
                  logradouro: logradouro,
                  numero: numero,
                  bairro: bairro,
                  cidade: cidade,
                  estado: estado,
                  cep: cep,
                  complemento: complemento,
                },
              }
            : undefined,
      },
      include: {
        endereco: true,
        locacoes: true,
      },
    });

    if (documentos) {
      await this.createLocatarioDocuments(result.id, documentos);
    }

    if (documentosToDeleteIds) {
      await this.prismaService.genericAnexo.deleteMany({
        where: {
          id: {
            in: documentosToDeleteIds,
          },
        },
      });
    }

    return result;*/
  }

  /*async findMany(
    search: string,
    page: number,
    pageSize: number,
  ): Promise<BasePaginationData<Locatario>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.LocatarioWhereInput = {
      OR: [
        {
          nome: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          documento: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          email: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          telefone: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          endereco: {
            logradouro: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            bairro: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cidade: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            estado: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cep: {
              contains: search,
              mode: 'insensitive',
            },
          },
        },
      ],
    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.locatario.findMany({
        where,
        include: {
          endereco: true,
          locacoes: {
            include: {
              imovel: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.locatario.count({ where }),
    ]);

    const totalPages = Math.ceil(total / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data?.length, //current position in the list e.g. 10 of 100
      totalPages,
    };
  }*/

  async deleteLocatario(id: number) {
    try {
      return this.prismaService.locatario.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Locatario não encontrado');
      }
    }
  }

  //==================LOCACOES=================

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

  // async locarImovel({
  //   locatarioId,
  //   imovelId,
  //   dataInicio,
  //   dataFim,
  //   diaVencimentoPagamento,
  //   valor_aluguel,
  // }: {
  //   locatarioId: number;
  //   imovelId: number;
  //   dataInicio: Date;
  //   dataFim: Date;
  //   diaVencimentoPagamento: number;
  //   valor_aluguel: number;
  // }) {
  //   await this.prismaService.locacao.create({
  //     data: {
  //       dataInicio,
  //       dataFim,
  //       valor_aluguel,
  //       locatarioId,
  //       imovelId,
  //     },
  //   });

  //   //create payments
  //   await this.createPayments({
  //     dataFim,
  //     dataInicio,
  //     diaVencimentoPagamento,
  //     imovelId,
  //     locatarioId,
  //     valor_aluguel,
  //   });
  // }

  async createPayments({
    dataFim,
    dataInicio,
    diaVencimentoPagamento,
    imovelId,
    locatarioId,
    valor_aluguel,
  }: {
    locatarioId: number;
    imovelId: number;
    dataInicio: Date;
    dataFim: Date;
    diaVencimentoPagamento: number;
    valor_aluguel: number;
  }) {
    const dateNow = new Date();
    const payments = [];

    // Configurar a data inicial para o próximo pagamento
    let nextPaymentDate = new Date(dataInicio);
    nextPaymentDate.setDate(diaVencimentoPagamento);

    // Ajusta para o mês seguinte caso a primeira data já tenha passado
    if (nextPaymentDate < dateNow) {
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
    }

    // Gera os pagamentos enquanto a data do próximo pagamento for menor ou igual à data final
    while (nextPaymentDate <= dataFim) {
      const ultimoDiaDoMes = new Date(
        nextPaymentDate.getFullYear(),
        nextPaymentDate.getMonth() + 1,
        0,
      ).getDate();

      // Ajustar para o último dia do mês se o dia de vencimento for maior que os dias do mês atual
      if (diaVencimentoPagamento > ultimoDiaDoMes) {
        nextPaymentDate.setDate(ultimoDiaDoMes);
      } else {
        nextPaymentDate.setDate(diaVencimentoPagamento);
      }

      payments.push({
        dataPagamento: new Date(nextPaymentDate), // Copia a data atual para evitar mutações
        valorPago: valor_aluguel,
        locatarioId,
        imovelId,
      });

      // Incrementar para o próximo mês
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      nextPaymentDate.setDate(1); // Reseta o dia para evitar problemas com meses curtos
    }

    return payments;
  }

  // async updateLocacao(
  //   id: number,
  //   dataInicio: Date,
  //   dataFim: Date,
  //   valor_aluguel: number,
  //   motivo?: string,
  // ) {
  //   //TODO: ao mudar o preço do aluguel, atualizar o valor da locacao e guardar o valor antigo em um histórico
  //   //pensando melhor a atualização tem que vir no imovel, e refletir na locacao (ou nao) perguntar pro socio
  //   const locacao = await this.prismaService.locacao.findUnique({
  //     where: {
  //       id,
  //     },
  //   });

  //   if (locacao.valor_aluguel !== valor_aluguel) {
  //     //create a new history entry
  //     await this.prismaService.valorAluguelHistorico.create({
  //       data: {
  //         novoValor: valor_aluguel,
  //         locacaoId: id,
  //         motivo,
  //       },
  //     });
  //   }

  //   return await this.prismaService.locacao.update({
  //     where: {
  //       id,
  //     },
  //     data: {
  //       dataInicio,
  //       dataFim,
  //       valor_aluguel,
  //       Pagamento: {
  //         //payments are mensal
  //       },
  //     },
  //   });
  // }

  async deleteLocacao(id: number) {
    return await this.prismaService.locacao.update({
      where: {
        id: id,
      },
      data: {
        status: LocacaoStatus.ENCERRADA,
        // locatarioId: null,
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

  //este é um pré registro de locação, o locatario está amarrado ao imovel, mas a locação ainda não foi criada
  async preLinkLocatarioToLocacao(locacaoId: number, imovelId: number) {
    const imovel = await this.prismaService.imovel.findUnique({
      where: {
        id: imovelId,
      },
      include: {
        locacoes: {
          where: {
            status: { notIn: [LocacaoStatus.ENCERRADA] },
          },
        },
      },
    });

    if (!imovel) {
      throw new BadRequestException('Imovel not found');
    }

    //verificar se o imovel já tem um locatario vinculado
    if (imovel?.locacoes?.length > 0) {
      throw new BadRequestException(
        'This property already has a locatario linked',
      );
    }
    await this.prismaService.imovel.update({
      where: {
        id: imovelId,
      },
      data: {
        locacoes: {
          connect: {
            id: locacaoId,
          }
        }
      },
    });

    //Criamos uma locacao sem dados, apenas para vincular o locatario ao imovel
    return await this.prismaService.locacao.create({

      data: {
        dataInicio: new Date(),
        dataFim: new Date(),
        valor_aluguel: 0,
        status: LocacaoStatus.ATIVA,
        imovelId: imovelId,
        dia_vencimento: 1,
      },
    });
  }

  checkIsValid(data: Partial<Prisma.LocacaoCreateInput>) {
    //show be at least 1 month
    const startDate = new Date(data.dataInicio);
    const endDate = new Date(data.dataFim);

    // Calculate the date exactly one month after the start date
    const oneMonthLater = new Date(startDate);
    oneMonthLater.setMonth(oneMonthLater.getMonth() + 1);

    // Check if end date is at least one month later than start date
    if (endDate < oneMonthLater) {
      return false; // Difference is less than one month
    }
    return true;
  }

  async update(locacaoId: number, data: CreateLocacaoDto) {
    try {
      const {
        dataInicio,
        dataFim,
        valor_aluguel,
        // locatarioId,
        // imovelId,
        status,
        documentos,
        garantiaLocacaoTipo,
        documentosToDeleteIds,

        fiador,
        //titulo capitalizacao
        numeroTitulo,
        //seguro fianca
        numeroSeguro,
        //depósito Calçao
        valorDeposito,
        quantidadeMeses
      } = data;

      const isValid = this.checkIsValid({
        dataInicio,
        dataFim,
      });

      if (!isValid) {
        throw new BadRequestException(
          'The rental period must be at least one month',
        );
      }

      const existingLocacao = await this.prismaService.locacao.findFirst({
        where: {
          id: locacaoId,
        },
        include: {
          locatarios: true,
          garantiaDepositoCalcao: true,
          fiadores: true,
          garantiaSeguroFianca: true,
          garantiaTituloCapitalizacao: true,
        },
      });

      if (!existingLocacao) {
        throw new BadRequestException('Locacao not found');
      }

      const locatarioId = existingLocacao.locatarios[0].id;
      const imovelId = existingLocacao.imovelId;

      const imovel = await this.prismaService.imovel.findUnique({
        where: {
          id: imovelId,
        },
      });

      if (!locatarioId) {
        throw new BadRequestException(
          'This property does not have a locatario pre-linked',
        );
      }

      const result = await this.prismaService.locacao.update({
        where: {
          id: locacaoId,
        },
        data: {
          dataInicio,
          dataFim,
          valor_aluguel,
          status,
          garantiaLocacaoTipo,
          garantiaTituloCapitalizacao:
            garantiaLocacaoTipo === 'TITULO_CAPITALIZACAO'
              ? existingLocacao.garantiaTituloCapitalizacao
                ? {
                  // Update the existing title capitalization guarantee
                  update: {
                    numeroTitulo: numeroTitulo,
                  },
                }
                : {
                  // Create a new title capitalization guarantee
                  create: {
                    numeroTitulo: numeroTitulo,
                  },
                }
              : undefined,

          garantiaSeguroFianca:
            garantiaLocacaoTipo === 'SEGURO_FIANCA'
              ? existingLocacao.garantiaSeguroFianca
                ? {
                  // Update the existing title capitalization guarantee
                  update: {
                    numeroSeguro: numeroSeguro,
                  },
                }
                : {
                  // Create a new title capitalization guarantee
                  create: {
                    numeroSeguro: numeroSeguro,
                  },
                }
              : undefined,
        },
        include: {
          locatarios: true,
          imovel: true,
          garantiaDepositoCalcao: true,
          fiadores: true,
          garantiaSeguroFianca: true,
          garantiaTituloCapitalizacao: true,
        },
      });

      if (documentos) {
        await this.createLocacaoDocuments(locatarioId, documentos);
      }

      // if it changes the garantia type, we need to delete the old documents
      if (
        result.fiadores &&
        result.garantiaLocacaoTipo !== garantiaLocacaoTipo
      ) {
        //desvincular a garantia
        await this.prismaService.locacao.update({
          where: {
            id: locacaoId,
          },
          data: {
            garantiaDepositoCalcao: {
              delete: result.garantiaLocacaoTipo !== garantiaLocacaoTipo,
            },
            /*garantiaFiador: {
              delete: result.garantiaLocacaoTipo !== garantiaLocacaoTipo,
            },*/
            garantiaTituloCapitalizacao: {
              delete: result.garantiaLocacaoTipo !== garantiaLocacaoTipo,
            },
            garantiaSeguroFianca: {
              delete: result.garantiaLocacaoTipo !== garantiaLocacaoTipo,
            },
          },
        });
      }

      /*if (garantiaLocacaoTipo === 'FIADOR' && fiadorDocumentos?.length > 0) {
        await this.createPessoaDocuments(
          result.garantiaSeguroFianca.id,
          fiadorDocumentos,
        );
      }*/

      return await this.prismaService.locacao.findFirst({
        where: {
          id: locacaoId,
        },
        include: {
          imovel: true,
          locatarios: true,
          garantiaDepositoCalcao: true,
          fiadores: true,
          garantiaSeguroFianca: true,
          garantiaTituloCapitalizacao: true,
        },
      });

      //TODO: clean the type documents and data if it changes
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException(
          'A location already exists for this property',
        );
      } else {
        throw error;
      }
    }
  }

  async createSeguroFiancaDocuments(
    seguroFiancaId: number,
    files: MemoryStoredFile[],
  ) {
    try {
      // Crie uma lista de promessas para processar cada arquivo
      /*const documentPromisses = files.map(async (file) => {
        // Converta o MemoryStoredFile para o formato necessário
        const adaptedFile: FileData = {
          filename: `${randomUUID()}.${file.originalName?.split('.').pop()}`,
          originalname: file.originalName,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
          encoding: file.encoding,
        };

        const url = await this.filesService.uploadFile(adaptedFile);

        const fileType = getFileType(file);

        return this.prismaService.genericAnexo.create({
          data: {
            tipo_arquivo: fileType,
            url,
            type: file.mimetype,
            name: file.originalName,
            seguroFiancaId: seguroFiancaId, // Changed field name
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;*/
      return;
    } catch (error) {
      console.error('Error on createPessoaDocuments', error);
    }
  }

  async createTituloCapitalizacaoDocuments(
    tituloCapitalizacaoId: number,
    files: MemoryStoredFile[],
  ) {
    try {
      // Crie uma lista de promessas para processar cada arquivo
      /*const documentPromisses = files.map(async (file) => {
        // Converta o MemoryStoredFile para o formato necessário
        const adaptedFile: FileData = {
          filename: `${randomUUID()}.${file.originalName?.split('.').pop()}`,
          originalname: file.originalName,
          buffer: file.buffer,
          mimetype: file.mimetype,
          size: file.size,
          encoding: file.encoding,
        };

        const url = await this.filesService.uploadFile(adaptedFile);

        const fileType = getFileType(file);

        return this.prismaService.genericAnexo.create({
          data: {
            tipo_arquivo: fileType,
            url,
            type: file.mimetype,
            name: file.originalName,
            tituloCapitalizacaoId: tituloCapitalizacaoId,
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;*/
      return;
    } catch (error) {
      console.error('Error on createPessoaDocuments', error);
    }
  }

  async createPessoaDocuments(pessoaId: number, files: MemoryStoredFile[]) {
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

        const url = await this.filesService.uploadFile(adaptedFile);

        const fileType = getFileType(file);

        return this.prismaService.genericAnexo.create({
          data: {
            tipo_arquivo: fileType,
            url,
            type: file.mimetype,
            name: file.originalName,
            pessoa: {
              connect: {
                id: pessoaId,
              },
            },
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createPessoaDocuments', error);
    }
  }

  async createLocacaoDocuments(locacaoId: number, files: MemoryStoredFile[]) {
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

        const url = await this.filesService.uploadFile(adaptedFile);

        const fileType = getFileType(file);

        return this.prismaService.genericAnexo.create({
          data: {
            tipo_arquivo: fileType,
            url,
            type: file.mimetype,
            name: file.originalName,
            locacao: {
              connect: {
                id: locacaoId,
              },
            },
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createLocacaoDocuments', error);
    }
  }
}
