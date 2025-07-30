import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNumber,
} from 'class-validator';

export class CreateProprietarioDto {
  @Transform(({ value }) => Number(value))
  @IsInt()
  pessoaId?: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  cota_imovel: number;

  @Transform(({ value }) => Number(value))
  @IsInt()
  imovelId?: number;

  /*  @IsArray()
    @IsOptional()
    @Transform(({ value }) => value.map(Number))
    vincularImoveisIds?: number[];*/

}
