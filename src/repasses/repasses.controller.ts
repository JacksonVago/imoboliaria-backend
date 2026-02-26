import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto, DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
import {
  Controller,
  Delete,
  Get,
  Param,
  Query
} from '@nestjs/common';
import { BoletoStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsOptional
} from 'class-validator';
import { RepassesService } from './repasses.service';

export class GetRepassesQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: BoletoStatus | null;

  @IsOptional()
  exclude?: string;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;

}

export const PAGAMENTO_ROUTES: BaseRoutes = {
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_PAGAMENTOS,
  },
  update: {
    name: 'update Repasse',
    route: ':id',
    permission: Permission.UPDATE_PAGAMENTO,
  },
  delete: {
    name: 'delete Repasse',
    route: ':id',
    permission: Permission.DELETE_PAGAMENTO,
  },
  search: {
    name: 'Search Repasses',
    route: '/',
    permission: Permission.VIEW_PAGAMENTOS,
  },
  statusRepasse: {
    name: 'Status Pagamento',
    route: 'statusRepasse/:id',
    permission: Permission.UPDATE_PAGAMENTO,
  },
};

@Controller('repasses')
export class RepasseController {
  constructor(private readonly RepasseService: RepassesService) { }

  @Get(PAGAMENTO_ROUTES.search.route)
  @Permissions(PAGAMENTO_ROUTES.search.permission)
  async search(@Query() data: GetRepassesQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.RepasseService.findMany(search, page, limit, status, exclude, dataInicial, dataFinal);
    return response;
  }

  @Get(PAGAMENTO_ROUTES.findById.route)
  @Permissions(PAGAMENTO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.RepasseService.findById(id);
  }

  @Delete(PAGAMENTO_ROUTES.delete.route)
  @Permissions(PAGAMENTO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.RepasseService.delete(id);
  }

}
