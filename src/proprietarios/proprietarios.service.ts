import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { BasePaginationData } from '@/common/interfaces/base-pagination';
import { DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
import { FileData } from '@/common/interfaces/file-data';
import { FilesService } from '@/files/files.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma, Proprietario } from '@prisma/client';
import { MemoryStoredFile } from 'nestjs-form-data';
import { randomUUID } from 'node:crypto';
import { CreateProprietarioDto } from './dtos/create-proprietario.dto';

@Injectable()
export class ProprietariosService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly filesService: FilesService,
  ) { }

  async create(data: CreateProprietarioDto) {
    try {
      console.log('Create propritetario data', data);
      //const connectImoveisDataIds: Prisma.ImovelWhereUniqueInput[] =
      //        data?.vincularImoveisIds?.map((id) => ({ id }));

      const result = await this.prismaService.proprietario.create({
        data: {
          pessoaId: data.pessoaId,
          cota_imovel: data.cota_imovel,
          imovelId: data.imovelId,
        },
        include: {
          pessoa: true,
          imovel: true,
        },
      });

      //create proprietario documents
      /*if (data.documentos?.length) {
        await this.createProprietarioDocuments(result.id, data.documentos);
      }*/

      return result;
    } catch (error) {
      if (error?.code === 'P2002') {
        throw new ConflictException('Documento já cadastrado');
      }
      throw error;
    }
  }

  async createProprietarioDocuments(
    proprietarioId: number,
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
            pessoaId: proprietarioId,
          },
        });
      });

      const results = await Promise.all(documentPromisses);

      return results;
    } catch (error) {
      console.error('Error on createProprietarioDocuments', error);
    }
  }

  //async update(id: number, data: UpdateProprietarioDto) {
  async update(id: number, data: CreateProprietarioDto) {

    console.log(id);
    console.log(data);

    const proprietarioExists = await this.prismaService.proprietario.findUnique(
      {
        where: {
          id,
        },
      },
    );

    if (!proprietarioExists) {
      throw new Error('Proprietario not found');
    }

    /*
    if (data?.documentosToDeleteIds?.length) {
      await this.prismaService.genericAnexo.deleteMany({
        where: {
          id: {
            in: data.documentosToDeleteIds,
          },
        },
      });
    }*/

    const result = await this.prismaService.proprietario.update({
      where: {
        id,
      },
      include: {
        imovel: true,
      },
      data: {
        pessoaId: data.pessoaId,
        cota_imovel: data.cota_imovel,
        imovelId: data.imovelId,
        /*imoveis: {
          //Vincular e desvincular imoveis
          connect: data?.vincularImoveisIds?.map((id) => ({ id })),
          disconnect: data?.desvincularImoveisIds?.map((id) => ({ id })),
        },*/
      },
    });

    //create proprietario documents
    /*if (data.documentos?.length) {
      await this.createProprietarioDocuments(result.id, data.documentos);
    }

    if (data?.documentos?.length) {
      await this.createProprietarioDocuments(result.id, data.documentos);
    }*/

    return result;
  }

  async delete(id: number) {
    await this.checkProprietarioExists(id);

    return await this.prismaService.proprietario.delete({
      where: {
        id,
      },
    });
  }

  async findProprietarioById(id: number) {
    return await this.prismaService.proprietario.findUnique({
      include: {
        pessoa: {
          include: {
            endereco: true,
          }
        },
        imovel: {
          include: {
            endereco: true,
          },
        },
      },
      where: {
        id,
      },
    });
  }

  async linkProprietarioToImovel(proprietarioId: number, imovelId: number, linkDto: CreateProprietarioDto) {
    console.log('linkProprietarioToImovel', { proprietarioId, imovelId, linkDto });

    const pessoaExists = await this.prismaService.pessoa.findUnique({
      where: {
        id: proprietarioId,
      },
    });
    if (!pessoaExists) {
      throw new NotFoundException('Proprietário not found');
    }

    const imovelExists = await this.prismaService.imovel.findUnique({
      where: {
        id: imovelId,
      },
    });

    if (!imovelExists) {
      throw new NotFoundException('Imovel not found');
    }

    //Grava registro de vinculo
    const data = await this.prismaService.proprietario.create({
      data: {
        pessoaId: proprietarioId,
        cota_imovel: linkDto.cota_imovel,
        imovelId: imovelId,
      },
      include: {
        pessoa: true,
        imovel: true,
      },
    });

    /*
    await this.checkProprietarioExists(proprietarioId);
    const data = await this.prismaService.proprietario.update({
      where: {
        id: proprietarioId,
      },
      data: {
        imovelId: imovelId,
      },
    });
    */
    return data;
  }

  async unlinkProprietarioFromImovel(proprietarioId: number, imovelId: number) {
    await this.checkProprietarioExists(proprietarioId);

    const pessoaExists = await this.prismaService.pessoa.findUnique({
      where: {
        id: proprietarioId,
      },
    });
    if (!pessoaExists) {
      throw new NotFoundException('Proprietário not found');
    }

    const imovelExists = await this.prismaService.imovel.findUnique({
      where: {
        id: imovelId,
      },
    });

    if (!imovelExists) {
      throw new NotFoundException('Imovel not found');
    }

    const data = await this.prismaService.proprietario.update({
      where: {
        id: proprietarioId,
      },
      data: {
        imovelId: imovelId,
      },
    });
    return data;
  }

  async findByDocumento(documento: string) {
    const data = await this.prismaService.proprietario.findMany({
      where: {
        pessoa: {
          documento: {
            equals: documento,
          }
        },
      },
      include: {
        pessoa: true,
      },
    });

    if (!data) {
      throw new NotFoundException('Proprietario not found');
    }

    return data;
  }

  async findManyBySearch(
    searchTerm: string,
    page: number = 1,
    pageSize: number = DEFAULT_PAGE_SIZE,
  ): Promise<BasePaginationData<Proprietario>> {
    //TODO: implement search by name, document, phone, email

    const skip = page > 1 ? (page - 1) * pageSize : 0;

    const where: Prisma.ProprietarioWhereInput = {
      OR: [
        {
          pessoa: {
            nome: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            documento: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            telefone: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            email: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
        {
          pessoa: {
            endereco: {
              logradouro: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              bairro: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              cidade: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              estado: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            endereco: {
              cep: {
                contains: searchTerm,
                mode: 'insensitive',
              },
            },
          }
        },
        {
          pessoa: {
            profissao: {
              contains: searchTerm,
              mode: 'insensitive',
            },
          }
        },
      ],
    };

    const [data, totalItems] = await this.prismaService.$transaction([
      this.prismaService.proprietario.findMany({
        take: pageSize,
        skip,
        where,
        include: {
          pessoa: {
            include: {
              endereco: true,
            }
          },
          imovel: {
            include: {
              endereco: true,
            },
          },
        },
      }),
      this.prismaService.proprietario.count({
        where,
      }),
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);
    return {
      data,
      page,
      pageSize,
      currentPosition: skip + data.length, //current position in the list e.g. 10 of 100
      totalPages,
    };
  }

  private async checkProprietarioExists(id: number) {
    const proprietario = await this.findProprietarioById(id);
    if (!proprietario) {
      throw new Error('Proprietario not found');
    }
    return proprietario;
  }

}

export function getFileType(file: MemoryStoredFile): 'documento' | 'foto' {
  const isImage = file.mimetype.startsWith('image');
  return isImage ? 'foto' : 'documento';
}
