import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseGetSearchQueryDto, BaseParamsByIdDto, BaseParamsIdEmpresaDto } from '@/common/interfaces/base-search';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { PartialType } from '@nestjs/mapped-types';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest, HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { BlocoService } from './bloco.service';

export class CreateBlocoDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  observacao: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  qtdUnidades: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  totalAndares: number;

  @IsString()
  @IsOptional()
  possuiElevador: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  anoConstrucao: number;

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
  condominioId: number;
}

export class UpdateBlocoDto extends PartialType(CreateBlocoDto) {
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}


export const BLOCO_ROUTES: BaseRoutes = {
  create: {
    name: 'create bloco',
    route: '/',
    permission: Permission.CREATE_BLOCO,
  },
  findById: {
    name: 'findById',
    route: '/findbyid/:id',
    permission: Permission.VIEW_BLOCOS,
  },
  update: {
    name: 'update bloco',
    route: ':id',
    permission: Permission.UPDATE_BLOCO,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_BLOCOS,
  },
  delete: {
    name: 'delete bloco',
    route: ':id',
    permission: Permission.DELETE_BLOCO,
  },
};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;


}

@Controller('blocos')
export class BlocoController {
  constructor(private readonly blocoService: BlocoService) { }

  @Post(BLOCO_ROUTES.create.route)
  @Permissions(BLOCO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createBlocoDto: CreateBlocoDto) {
    return this.blocoService.create(createBlocoDto);
  }

  @Put(BLOCO_ROUTES.update.route)
  @Permissions(BLOCO_ROUTES.update.permission)
  @FormDataRequest()
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateBlocoDto,
  ) {
    return this.blocoService.update(Number(id), data);
  }


  @Delete(BLOCO_ROUTES.delete.route)
  @Permissions(BLOCO_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.blocoService.delete(Number(id));
  }

  @Get(BLOCO_ROUTES.findMany.route)
  //@Permissions(BLOCO_ROUTES.findMany.permission)
  async getBlocos(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: BaseGetSearchQueryDto) {
    const { search, page, limit, exclude } = data;
    return await this.blocoService.getBlocos(Number(empresaId), search, page, limit, exclude);
  }

  @Get(BLOCO_ROUTES.findById.route)
  @Permissions(BLOCO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.blocoService.findById(id);
  }


}
