import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto, DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { GarantiaLocacaoTypes, LocacaoStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';
import {
  FormDataRequest,
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';
import { LocacaoService } from './locacoes.service';

export enum GarantiaLocacaoTipo {
  'fiador' = 'fiador',
  'titulo-capitalizacao' = 'titulo-capitalizacao',
  'seguro-fianca' = 'seguro-fianca',
  'deposito-calcao' = 'deposito-calcao',
}

export class CreateLocacaoDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicio: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFim: Date;

  @Transform(({ value }) => Number(value))
  @IsInt()
  valor_aluguel: number;

  @IsOptional()
  @IsEnum(LocacaoStatus)
  status: LocacaoStatus;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  pessoaId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  dia_vencimento: number;

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

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  documentosToDeleteIds?: number[];

  @IsString()
  @IsEnum(GarantiaLocacaoTypes)
  @Transform(({ value }) => {
    if (value === GarantiaLocacaoTipo['fiador']) {
      return GarantiaLocacaoTypes.FIADOR;
    }
    if (value === GarantiaLocacaoTipo['titulo-capitalizacao']) {
      return GarantiaLocacaoTypes.TITULO_CAPITALIZACAO;
    }
    if (value === GarantiaLocacaoTipo['seguro-fianca']) {
      return GarantiaLocacaoTypes.SEGURO_FIANCA;
    }
    if (value === GarantiaLocacaoTipo['deposito-calcao']) {
      return GarantiaLocacaoTypes.DEPOSITO_CALCAO;
    }
    return value;
  })
  garantiaLocacaoTipo: GarantiaLocacaoTypes;

  @IsOptional()
  fiador: number[];

  //start garantia locacao data fields
  @IsOptional()
  @IsString()
  numeroTitulo: string;

  //seguro fianca data fields
  @IsOptional()
  @IsString()
  numeroSeguro: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  valorDeposito: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  quantidadeMeses: number;
}

export class UpdateLocacaoDto extends PartialType(CreateLocacaoDto) {
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}

export class CreatePreLinkLocacaoDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  locatarioId: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId: number;
}

export class CreateLocatarioDto {
  @IsInt()
  pessoaId?: number;

  @IsOptional()
  locacao?: CreateLocacaoDto;
}

export class GetLocacoesQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: LocacaoStatus | null;

  @IsOptional()
  exclude?: string;

}

export class UpdateLocatarioDto extends PartialType(CreateLocatarioDto) {
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}

export const LOCACAO_ROUTES: BaseRoutes = {
  create: {
    name: 'create Locacao',
    route: '/',
    permission: Permission.CREATE_LOCACAO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_LOCACOES,
  },
  update: {
    name: 'update Locacao',
    route: ':id',
    permission: Permission.UPDATE_LOCACAO,
  },
  findMany: {
    name: 'findMany',
    route: '/',
    permission: Permission.VIEW_LOCACOES,
  },
  delete: {
    name: 'delete Locacao',
    route: ':id',
    permission: Permission.DELETE_LOCACAO,
  },
  search: {
    name: 'Search Locacoes',
    route: '/',
    permission: Permission.VIEW_LOCACOES,
  },
  createPreLinkLocacao: {
    name: 'prelinkLocacao',
    route: 'preLinklocacao/create',
    permission: Permission.CREATE_LOCACAO,
  },
  updateLocacao: {
    name: 'locacoes',
    route: 'locacoes/:id',
    permission: Permission.UPDATE_LOCACAO,
  },
  unlinkLocacao: {
    name: 'unlinkLocacao',
    route: 'locacao/:id',
    permission: Permission.DELETE_LOCACAO,
  },
};

@Controller('locacoes')
export class LocacaoController {
  constructor(private readonly locacaoService: LocacaoService) { }

  @Post(LOCACAO_ROUTES.create.route)
  @Permissions(LOCACAO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createLocacaoDto: CreateLocacaoDto) {

    return this.locacaoService.create(createLocacaoDto);
  }

  /*@Get(LOCATARIO_ROUTES.findMany.route)
  @Permissions(LOCATARIO_ROUTES.findMany.permission)
  async findMany(@Query() data: GetProprietariosQueryDto) {
    const { search, page, limit } = data;
    const response = await this.locacaoService.findMany(search, page, limit);
    return response;
  }*/

  @Get(LOCACAO_ROUTES.search.route)
  @Permissions(LOCACAO_ROUTES.search.permission)
  async search(@Query() data: GetLocacoesQueryDto) {
    const { search, page, limit, status, exclude } = data;
    const response = await this.locacaoService.findMany(search, page, limit, status, exclude);
    return response;
  }

  @Get(LOCACAO_ROUTES.findById.route)
  @Permissions(LOCACAO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.locacaoService.findById(id);
  }

  @Put(LOCACAO_ROUTES.update.route)
  @Permissions(LOCACAO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLocacaoDto,
  ) {
    return await this.locacaoService.update(id, data);
  }

  @Delete(LOCACAO_ROUTES.delete.route)
  @Permissions(LOCACAO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.locacaoService.deleteLocatario(id);
  }

  //end rent
  @Delete(LOCACAO_ROUTES.unlinkLocacao.route)
  @Permissions(LOCACAO_ROUTES.unlinkLocacao.permission)
  async unlinkLocacao(@Param() { id }: BaseParamsByIdDto) {
    return this.locacaoService.deleteLocacao(id);
  }

  //start ren
  @Post(LOCACAO_ROUTES.createPreLinkLocacao.route)
  @Permissions(LOCACAO_ROUTES.createPreLinkLocacao.permission)
  @FormDataRequest()
  async createLocacao(@Body() data: CreatePreLinkLocacaoDto) {
    return await this.locacaoService.preLinkLocatarioToLocacao(
      data.locatarioId,
      data.imovelId,
    );
  }

  /*@Put(LOCACAO_ROUTES.updateLocacao.route)
  @Permissions(LOCACAO_ROUTES.updateLocacao.permission)
  @FormDataRequest()
  async preLinkLocatarioToLocacao(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: UpdateLocacaoDto,
  ) {
    return await this.locacaoService.updateLocacao(id, data);
  }*/
}
