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
import { lancamentoStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import {
  FormDataRequest
} from 'nestjs-form-data';
import { ReajustesService } from './reajustes.service';

export class CreateReajusteDto {

  @Transform(({ value }) => Number(value))
  @IsNumber()
  percentualRejuste: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorAluguel: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorRejuste: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataReajuste: Date;

  //start garantia locacao data fields
  @IsOptional()
  @IsString()
  observacao: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  locacaoId: number;

}

export class GetReajustesQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  status?: lancamentoStatus | null;

  @IsOptional()
  exclude?: string;

}

export const REAJUSTE_ROUTES: BaseRoutes = {
  create: {
    name: 'create Reajuste',
    route: '/',
    permission: Permission.CREATE_REAJUSTE,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_REAJUSTES,
  },
  update: {
    name: 'update Reajuste',
    route: ':id',
    permission: Permission.UPDATE_REAJUSTE,
  },
  delete: {
    name: 'delete Reajuste',
    route: ':id',
    permission: Permission.DELETE_REAJUSTE,
  },
  search: {
    name: 'Search Reajustes',
    route: '/',
    permission: Permission.VIEW_REAJUSTES,
  },
};

@Controller('reajustes')
export class ReajusteController {
  constructor(private readonly reajusteService: ReajustesService) { }

  @Post(REAJUSTE_ROUTES.create.route)
  @Permissions(REAJUSTE_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createReajusteDto: CreateReajusteDto) {

    return this.reajusteService.create(createReajusteDto);
  }

  @Get(REAJUSTE_ROUTES.search.route)
  @Permissions(REAJUSTE_ROUTES.search.permission)
  async search(@Query() data: GetReajustesQueryDto) {
    const { search, page, limit } = data;
    const response = await this.reajusteService.findMany(search, page, limit);
    return response;
  }

  @Get(REAJUSTE_ROUTES.findById.route)
  @Permissions(REAJUSTE_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.reajusteService.findById(id);
  }

  @Put(REAJUSTE_ROUTES.update.route)
  @Permissions(REAJUSTE_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateReajusteDto,
  ) {
    return await this.reajusteService.update(id, data);
  }

  @Delete(REAJUSTE_ROUTES.delete.route)
  @Permissions(REAJUSTE_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.reajusteService.delete(id);
  }

}
