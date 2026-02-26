import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import { TipoImovelService } from './tipoimovel.service';

export class CreateTipoDto {
  @IsString()
  name: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

}

export const TIPO_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo',
    route: '/',
    permission: Permission.CREATE_TIPO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPOS,
  },
  update: {
    name: 'update Tipo',
    route: ':id',
    permission: Permission.UPDATE_TIPO,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_TIPOS,
  },
  delete: {
    name: 'delete Tipo',
    route: ':id',
    permission: Permission.DELETE_TIPO,
  },
  patchAtiva: {
    name: 'Ativa Tipo',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO,
  },
  patchDesativa: {
    name: 'Desativa Tipo',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

export class BaseParamsIdEmpresaDto {
  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;
}

@Controller('tipoimovel')
export class TipoImovelController {
  constructor(private readonly TipoImovelService: TipoImovelService) { }

  @Post(TIPO_ROUTES.create.route)
  @Permissions(TIPO_ROUTES.create.permission)
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.TipoImovelService.createTipo(createTipoDto);
  }

  @Put(TIPO_ROUTES.update.route)
  @Permissions(TIPO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoDto,
  ) {
    return this.TipoImovelService.updateTipo(Number(id), data);
  }


  @Delete(TIPO_ROUTES.delete.route)
  @Permissions(TIPO_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoImovelService.deleteTipo(Number(id));
  }

  @Get(TIPO_ROUTES.findMany.route)
  @Permissions(TIPO_ROUTES.findMany.permission)
  async getTipo(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.TipoImovelService.getTipos(empresaId);
  }

  @Patch(TIPO_ROUTES.patchAtiva.route)
  @Permissions(TIPO_ROUTES.patchAtiva.permission)
  async ativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoImovelService.ativaTipo(Number(id));
  }

  @Patch(TIPO_ROUTES.patchDesativa.route)
  @Permissions(TIPO_ROUTES.patchDesativa.permission)
  async desativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoImovelService.desativaTipo(Number(id));
  }

}
