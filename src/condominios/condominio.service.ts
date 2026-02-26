import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { FileData } from '@/common/interfaces/file-data';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { getFileType } from '@/proprietarios/proprietarios.service';
import { Injectable } from '@nestjs/common';
import { Condominio, Prisma } from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { randomUUID } from 'node:crypto';
import { CreateCondominioDto, UpdateCondominioDto } from './condominio.controller';

@Injectable()
export class CondominioService {
  constructor(
    private PrismaService: PrismaService,
    private filesService: FilesService,
  ) { }
  async create(createCondominioDto: CreateCondominioDto) {
    const {
      cep,
      logradouro,
      bairro,
      cidade,
      complemento,
      estado,
      numero,
      documentos,
    } = createCondominioDto;

    const createCondominio = createCondominioDto;

    const result = await this.PrismaService.condominio.create({
      data: {
        name: createCondominio.name,
        observacao: createCondominio.observacao,
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
        formaRateio: createCondominio.formaRateio,
        empresa: createCondominio.empresaId ? { connect: { id: createCondominio.empresaId } } : undefined,
      },
      include: {
        endereco: true,
        documentos: true,
        blocos: true,
        imovels: true,
        empresa: true,
      },
    });

    if (documentos) {
      await this.createCondominioDocuments(result.id, documentos);
    }

    return result;
  }

  async createCondominioDocuments(
    CondominioId: number,
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

        return this.PrismaService.genericAnexo.create({
          data: {
            tipoArquivo: fileType,
            url,
            type: file.mimetype,
            name: file.originalName,
            pessoa: {
              connect: {
                id: CondominioId,
              },
            },
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createCondominioDocuments', error);
    }
  }

  async updateCondominio(id: number, createCondominio: UpdateCondominioDto) {
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
    } = createCondominio;

    const result = await this.PrismaService.condominio.update({
      where: {
        id,
      },
      data: {
        name: createCondominio.name,
        observacao: createCondominio.observacao,
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
        formaRateio: createCondominio.formaRateio,
      },
      include: {
        endereco: true,
        documentos: true,
        blocos: true,
        imovels: true,
        empresa: true,
      },
    });

    if (documentos) {
      await this.createCondominioDocuments(result.id, documentos);
    }

    if (documentosToDeleteIds) {
      await this.PrismaService.genericAnexo.deleteMany({
        where: {
          id: {
            in: documentosToDeleteIds,
          },
        },
      });
    }

    return result;
  }

  async findById(id: number) {
    const result = await this.PrismaService.condominio.findUnique({
      where: {
        id: id,
      },
      include: {
        endereco: true,
        documentos: true,
        blocos: true,
        imovels: true,
        empresa: true,
      },
    });

    return result;
  }

  async getCondominiosEmp(empresaId: number) {
    return await this.PrismaService.condominio.findMany({
      where: {
        empresaId: empresaId,
      },
      include: {
        endereco: true,
        documentos: true,
        blocos: true,
        imovels: true,
        empresa: true,
      },
    });
  }

  async getCondominios(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    exclude: string | null,
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

    const where: Prisma.CondominioWhereInput = {
      OR: [
        {
          name: {
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
        empresaId ? { empresaId: empresaId } : {},
      ]

    };

    const [data, total] = await this.PrismaService.$transaction([
      this.PrismaService.condominio.findMany({
        where,
        include: {
          endereco: true,
          blocos: {
            include: {
              imovels: true,
            },
          },
        },
        skip,
        take: pageSize,
      }),
      this.PrismaService.condominio.count({ where }),
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

  async findLancamentos(
    id: number,
    dataInicial: Date,
    dataFinal: Date,
  ) {

    let dataFim: Date = dataFinal;
    dataFim.setDate(dataFinal.getDate() + 1);

    return this.PrismaService.bloco.findUnique({
      where: {
        id: id,
      },
      include: {
        condominio: true,
        lancamentosCondominios: {
          where: {
            dataLancamento: {
              gte: dataInicial,
              lte: dataFim,

            }
          },
          include: {
            lancamentotipo: true,
          }
        },
        imovels: true,
      }
    });

  }

  async delete(id: number) {
    return await this.PrismaService.condominio.delete({
      where: {
        id,
      }
    });
  }
}
