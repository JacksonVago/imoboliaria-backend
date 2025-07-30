import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseGetPaginatedQueryDto } from '@/common/interfaces/base-search';
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
import { Permission } from '@prisma/client';
import { IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { CreateProprietarioDto } from './dtos/create-proprietario.dto';
import { ProprietariosService } from './proprietarios.service';
import { log } from 'node:console';
export class GetProprietariosQueryDto extends BaseGetPaginatedQueryDto { }

export const PROPRIETARIOS_ROUTES: BaseRoutes = {
  create: {
    name: 'Create Proprietario',
    route: '/',
    permission: Permission.CREATE_PROPRIETARIO,
  },
  findByDocument: {
    name: 'Find Proprietario by Document',
    route: '/find-by-document/:documento',
    permission: Permission.VIEW_PROPRIETARIOS,
  },
  get: {
    name: 'Get Proprietario',
    route: '/:id',
    permission: Permission.VIEW_PROPRIETARIOS,
  },
  put: {
    name: 'Update Proprietario',
    route: '/:id',
    permission: Permission.UPDATE_PROPRIETARIO,
  },
  vincularImovel: {
    name: 'Link Proprietario to Imovel',
    route: '/:id/vincular-imovel/:imovelId',
    permission: Permission.UPDATE_PROPRIETARIO,
  },
  desvincularImovel: {
    name: 'Unlink Proprietario from Imovel',
    route: '/:id/desvincular-imovel/:imovelId',
    permission: Permission.UPDATE_PROPRIETARIO,
  },
  delete: {
    name: 'Delete Proprietario',
    route: '/:id',
    permission: Permission.DELETE_PROPRIETARIO,
  },
  search: {
    name: 'Search Proprietarios',
    route: '/',
    permission: Permission.VIEW_PROPRIETARIOS,
  },
};

export class FindByDocumentParamsDto {
  @IsString()
  documento: string;
}

@Controller('proprietarios')
export class ProprietariosController {
  constructor(private readonly proprietariosService: ProprietariosService) { }

  @Post(PROPRIETARIOS_ROUTES.create.route)
  @Permissions(PROPRIETARIOS_ROUTES.create.permission)
  @FormDataRequest()
  async create(@Body() data: CreateProprietarioDto) {
    return await this.proprietariosService.create(data);
  }

  @Get(PROPRIETARIOS_ROUTES.get.route)
  @Permissions(PROPRIETARIOS_ROUTES.get.permission)
  async get(@Param('id') id: number) {
    return await this.proprietariosService.findProprietarioById(id);
  }

  @Get(PROPRIETARIOS_ROUTES.findByDocument.route)
  @Permissions(PROPRIETARIOS_ROUTES.findByDocument.permission)
  async findByDocument(@Param() { documento }: FindByDocumentParamsDto) {
    return await this.proprietariosService.findByDocumento(documento);
  }

  @Put(PROPRIETARIOS_ROUTES.put.route)
  @Permissions(PROPRIETARIOS_ROUTES.put.permission)
  @FormDataRequest()
  //async update(@Param('id') id: number, @Body() data: UpdateProprietarioDto) {
  async update(@Param('id') id: number, @Body() data: CreateProprietarioDto) {
    return await this.proprietariosService.update(id, data);
  }

  @Put(PROPRIETARIOS_ROUTES.vincularImovel.route)
  @Permissions(PROPRIETARIOS_ROUTES.vincularImovel.permission)
  @FormDataRequest()
  async vincularImovel(
    @Param('id') id: number,
    @Param('imovelId') imovelId: number,
    @Body() data: CreateProprietarioDto
  ) {
    console.log(data);

    return await this.proprietariosService.linkProprietarioToImovel(
      id,
      imovelId,
      data,
    );
  }

  @Delete(PROPRIETARIOS_ROUTES.desvincularImovel.route)
  @Permissions(PROPRIETARIOS_ROUTES.desvincularImovel.permission)
  async desvincularImovel(
    @Param('id') id: number,
    @Param('imovelId') imovelId: number,
  ) {
    return await this.proprietariosService.unlinkProprietarioFromImovel(
      id,
      imovelId,
    );
  }

  @Delete(PROPRIETARIOS_ROUTES.delete.route)
  @Permissions(PROPRIETARIOS_ROUTES.delete.permission)
  async delete(@Param('id') id: number) {
    await this.proprietariosService.delete(id);
  }

  @Get(PROPRIETARIOS_ROUTES.search.route)
  @Permissions(PROPRIETARIOS_ROUTES.search.permission)
  async search(@Query() data: GetProprietariosQueryDto) {
    const { search, page, limit } = data;
    console.log(data);

    const response = await this.proprietariosService.findManyBySearch(
      search,
      page,
      limit,
    );

    console.log(response);

    return response;
  }
}
