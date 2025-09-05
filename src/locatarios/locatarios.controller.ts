import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto } from '@/common/interfaces/base-search';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put
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
import { LocatariosService } from './locatarios.service';

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
  @Transform(({ value }) => Number(value))
  @IsInt()
  fiador: number[];

  //start garantia locacao data fields
  @IsOptional()
  @IsString()
  numeroTitulo: string;

  //seguro fianca data fields
  @IsOptional()
  @IsString()
  NumeroSeguro: string;

  @IsNumber()
  @Min(0)
  valorDeposito: number;

  @IsNumber()
  @Min(0)
  quantidadeMeses: number;
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

export class UpdateLocatarioDto extends PartialType(CreateLocatarioDto) {
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}

export const LOCATARIO_ROUTES: BaseRoutes = {
  create: {
    name: 'create',
    route: '/',
    permission: Permission.CREATE_LOCATARIO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_LOCATARIOS,
  },
  update: {
    name: 'update',
    route: ':id',
    permission: Permission.UPDATE_LOCATARIO,
  },
  findMany: {
    name: 'findMany',
    route: '/',
    permission: Permission.VIEW_LOCATARIOS,
  },
  delete: {
    name: 'delete',
    route: ':id',
    permission: Permission.DELETE_LOCATARIO,
  },
  createPreLinkLocacao: {
    name: 'prelinkLocacao',
    route: 'preLinklocacao/create',
    permission: Permission.CREATE_LOCACAO,
  },
  updateLocacao: {
    name: 'locacao',
    route: 'locacao/:id',
    permission: Permission.UPDATE_LOCACAO,
  },
  unlinkLocacao: {
    name: 'unlinkLocacao',
    route: 'locacao/:id',
    permission: Permission.DELETE_LOCACAO,
  },
};

@Controller('locatarios')
export class LocatariosController {
  constructor(private readonly locatariosService: LocatariosService) { }

  @Post(LOCATARIO_ROUTES.create.route)
  @Permissions(LOCATARIO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createLocatarioDto: CreateLocatarioDto) {
    return this.locatariosService.create(createLocatarioDto);
  }

  /*@Get(LOCATARIO_ROUTES.findMany.route)
  @Permissions(LOCATARIO_ROUTES.findMany.permission)
  async findMany(@Query() data: GetProprietariosQueryDto) {
    const { search, page, limit } = data;
    const response = await this.locatariosService.findMany(search, page, limit);
    return response;
  }*/

  @Get(LOCATARIO_ROUTES.findById.route)
  @Permissions(LOCATARIO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.locatariosService.findById(id);
  }

  @Put(LOCATARIO_ROUTES.update.route)
  @Permissions(LOCATARIO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: UpdateLocatarioDto,
  ) {
    return await this.locatariosService.update(id, data);
  }

  @Delete(LOCATARIO_ROUTES.delete.route)
  @Permissions(LOCATARIO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.locatariosService.deleteLocatario(id);
  }

  //end rent
  @Delete(LOCATARIO_ROUTES.unlinkLocacao.route)
  @Permissions(LOCATARIO_ROUTES.unlinkLocacao.permission)
  async unlinkLocacao(@Param() { id }: BaseParamsByIdDto) {
    return this.locatariosService.deleteLocacao(id);
  }

  //start ren
  @Post(LOCATARIO_ROUTES.createPreLinkLocacao.route)
  @Permissions(LOCATARIO_ROUTES.createPreLinkLocacao.permission)
  @FormDataRequest()
  async createLocacao(@Body() data: CreatePreLinkLocacaoDto) {
    return await this.locatariosService.preLinkLocatarioToLocacao(
      data.locatarioId,
      data.imovelId,
    );
  }

  @Put(LOCATARIO_ROUTES.updateLocacao.route)
  @Permissions(LOCATARIO_ROUTES.updateLocacao.permission)
  @FormDataRequest()
  async preLinkLocatarioToLocacao(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLocacaoDto,
  ) {
    return await this.locatariosService.updateLocacao(id, data);
  }
}
