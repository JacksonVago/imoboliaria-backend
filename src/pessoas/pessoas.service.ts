import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { FileData } from '@/common/interfaces/file-data';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { getFileType } from '@/proprietarios/proprietarios.service';
import {
  Injectable
} from '@nestjs/common';
import { LocacaoStatus, Pessoa, Prisma } from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { randomUUID } from 'node:crypto';
import {
  CreatePessoaDto,
  UpdatePessoaDto,
} from './pessoas.controller';

@Injectable()
export class PessoasService {
  constructor(
    private readonly prismaService: PrismaService,
    private filesService: FilesService,
  ) { }

  async create(createPessoaDto: CreatePessoaDto) {
    const {
      cep,
      logradouro,
      bairro,
      cidade,
      complemento,
      estado,
      numero,
      documentos,
    } = createPessoaDto;
    console.log(createPessoaDto);
    const result = await this.prismaService.pessoa.create({
      data: {
        nome: createPessoaDto.nome,
        documento: createPessoaDto.documento,
        email: createPessoaDto.email,
        telefone: createPessoaDto.telefone,
        profissao: createPessoaDto.profissao,
        estadoCivil: createPessoaDto.estadoCivil,
        status: createPessoaDto.status,

        endereco:
          logradouro ||
            bairro ||
            cidade ||
            estado ||
            cep ||
            numero ||
            complemento
            ? {
              create: {
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
      // também retornar o endereço e a locação criados
      include: {
        endereco: true,
        documentos: true,
      },
    });

    if (documentos) {
      await this.createPessoaDocuments(result.id, documentos);
    }

    return result;
  }

  async createPessoaDocuments(
    PessoaId: number,
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
                id: PessoaId,
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

  async findById(id: number) {
    return await this.prismaService.pessoa.findUnique({
      where: {
        id: id,
      },
      include: {
        endereco: true,
        documentos: true,
        proprietarios: {
          include: {
            imovel: {
              include: {
                endereco: true,
              }
            },
          },
        },
        locatarios: {
          include: {
            locacoes: {
              include: {
                imovel: {
                  include: {
                    endereco: true
                  }
                },
                fiadores: {
                  include: {
                    pessoa: true,
                  }
                }
              }
            },
            pessoa: true
          }
        },
        fiador: {
          include: {
            locacoes: {
              include: {
                locatarios: {
                  include: {
                    pessoa: true
                  }
                },
                imovel: {
                  include: {
                    endereco: true,
                  }
                }
              }
            },
          }
        }
      },
    });
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    //atualizar status da locação, atualizar preço do aluguel, atualizar status do imóvel, atualizar as datas de início e fim da locação, adicionar obersevações vinculadas a locação, imovel e ao locatário (opcional ter locatario)
    const {
      cep,
      logradouro,
      bairro,
      cidade,
      complemento,
      estado,
      numero,
      documentos,
      documentosToDeleteIds,
    } = updatePessoaDto;

    const result = await this.prismaService.pessoa.update({
      where: {
        id: id,
      },
      data: {
        estadoCivil: updatePessoaDto.estadoCivil,
        nome: updatePessoaDto.nome,
        documento: updatePessoaDto.documento,
        email: updatePessoaDto.email,
        telefone: updatePessoaDto.telefone,
        profissao: updatePessoaDto.profissao,
        status: updatePessoaDto.status,
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
        proprietarios: true,
      },
    });

    if (documentos) {
      await this.createPessoaDocuments(result.id, documentos);
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

    return result;
  }

  async findMany(
    search: string,
    page: number,
    pageSize: number,
    exclude: string | null,
  ): Promise<BasePaginationData<Pessoa>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    const where: Prisma.PessoaWhereInput = {
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
      //Quando quiser excluir id´s
      AND: [
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]

    };

    const [data, total] = await this.prismaService.$transaction([
      this.prismaService.pessoa.findMany({
        where,
        include: {
          endereco: true,
          proprietarios: {
            include: {
              imovel: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      this.prismaService.pessoa.count({ where }),
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

  async deletePessoa(id: number) {
    try {
      return this.prismaService.pessoa.delete({
        where: {
          id: id,
        },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new Error('Pessoa não encontrado');
      }
    }
  }

  //==================LOCACOES=================

  async findLocacoesByPessoaId(id: number) {
    return this.prismaService.pessoa.findUnique({
      where: {
        id: id,
      },
      include: {
        proprietarios: {
          include: {
            imovel: true,
          },
        },
      },
    });
  }


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

    console.log(payments);
    return payments;
  }


  async deleteLocacao(id: number) {
    return await this.prismaService.locacao.update({
      where: {
        id,
      },
      data: {
        status: LocacaoStatus.ENCERRADA,
        // locatarioId: null,
      },
    });
  }

}
