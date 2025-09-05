import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import {
  BaseGetPaginatedQueryDto,
  BaseParamsByIdDto,
  BaseParamsByStatus,
} from '@/common/interfaces/base-search';
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
import { FormDataRequest } from 'nestjs-form-data';
import { CreateImovelDto } from './dtos/create-imovel.dto';
import { UpdateImovelDto } from './dtos/update-imovel.dto';
import { ImoveisService } from './imoveis.service';

export const IMOVEIS_ROUTES: BaseRoutes = {
  create: {
    name: 'Create Imovel',
    route: '/',
    permission: Permission.CREATE_IMOVEL,
  },
  search: {
    name: 'Search Imoveis',
    route: '/',
    permission: Permission.VIEW_IMOVELS,
  },
  searchStatusType: {
    name: 'Search Imoveis Status',
    route: '/locacao/',
    permission: Permission.VIEW_IMOVELS,
  },
  get: {
    name: 'Get Imovel',
    route: '/:id',
    permission: Permission.VIEW_IMOVELS,
  },
  update: {
    name: 'Update Imovel',
    route: '/:id',
    permission: Permission.UPDATE_IMOVEL,
  },
  delete: {
    name: 'Delete Imovel',
    route: '/:id',
    permission: Permission.DELETE_IMOVEL,
  },
};

@Controller('imoveis')
export class ImoveisController {
  constructor(private readonly imoveisService: ImoveisService) { }

  @Post(IMOVEIS_ROUTES.create.route)
  @Permissions(IMOVEIS_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() data: CreateImovelDto) {
    return this.imoveisService.create(data);
  }

  @Get(IMOVEIS_ROUTES.search.route)
  @Permissions(IMOVEIS_ROUTES.search.permission)
  async search(@Query() { limit, page, search, tipo, exclude }: BaseGetPaginatedQueryDto) {
    const data = await this.imoveisService.findMany(search, page, limit, tipo, exclude);

    return data;
  }

  @Get(IMOVEIS_ROUTES.searchStatusType.route)
  @Permissions(IMOVEIS_ROUTES.searchStatusType.permission)
  async getStatusTipo(@Query() { imovelStatus }: BaseParamsByStatus) {
    const data = await this.imoveisService.findStatusType(imovelStatus);

    return data;
  }

  @Get(IMOVEIS_ROUTES.get.route)
  @Permissions(IMOVEIS_ROUTES.get.permission)
  async get(@Param() { id }: BaseParamsByIdDto) {
    return await this.imoveisService.findById(id);
  }

  @Put(IMOVEIS_ROUTES.update.route)
  @Permissions(IMOVEIS_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: UpdateImovelDto,
  ) {

    return await this.imoveisService.update(id, data);
  }

  @Delete(IMOVEIS_ROUTES.delete.route)
  @Permissions(IMOVEIS_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return await this.imoveisService.delete(id);
  }
}
