import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { FileData } from '@/common/interfaces/file-data';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { getFileType } from '@/proprietarios/proprietarios.service';
import { Injectable } from '@nestjs/common';
import { Bloco, Prisma } from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { randomUUID } from 'node:crypto';
import { CreateBlocoDto, UpdateBlocoDto } from './bloco.controller';

@Injectable()
export class BlocoService {
  constructor(
    private PrismaService: PrismaService,
    private filesService: FilesService,
  ) { }
  async create(createBlocoDto: CreateBlocoDto) {
    const {
      documentos,
    } = createBlocoDto;

    const createBloco = createBlocoDto;

    const result = await this.PrismaService.bloco.create({
      data: {
        name: createBloco.name,
        observacao: createBloco.observacao,
        qtdUnidades: createBloco.qtdUnidades,
        totalAndares: createBloco.totalAndares,
        possuiElevador: createBloco.possuiElevador,
        anoConstrucao: createBloco.anoConstrucao,
        condominio: createBloco.condominioId ? { connect: { id: createBloco.condominioId } } : undefined,
      },
      include: {
        documentos: true,
        condominio: true,
        imovels: true
      },
    });

    if (documentos) {
      await this.createBloco(result.id, documentos);
    }

    return result;
  }

  async createBloco(
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
      console.error('Error on createBloco', error);
    }
  }

  async update(id: number, createBloco: UpdateBlocoDto) {
    const {
      documentos,
      documentosToDeleteIds,
    } = createBloco;

    const result = await this.PrismaService.bloco.update({
      where: {
        id,
      },
      data: {
        name: createBloco.name,
        observacao: createBloco.observacao,
        qtdUnidades: createBloco.qtdUnidades,
        totalAndares: createBloco.totalAndares,
        possuiElevador: createBloco.possuiElevador,
        anoConstrucao: createBloco.anoConstrucao,
      },
      include: {
        documentos: true,
        condominio: true,
        imovels: true
      },
    });

    if (documentos) {
      await this.createBlocoDocuments(result.id, documentos);
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
    const result = await this.PrismaService.bloco.findUnique({
      where: {
        id: id,
      },
      include: {
        condominio: {
          include: {
            endereco: true,
          }
        },
        documentos: true,
        imovels: true,
      },
    });

    return result;
  }

  async createBlocoDocuments(
    BlocoId: number,
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
                id: BlocoId,
              },
            },
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createBlocoDocuments', error);
    }
  }

  async getBlocos(empresaId: number,
    search: string,
    page: number,
    pageSize: number,
    exclude: string | null,
  ): Promise<BasePaginationData<Bloco>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    const where: Prisma.BlocoWhereInput = {
      OR: [
        {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        {
          condominio: {
            endereco: {
              logradouro: {
                contains: search,
                mode: 'insensitive',
              },
            }
          }
        },
        {
          condominio: {
            endereco: {
              bairro: {
                contains: search,
                mode: 'insensitive',
              },
            }
          }
        },
        {
          condominio: {
            endereco: {
              cidade: {
                contains: search,
                mode: 'insensitive',
              },
            }
          }
        },
        {
          condominio: {
            endereco: {
              estado: {
                contains: search,
                mode: 'insensitive',
              },
            }
          }
        },
        {
          condominio: {
            endereco: {
              cep: {
                contains: search,
                mode: 'insensitive',
              },
            }
          }
        },
      ],
      //Quando quiser excluir id´s
      AND: [
        (exclude === null ? {} : { id: { notIn: arr_id } }),
      ]

    };
    const [data, total] = await this.PrismaService.$transaction([
      this.PrismaService.bloco.findMany({
        where,
        include: {
          condominio: {
            include: { endereco: true }
          },
          imovels: true,
          documentos: true,
        },
        skip,
        take: pageSize,
      }),
      this.PrismaService.bloco.count({ where }),
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
    return await this.PrismaService.bloco.delete({
      where: {
        id,
      }
    });
  }
}
