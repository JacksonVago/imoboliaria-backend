import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { EnderecoDto } from '@/common/interfaces/dtos/endereco.dto';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString } from 'class-validator';
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

  @IsString()
  endereco: string;

  @IsString()
  cidade: string;

  @IsString()
  estado: string;

  @IsString()
  cep: string;

  @IsEnum(PessoaStatus)
  status: PessoaStatus;

  @IsInt()
  @IsOptional()
  avisosReajusteLocacao: number;

  @IsInt()
  @IsOptional()
  avisosRenovacaoContrato: number;

  @IsInt()
  @IsOptional()
  avisosSeguroFianca: number;

  @IsInt()
  @IsOptional()
  avisosSeguroIncendio: number;

  @IsInt()
  @IsOptional()
  avisosTituloCapitalizacao: number;

  @IsInt()
  @IsOptional()
  avisosDepositoCalcao: number;

  @IsNumber()
  @IsOptional()
  porcentagemComissao: number;

  @IsString()
  @IsOptional()
  emiteBoleto: string;

  @IsNumber()
  @IsOptional()
  valorTaxaBoleto: number;

  @IsInt()
  @IsOptional()
  emissaoBoletoAntecedencia: number;

  @IsNumber()
  @IsOptional()
  porcentagemMultaAtraso: number;

  @IsNumber()
  @IsOptional()
  porcentagemJurosAtraso: number;

}

export const EMPRESA_ROUTES = {
  CREATE: '/',
  GET: '/',
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
  create(@Body() createEmpresaDto: CreateEmpresaDto) {
    return this.EmpresasService.createUser(createEmpresaDto);
  }

  @Put(EMPRESA_ROUTES.UPDATE)
  @Roles(Role.ADMIN)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateEmpresaDto,
  ) {
    return this.EmpresasService.update(Number(id), data);
  }


  @Get(EMPRESA_ROUTES.GET)
  @Roles(Role.ADMIN)
  async getTipo() {
    return await this.EmpresasService.get();
  }


}
