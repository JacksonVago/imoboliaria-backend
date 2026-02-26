import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseGetSearchQueryDto, BaseParamsByIdDto, BaseParamsIdEmpresaDto } from '@/common/interfaces/base-search';
import { EnderecoDto } from '@/common/interfaces/dtos/endereco.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { FormaRateio, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsDate, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest, HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { CondominioService } from './condominio.service';

export class CreateCondominioDto extends EnderecoDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  observacao: string;

  @IsEnum(FormaRateio)
  formaRateio: FormaRateio;

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

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;
}

export class UpdateCondominioDto extends PartialType(CreateCondominioDto) {
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}


export const CONDOMINIO_ROUTES: BaseRoutes = {
  create: {
    name: 'create condominio',
    route: '/',
    permission: Permission.CREATE_CONDOMINIO,
  },
  findById: {
    name: 'findById',
    route: '/findbyid/:id',
    permission: Permission.VIEW_CONDOMINIOS,
  },
  findByEmp: {
    name: 'findByEmp',
    route: '/findbyempresa/:empresaId',
    permission: Permission.VIEW_CONDOMINIOS,
  },
  update: {
    name: 'update condominio',
    route: ':id',
    permission: Permission.UPDATE_CONDOMINIO,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_CONDOMINIOS,
  },
  Lancamentos: {
    name: 'condominio lancamentos',
    route: 'lancamentos/:id',
    permission: Permission.VIEW_LOCACAO_LANCAMENTOS,
  },
  delete: {
    name: 'delete condominio',
    route: ':id',
    permission: Permission.DELETE_CONDOMINIO,
  },
};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

export class GetLancamentosDto {
  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;
}



@Controller('condominios')
export class CondominioController {
  constructor(private readonly CondominioService: CondominioService) { }

  @Post(CONDOMINIO_ROUTES.create.route)
  @Permissions(CONDOMINIO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createCondominioDto: CreateCondominioDto) {
    return this.CondominioService.create(createCondominioDto);
  }

  @Put(CONDOMINIO_ROUTES.update.route)
  @Permissions(CONDOMINIO_ROUTES.update.permission)
  @FormDataRequest()
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateCondominioDto,
  ) {
    return this.CondominioService.updateCondominio(Number(id), data);
  }


  @Delete(CONDOMINIO_ROUTES.delete.route)
  @Permissions(CONDOMINIO_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.CondominioService.delete(Number(id));
  }

  @Get(CONDOMINIO_ROUTES.findById.route)
  @Permissions(CONDOMINIO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    console.log('empresaId', id);
    return await this.CondominioService.findById(id);
  }

  @Get(CONDOMINIO_ROUTES.findMany.route)
  @Permissions(CONDOMINIO_ROUTES.findMany.permission)
  async getCondominios(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: BaseGetSearchQueryDto) {
    const { search, page, limit, exclude } = data;
    return await this.CondominioService.getCondominios(Number(empresaId), search, page, limit, exclude);
  }

  @Get(CONDOMINIO_ROUTES.Lancamentos.route)
  @Permissions(CONDOMINIO_ROUTES.Lancamentos.permission)
  async lancamentos(@Param() { id }: BaseParamsByIdDto,
    @Query() data: GetLancamentosDto) {
    const { dataInicial, dataFinal } = data;
    const response = await this.CondominioService.findLancamentos(id, dataInicial, dataFinal);
    return response;
  }

  @Get(CONDOMINIO_ROUTES.findByEmp.route)
  @Permissions(CONDOMINIO_ROUTES.findByEmp.permission)
  async getCondominiosEmp(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.CondominioService.getCondominiosEmp(Number(empresaId));
  }


}
