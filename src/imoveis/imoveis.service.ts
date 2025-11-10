import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
import { FileData } from '@/common/interfaces/file-data';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { getFileType } from '@/proprietarios/proprietarios.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  Endereco,
  Imovel,
  ImovelStatus,
  Locacao,
  LocacaoStatus,
  Prisma,
  Proprietario,
  ValorImovelTipo
} from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { randomUUID } from 'node:crypto';
import { CreateImovelDto } from './dtos/create-imovel.dto';
import { UpdateImovelDto } from './dtos/update-imovel.dto';

export interface IFindImovelByIdResponse extends Imovel {
  endereco: Endereco;
  proprietarios: Proprietario[];
  locacoes: Locacao[];
}
@Injectable()
export class ImoveisService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) { }

  //async create(createImovelDto: CreateImovelDto,): Promise<Imovel & { endereco: Endereco; imovelPhotos: ImovelPhoto[] }> {
  async create(createImovelDto: CreateImovelDto,) {
    const result = await this.prismaService.imovel.create({
      data: {
        description: createImovelDto.description,
        status: createImovelDto.status,
        finalidade: createImovelDto.finalidade,
        porcentagemLucroImobiliaria: createImovelDto.porcentagemLucroImobiliaria,
        valorAluguel: createImovelDto.valorAluguel,

        //TODO: add observacoes
        //TODO: add imovelPhotos

        endereco: {
          create: {
            logradouro: createImovelDto?.logradouro,
            numero: createImovelDto?.numero,
            bairro: createImovelDto?.bairro,
            cidade: createImovelDto?.cidade,
            estado: createImovelDto?.estado,
            cep: createImovelDto?.cep,
            complemento: createImovelDto?.complemento,
          },
        },
        tipo: {
          connect: { id: createImovelDto.tipoId }
        }
      },
      include: {
        endereco: true,
        observacoes: true,
        imovelPhotos: true,
        documentos: true,
        tipo: { select: { id: true, name: true } }
      },
    });

    if (createImovelDto?.images?.length) {
      await this.createImovelPhotos(result.id, createImovelDto.images);
    }

    if (createImovelDto?.documentos?.length) {
      await this.createImovelDocuments(result.id, createImovelDto.documentos);
    }

    return result;
  }

  async createImovelPhotos(imovelId: number, files: MemoryStoredFile[]) {
    try {
      // Crie uma lista de promessas para processar cada arquivo
      const imagePromises = files.map(async (file) => {
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

        return this.prismaService.imovelPhoto.create({
          data: {
            url,
            imovel: {
              connect: {
                id: imovelId,
              },
            },
          },
        });
      });

      const results = await Promise.all(imagePromises);

      return results;
    } catch (error) {
      console.log('Error creating imovel photos', error);
    }
  }

  async findById(id: number): Promise<IFindImovelByIdResponse> {
    const data = await this.prismaService.imovel.findUnique({
      where: {
        id,
      },
      include: {
        endereco: true,
        imovelPhotos: true,
        locacoes: {
          /*where: {
            status: LocacaoStatus.ATIVA,
          },*/
          include: {
            locatarios: {
              include: {
                pessoa: true,
              }
            },
            documentos: true,
            garantiaDepositoCalcao: true,
            fiadores: {
              include: {
                pessoa: true,
              }
            },
            garantiaSeguroFianca: true,
            garantiaTituloCapitalizacao: true,
          },
        },
        proprietarios: {
          include: {
            pessoa: true,
          }
        },
        documentos: true,
        observacoes: true,
        tipo: { select: { id: true, name: true } },
      },
    });

    if (!data) {
      throw new NotFoundException('Imovel not found');
    }

    return data;
  }

  async findMany(
    searchTerm: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    tipoImovel: number | null | undefined,
    exclude: string | null,
  ): Promise<BasePaginationData<Imovel>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined && exclude.length > 0) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (tipoImovel !== undefined) {
      if (tipoImovel.toString() === 'undefined') {
        tipoImovel = undefined;
      }
    }


    const where: Prisma.ImovelWhereInput = {
      OR: [
        {
          endereco: {
            bairro: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cidade: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            estado: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            logradouro: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            numero: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cep: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
      AND: [
        ((tipoImovel === null || tipoImovel === undefined) ? {} : { tipoId: { equals: Number(tipoImovel) } }),
        (arr_id.length === 0 ? {} : { id: { notIn: arr_id } }),
      ]
    };

    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.imovel.findMany({
        take: pageSize,
        skip,
        include: {
          endereco: true,
          observacoes: true,
          imovelPhotos: true,
          tipo: { select: { id: true, name: true } },
          locacoes: {
            include: {
              locatarios: {
                include: {
                  pessoa: true,
                }
              }
            }
          }
        },
        where,
      }),
      this.prismaService.imovel.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data.length,
      totalPages,
    };
  }

  //Persquisa imóveis para locação
  async findManyLocacao(
    searchTerm: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
    tipoImovel: number | null | undefined,
    exclude: string | null,
  ): Promise<BasePaginationData<Imovel>> {
    const skip = page > 1 ? (page - 1) * pageSize : 0;
    let arr_id: number[] = [];

    if (exclude !== null && exclude !== undefined && exclude.length > 0) {
      exclude.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })
    }

    if (tipoImovel !== undefined) {
      if (tipoImovel.toString() === 'undefined') {
        tipoImovel = undefined;
      }
    }


    const where: Prisma.ImovelWhereInput = {
      OR: [
        {
          endereco: {
            bairro: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cidade: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            estado: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            logradouro: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            numero: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
        {
          endereco: {
            cep: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          },
        },
      ],
      AND: [
        ((tipoImovel === null || tipoImovel === undefined) ? {} : { tipoId: { equals: Number(tipoImovel) } }),
        (arr_id.length === 0 ? {} : { id: { notIn: arr_id } }),
        {
          status: ImovelStatus.DISPONIVEL,
        }
      ]
    };

    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.imovel.findMany({
        take: pageSize,
        skip,
        include: {
          endereco: true,
          observacoes: true,
          imovelPhotos: true,
          tipo: { select: { id: true, name: true } },
        },
        where,
      }),
      this.prismaService.imovel.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data.length,
      totalPages,
    };
  }

  //Pesquisa por status/tipo
  async findStatusType(statusImovel: ImovelStatus,) {
    const where: Prisma.ImovelWhereInput = {
      AND: [
        {
          status: {
            equals: statusImovel,
          },
        },
      ],
    };

    const data = await this.prismaService.imovel.findMany({
      include: {
        endereco: true,
        tipo: { select: { id: true, name: true } },
      },
      where,
    });

    return data;

  }

  //TODO: create types for update data
  async update(id: number, data: UpdateImovelDto) {
    await this.checkImovelExists(id);

    const {
      logradouro,
      numero,
      bairro,
      cidade,
      estado,
      cep,
      complemento,
      imagesToDeleteIds,
      images,
      documentosToDeleteIds,
      documentos,
      ...imovelData
    } = data;
    // Atualiza os dados do imóvel

    await this.prismaService.imovel.update({
      where: { id },
      data: {
        description: data.description,
        status: data.status,
        finalidade: data.finalidade,
        porcentagemLucroImobiliaria: data.porcentagemLucroImobiliaria,
        valorAluguel: data.valorAluguel,

        tipo: data.tipoId ? { connect: { id: data.tipoId } } : undefined,
        //if we have any address data, update it
        endereco:
          logradouro ||
            numero ||
            bairro ||
            cidade ||
            estado ||
            cep ||
            complemento
            ? {
              update: {
                logradouro,
                numero,
                bairro,
                cidade,
                estado,
                cep,
                complemento,
              },
            }
            : undefined,
      },
      include: { endereco: true, imovelPhotos: true, observacoes: true, tipo: { select: { id: true, name: true } } },
    });
    //check if we have a new valores to gerenate ImovelValorHistorico

    if (data.valorAluguel) {

      if (data.valorAluguel) {
        await this.prismaService.imovelValorHistorico.create({
          data: {
            tipo: ValorImovelTipo.ALUGUEL,
            valor: data.valorAluguel,
            imovelId: id,
          },
        });
      }
    }

    // Remove imagens, se solicitado
    if (imagesToDeleteIds?.length) {
      await this.prismaService.imovelPhoto.deleteMany({
        where: {
          id: { in: imagesToDeleteIds },
          imovelId: id,
        },
      });

      //TODO: Remover imagens do storage
      // removeImageIds?.forEach(async (fileId) => {
      // await this.filesService.deleteFile(fileId);
      // })
    }

    //TODO: Reordenar imagens, se solicitado

    // Adiciona novas imagens, se fornecidas
    if (images?.length) {
      await this.createImovelPhotos(id, images);
    }

    // Remove documentos, se solicitado
    if (documentosToDeleteIds?.length) {

      /*let arr_id: number[] = [];

      documentosToDeleteIds.split(',').map((id) => {
        if (id !== '') {
          arr_id.push(parseFloat(id));
        }
      })*/

      await this.prismaService.genericAnexo.deleteMany({
        where: {
          id: {
            in: documentosToDeleteIds,
          },
        },
      });
      //TODO: Remover imagens do storage
      // removeImageIds?.forEach(async (fileId) => {
      // await this.filesService.deleteFile(fileId);
      // })
    }

    //TODO: Reordenar imagens, se solicitado

    // Adiciona novas imagens, se fornecidas
    if (documentos?.length) {
      await this.createImovelDocuments(id, documentos);
    }

    //get updated data

    const updatedImovelWithPhotos = await this.prismaService.imovel.findUnique({
      where: {
        id,
      },
      include: {
        endereco: true,
        imovelPhotos: true,
        observacoes: true,
        documentos: true,
        locacoes: {
          where: {
            status: LocacaoStatus.ATIVA,
          },
          include: {
            locatarios: true,
          },
        },
        tipo: { select: { id: true, name: true } },
      },
    });

    return updatedImovelWithPhotos;
  }

  private async checkImovelExists(id: number) {
    const imovel = await this.prismaService.imovel.findUnique({
      where: {
        id: id,
      },
    });

    if (!imovel) {
      throw new NotFoundException('Imovel not found');
    }
  }

  async delete(id: number) {
    await this.checkImovelExists(id);

    //Delete related data

    // await this.prismaService.imovelValorHistorico.deleteMany({
    //   where: {
    //     imovelId: id,
    //   },
    // });

    await this.prismaService.imovelPhoto.deleteMany({
      where: {
        imovelId: id,
      },
    });

    // await this.prismaService.locacao.deleteMany({
    //   where: {
    //     imovelId: id,
    //   },
    // });

    await this.prismaService.imovel.delete({
      where: {
        id,
      },
    });
  }

  async createImovelDocuments(
    ImovelId: number,
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
            imovel: {
              connect: {
                id: ImovelId,
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

}
