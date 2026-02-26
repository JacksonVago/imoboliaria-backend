import { Permissions } from '@/auth/decorators/permissions.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { FrequenciaAssinatura, Permission, TipoAssinatura } from '@prisma/client';
import { IsNumber, IsString } from 'class-validator';
import { AssinaturaService } from './assinatura.service';

export class CreateAssinaturaDto {


  @IsString()
  name: string;

  @IsNumber()
  descricao: string;

  @IsNumber()
  tipo: TipoAssinatura;

  @IsNumber()
  frequencia: FrequenciaAssinatura;

  @IsNumber()
  valor: number;

}

export const TIPO_ROUTES: BaseRoutes = {
  create: {
    name: 'create assintura',
    route: '/',
    permission: Permission.PAGSEGURO_CREATE_ORDER,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.PAGSEGURO_VIEW_ORDERS,
  },
  update: {
    name: 'update assinatura',
    route: ':id',
    permission: Permission.PAGSEGURO_UPDATE_ORDER,
  },
  findMany: {
    name: 'findMany',
    route: '/',
    permission: Permission.PAGSEGURO_VIEW_ORDERS,
  },
  delete: {
    name: 'delete Order',
    route: ':id',
    permission: Permission.PAGSEGURO_DELETE_ORDER,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;


}

@Roles(Role.PUBLIC)
@Controller('assinatura')
export class AssinaturaController {
  constructor(
    private readonly assinaturaService: AssinaturaService,
  ) { }

  @Post(TIPO_ROUTES.create.route)
  //@Permissions(TIPO_ROUTES.create.permission)
  create(@Body() createAssinaturaDto: CreateAssinaturaDto) {
    return this.assinaturaService.create(createAssinaturaDto);
  }

  @Put(TIPO_ROUTES.update.route)
  @Permissions(TIPO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateAssinaturaDto,
  ) {
    return this.assinaturaService.update(Number(id), data);
  }


  @Delete(TIPO_ROUTES.delete.route)
  @Permissions(TIPO_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.assinaturaService.delete(Number(id));
  }

  @Get(TIPO_ROUTES.findMany.route)
  @Permissions(TIPO_ROUTES.findMany.permission)
  async getAssinaturas() {
    return await this.assinaturaService.getAssinaturas();
  }

  @Get(TIPO_ROUTES.findById.route)
  @Permissions(TIPO_ROUTES.findById.permission)
  async getAssinatura(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.assinaturaService.getAssinatura(Number(id));
  }

}