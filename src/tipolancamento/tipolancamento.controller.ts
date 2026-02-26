import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { lancamentoTipo, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TipoLancamentoService } from './tipolancamento.service';

export class CreateTipoDto {
  @IsString()
  name: string;

  @IsEnum(lancamentoTipo)
  tipo: lancamentoTipo;

  @IsString()
  automatico: string;

  @IsNumber()
  parcelas: number;

  @IsString()
  geraObservacao: string;

  @IsNumber()
  valorFixo: number;

  @IsNumber()
  empresaId: number;
}

export const TIPO_ROUTES: BaseRoutes = {
  create: {
    name: 'create tipo',
    route: '/',
    permission: Permission.CREATE_TIPO_LANC,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_TIPOS_LANC,
  },
  update: {
    name: 'update Tipo',
    route: ':id',
    permission: Permission.UPDATE_TIPO_LANC,
  },
  findMany: {
    name: 'findMany',
    route: '/:empresaId',
    permission: Permission.VIEW_TIPOS_LANC,
  },
  delete: {
    name: 'delete Tipo',
    route: ':id',
    permission: Permission.DELETE_TIPO_LANC,
  },
  patchAtiva: {
    name: 'Ativa Tipo',
    route: '/statusAtiva/:id',
    permission: Permission.UPDATE_TIPO_LANC,
  },
  patchDesativa: {
    name: 'Desativa Tipo',
    route: '/statusDesativa/:id',
    permission: Permission.UPDATE_TIPO_LANC,
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

@Controller('tipolancamento')
export class TipoLancamentoController {
  constructor(private readonly TipoLancamentoService: TipoLancamentoService) { }

  @Post(TIPO_ROUTES.create.route)
  @Permissions(TIPO_ROUTES.create.permission)
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.TipoLancamentoService.createTipo(createTipoDto);
  }

  @Put(TIPO_ROUTES.update.route)
  @Permissions(TIPO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoDto,
  ) {
    return this.TipoLancamentoService.updateTipo(Number(id), data);
  }


  @Delete(TIPO_ROUTES.delete.route)
  @Permissions(TIPO_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoLancamentoService.deleteTipo(Number(id));
  }

  @Get(TIPO_ROUTES.findMany.route)
  //@Permissions(TIPO_ROUTES.findMany.permission)
  async getTipo(@Param() { empresaId }: BaseParamsIdEmpresaDto) {
    return await this.TipoLancamentoService.getTipos(empresaId);
  }

  @Patch(TIPO_ROUTES.patchAtiva.route)
  @Permissions(TIPO_ROUTES.patchAtiva.permission)
  async ativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoLancamentoService.ativaTipo(Number(id));
  }

  @Patch(TIPO_ROUTES.patchDesativa.route)
  @Permissions(TIPO_ROUTES.patchDesativa.permission)
  async desativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoLancamentoService.desativaTipo(Number(id));
  }

}
