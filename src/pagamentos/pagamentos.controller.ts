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
import { PartialType } from '@nestjs/mapped-types';
import { BoletoStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsNumber,
  IsOptional
} from 'class-validator';
import {
  FormDataRequest,
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile
} from 'nestjs-form-data';
import { PagamentosService } from './pagamentos.service';

export class CreateBoletoDto {

  @Transform(({ value }) => Number(value))
  @IsNumber()
  locacaoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  locatarioId: number;

  @IsOptional()
  @IsEnum(BoletoStatus)
  status: BoletoStatus;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataEmissao: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataVencimento: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  @IsOptional()
  dataPagamento: Date;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorOriginal: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorPago: number;

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
}

export class UpdateBoletoDto extends PartialType(CreateBoletoDto) {
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
  //documentosToDeleteIds?: { id: number, file: string }[];
}

export class GetBoletosQueryDto {
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
  create: {
    name: 'create Pagamento',
    route: '/',
    permission: Permission.CREATE_PAGAMENTO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_PAGAMENTOS,
  },
  update: {
    name: 'update Pagamento',
    route: ':id',
    permission: Permission.UPDATE_PAGAMENTO,
  },
  delete: {
    name: 'delete Pagamento',
    route: ':id',
    permission: Permission.DELETE_PAGAMENTO,
  },
  search: {
    name: 'Search Pagamentos',
    route: '/',
    permission: Permission.VIEW_PAGAMENTOS,
  },
  statusPagamento: {
    name: 'Status Pagamento',
    route: 'statusPagamento/:id',
    permission: Permission.UPDATE_PAGAMENTO,
  },
};

@Controller('pagamentos')
export class PagamentoController {
  constructor(private readonly PagamentoService: PagamentosService) { }

  @Post(PAGAMENTO_ROUTES.create.route)
  @Permissions(PAGAMENTO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createBoletoDto: CreateBoletoDto) {

    return this.PagamentoService.create(createBoletoDto);
  }

  /*  @Get(PAGAMENTO_ROUTES.search.route)
  @Permissions(PAGAMENTO_ROUTES.search.permission)
  async search(@Query() data: GetPagamentosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.PagamentoService.findMany(search, page, limit, status, exclude);
    return response;
  }
 */

  @Get(PAGAMENTO_ROUTES.search.route)
  @Permissions(PAGAMENTO_ROUTES.search.permission)
  async search(@Query() data: GetBoletosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.PagamentoService.findManyPagamento(search, page, limit, status, exclude, dataInicial, dataFinal);
    return response;
  }

  @Get(PAGAMENTO_ROUTES.findById.route)
  @Permissions(PAGAMENTO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.PagamentoService.findById(id);
  }

  @Put(PAGAMENTO_ROUTES.update.route)
  @Permissions(PAGAMENTO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: UpdateBoletoDto,
  ) {
    return await this.PagamentoService.update(id, data);
  }

  @Put(PAGAMENTO_ROUTES.statusPagamento.route)
  @Permissions(PAGAMENTO_ROUTES.statusPagamento.permission)
  async statusPagamento(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateBoletoDto) {
    return this.PagamentoService.updateStatus(id, data);
  }

  @Delete(PAGAMENTO_ROUTES.delete.route)
  @Permissions(PAGAMENTO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.PagamentoService.delete(id);
  }

}
