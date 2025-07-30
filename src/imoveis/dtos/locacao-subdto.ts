import { CreateLocacaoDto } from '@/locatarios/locatarios.controller';
import { Type } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsString,
  Min
} from 'class-validator';

export class DocumentoDto {
  @IsOptional()
  file: any;

  @IsOptional()
  @IsNumber()
  size?: number;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsNumber()
  id?: number;
}

export class FiadorDto {
  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  proprietarioId?: number;

  @IsOptional()
  locacao?: CreateLocacaoDto;

}

export class SeguroFiancaDto {
  @IsString()
  contratoSeguradora: string;
}

export class TituloCapitalizacaoDto {
  @IsString()
  numeroTitulo: string;
}

export class DepositoCalcaoDto {
  @IsNumber()
  @Min(0)
  valorDeposito: number;
}
