import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseGetPessoaQueryDto, BaseParamsByIdDto } from '@/common/interfaces/base-search';
import { EnderecoDto } from '@/common/interfaces/dtos/endereco.dto';
import { FiadorDto } from '@/imoveis/dtos/locacao-subdto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { EstadoCivil, Permission, PessoaStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsOptional,
  IsString
} from 'class-validator';
import {
  FormDataRequest,
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { PessoasService } from './pessoas.service';

export class GetPessoasQueryDto extends BaseGetPessoaQueryDto { }

export const PESSOA_ROUTES: BaseRoutes = {
  create: {
    name: 'Create Pessoa',
    route: '/',
    permission: Permission.CREATE_PESSOA,
  },
  findByDocument: {
    name: 'Find Pessoa by Document',
    route: '/find-by-document/:documento',
    permission: Permission.VIEW_PESSOAS,
  },
  get: {
    name: 'Get Pessoa',
    route: '/:id',
    permission: Permission.VIEW_PESSOAS,
  },
  put: {
    name: 'Update Pessoa',
    route: '/:id',
    permission: Permission.UPDATE_PESSOA,
  },
  delete: {
    name: 'Delete Pessoa',
    route: '/:id',
    permission: Permission.DELETE_PESSOA,
  },
  search: {
    name: 'Search Pessoas',
    route: '/',
    permission: Permission.VIEW_PESSOAS,
  },
  vincularProprietario: {
    name: 'Link Pessoa to proprietario',
    route: '/:id/vincular-prop/:propritearioId',
    permission: Permission.UPDATE_PROPRIETARIO,
  },
  desvincularImovel: {
    name: 'Unlink Pessoa from Proprietario',
    route: '/:id/desvincular-prop/:propritearioId',
    permission: Permission.UPDATE_PESSOA,
  },
  vincularLocatario: {
    name: 'Link Pessoa to Locatario',
    route: '/:id/vincular-loca/:locatarioId',
    permission: Permission.UPDATE_PESSOA,
  },
  desvincularLocatario: {
    name: 'Unlink Pessoa from Locatario',
    route: '/:id/desvincular-prop/:locatarioId',
    permission: Permission.UPDATE_PESSOA,
  },
};


export class CreatePreLinkLocacaoDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  locatarioId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId: number;
}

export class CreatePessoaDto extends EnderecoDto {
  @IsString()
  //TODO: create custom decorator to validate cpf
  documento: string;

  @IsString()
  nome: string;

  @IsString()
  @IsOptional()
  profissao?: string;

  @IsOptional()
  @IsEnum(EstadoCivil)
  estadoCivil?: EstadoCivil;

  @IsEmail()
  email: string;

  @IsString()
  //TODO: create custom decorator to validate phone number
  telefone: string;

  @IsEnum(PessoaStatus)
  status: PessoaStatus;
  // @IsNumber()
  // @Min(1)
  // @Max(28)
  // @IsDateString()
  // diaVencimentoPagamento: number;

  // @IsDateString()
  // dataInicio: Date;

  // @IsDateString()
  // @IsOptional()
  // dataFim?: Date;

  // @IsInt()
  // valor_aluguel: number;

  @IsInt()
  @IsOptional()
  proprietarioId?: number;

  @IsOptional()
  fiador?: FiadorDto;

  @IsFiles()
  @IsOptional()
  //Limiting to 50 for supabase free tier limit
  @MaxFileSize(50 * 1024 * 1024, { each: true })
  @HasMimeType(
    [
      'application/pdf', // PDF
      'image/jpeg', // Imagem JPEG
      'image/png', // Imagem PNG
      'application/msword', // Documento Word (.doc)
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ],
    {
      each: true,
    },
  )
  documentos?: MemoryStoredFile[];
}

export class UpdatePessoaDto extends PartialType(CreatePessoaDto) {
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) { }

  @Post(PESSOA_ROUTES.create.route)
  @Permissions(PESSOA_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createPessoaDto: CreatePessoaDto) {
    return this.pessoasService.create(createPessoaDto);
  }

  @Get(PESSOA_ROUTES.search.route)
  @Permissions(PESSOA_ROUTES.search.permission)
  async search(@Query() data: GetPessoasQueryDto) {
    const { search, page, limit, exclude } = data;
    const response = await this.pessoasService.findMany(search, page, limit, exclude);
    return response;
  }

  @Get(PESSOA_ROUTES.get.route)
  @Permissions(PESSOA_ROUTES.get.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.pessoasService.findById(id);
  }

  @Put(PESSOA_ROUTES.put.route)
  @Permissions(PESSOA_ROUTES.put.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: UpdatePessoaDto,
  ) {
    return await this.pessoasService.update(id, data);
  }

  @Delete(PESSOA_ROUTES.delete.route)
  @Permissions(PESSOA_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.pessoasService.deletePessoa(id);
  }

  //end rent
  /*  @Delete(PESSOA_ROUTES.unlinkLocacao.route)
    @Permissions(PESSOA_ROUTES.unlinkLocacao.permission)
    async unlinkLocacao(@Param() { id }: BaseParamsByIdDto) {
      return this.pessoasService.deleteLocacao(id);
    }*/

  //start ren
  /*@Post(PESSOA_ROUTES.createPreLinkLocacao.route)
  @Permissions(PESSOA_ROUTES.createPreLinkLocacao.permission)
  @FormDataRequest()
  async createLocacao(@Body() data: CreatePreLinkLocacaoDto) {
    return await this.pessoasService.preLinkLocatarioToLocacao(
      data.locatarioId,
      data.imovelId,
    );
  }*/

  /*@Put(PESSOA_ROUTES.updateLocacao.route)
  @Permissions(PESSOA_ROUTES.updateLocacao.permission)
  @FormDataRequest()
  async preLinkLocatarioToLocacao(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLocacaoDto,
  ) {
    return await this.pessoasService.updateLocacao(id, data);
  }*/
}
