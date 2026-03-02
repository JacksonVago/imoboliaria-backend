import { Permissions } from '@/auth/decorators/permissions.decorator';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { BaseParamsByIdDto, BaseParamsIdEmpresaDto, DEFAULT_PAGE_SIZE } from '@/common/interfaces/base-search';
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
import { lancamentoStatus, LancamentoTipo, LocacaoStatus, Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import {
  IsDate,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString
} from 'class-validator';
import {
  FormDataRequest
} from 'nestjs-form-data';
import { LanctosCondominiosService } from './lanctosCondominios.service';

export class LanctoCondominioDto {
  id: number;
  lancamentotipo: LancamentoTipo;
  parcela: number;
  tipoId: number;
  valorLancamento: number;
  dataLancamento: Date;
  vencimentoLancamento: Date;
  observacao: string;
  status: lancamentoStatus;
  blocoId: number;
}

export class gerarBoletoDto {
  id: number;
  dataInicio: Date;
  dataFim: Date;
  valorAluguel: number;
  status: LocacaoStatus;
  imovelId: number;
  diaVencimento: number;
  lancamentos: LanctoCondominioDto[];
}

export class CreateLanctoCondominioDto {

  @Transform(({ value }) => Number(value))
  @IsInt()
  parcela: number

  @Transform(({ value }) => Number(value))
  @IsInt()
  tipoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorLancamento: number;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataLancamento: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  vencimentoLancamento: Date;

  @IsOptional()
  @IsString()
  linhaDigitavel: string; //Linha digitável do boleto gerado para esse lançamento

  //start garantia locacao data fields
  @IsOptional()
  @IsString()
  observacao: string;

  @IsOptional()
  @IsString()
  rateia: string;

  @IsOptional()
  @IsEnum(lancamentoStatus)
  status: lancamentoStatus;

  @Transform(({ value }) => Number(value))
  @IsInt()
  blocoId: number;

}

export class GetLancamentosQueryDto {
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

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataInicial: Date;

  @Transform(({ value }) => new Date(value))
  @IsDate()
  dataFinal: Date;

}

export const LANCAMENTO_ROUTES: BaseRoutes = {
  create: {
    name: 'create Lancamento condominio',
    route: '/',
    permission: Permission.CREATE_LOCACAO_LANCAMENTO,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.VIEW_LOCACAO_LANCAMENTOS,
  },
  update: {
    name: 'update Lancamento condominio',
    route: ':id',
    permission: Permission.UPDATE_LOCACAO_LANCAMENTO,
  },
  delete: {
    name: 'delete Lancamento condominio',
    route: ':id',
    permission: Permission.DELETE_LOCACAO_LANCAMENTO,
  },
  search: {
    name: 'Search Lancamentos condominio',
    route: '/:empresaId',
    permission: Permission.VIEW_LOCACAO_LANCAMENTOS,
  },
  statusLancamento: {
    name: 'Status Lancamento condominio',
    route: 'statuslancamento/:id',
    permission: Permission.UPDATE_LOCACAO_LANCAMENTO,
  },
  gerarBoleto: {
    name: 'Gerar Boleto condominio',
    route: 'gerar-boleto/',
    permission: Permission.CREATE_PAGAMENTO,
  },
};

@Controller('lancamentosCondominios')
export class LanctoCondominioController {
  constructor(private readonly lanctoCondominioService: LanctosCondominiosService) { }

  @Post(LANCAMENTO_ROUTES.create.route)
  @Permissions(LANCAMENTO_ROUTES.create.permission)
  @FormDataRequest()
  createPagamento(@Body() createLanctoCondominioDto: CreateLanctoCondominioDto) {

    return this.lanctoCondominioService.create(createLanctoCondominioDto);
  }

  @Get(LANCAMENTO_ROUTES.search.route)
  @Permissions(LANCAMENTO_ROUTES.search.permission)
  async search(@Param() { empresaId }: BaseParamsIdEmpresaDto, @Query() data: GetLancamentosQueryDto) {
    const { search, page, limit, status, exclude, dataInicial, dataFinal } = data;
    const response = await this.lanctoCondominioService.findManyCondominio(Number(empresaId), search, page, limit, status, exclude, dataInicial, dataFinal);
    return response;
  }

  @Get(LANCAMENTO_ROUTES.findById.route)
  @Permissions(LANCAMENTO_ROUTES.findById.permission)
  async findById(@Param() { id }: BaseParamsByIdDto) {
    return await this.lanctoCondominioService.findById(id);
  }

  @Put(LANCAMENTO_ROUTES.update.route)
  @Permissions(LANCAMENTO_ROUTES.update.permission)
  @FormDataRequest()
  async update(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLanctoCondominioDto,
  ) {
    return await this.lanctoCondominioService.update(id, data);
  }

  @Put(LANCAMENTO_ROUTES.statusLancamento.route)
  @Permissions(LANCAMENTO_ROUTES.statusLancamento.permission)
  async statusLancamento(
    @Param() { id }: BaseParamsByIdDto,
    @Body() data: CreateLanctoCondominioDto) {
    return this.lanctoCondominioService.updateStatus(id, data);
  }

  @Delete(LANCAMENTO_ROUTES.delete.route)
  @Permissions(LANCAMENTO_ROUTES.delete.permission)
  async delete(@Param() { id }: BaseParamsByIdDto) {
    return this.lanctoCondominioService.delete(id);
  }

}
