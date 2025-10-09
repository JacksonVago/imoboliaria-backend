import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { EnderecoDto } from '@/common/interfaces/dtos/endereco.dto';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { EmpresasService } from './empresas.service';

export class CreateEmpresaDto extends EnderecoDto {
  @IsString()
  nome: string;

  @IsString()
  cnpj: string;

  @IsString()
  telefone: string;

  @IsString()
  email: string;

  @IsEnum(PessoaStatus)
  status: PessoaStatus;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  avisosReajusteLocacao: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  avisosRenovacaoContrato: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  avisosSeguroFianca: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  avisosSeguroIncendio: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  avisosTituloCapitalizacao: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  avisosDepositoCalcao: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  porcentagemComissao: number;

  @IsString()
  @IsOptional()
  emiteBoleto: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  valorTaxaBoleto: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @IsOptional()
  emissaoBoletoAntecedencia: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  porcentagemMultaAtraso: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  porcentagemJurosAtraso: number;

}

export const EMPRESA_ROUTES = {
  CREATE: '/',
  GET: '/:id',
  UPDATE: '/:id',
};

export enum EMPRESA_PERMISSIONS {
  CREATE,
  EDIT
}

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

@Controller('empresas')
export class EmpresasController {
  constructor(private readonly EmpresasService: EmpresasService) { }

  @Post(EMPRESA_ROUTES.CREATE)
  @Roles(Role.ADMIN)
  @FormDataRequest()
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.EmpresasService.createUser(createEmpresaDto);
  }

  @Put(EMPRESA_ROUTES.UPDATE)
  @Roles(Role.ADMIN)
  @FormDataRequest()
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateEmpresaDto,
  ) {
    return this.EmpresasService.update(Number(id), data);
  }


  @Get(EMPRESA_ROUTES.GET)
  @Roles(Role.ADMIN)
  async get(@Param() { id }: BaseParamsByStringIdDto,) {
    return await this.EmpresasService.get(Number(id));
  }


}
