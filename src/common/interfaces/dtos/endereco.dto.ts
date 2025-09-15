import { IsOptional, IsString, Matches } from 'class-validator';

export class EnderecoDto {
  @IsString()
  logradouro: string;

  @IsString()
  numero: string;

  @IsString()
  @IsOptional()
  complemento?: string;

  @IsString()
  bairro: string;

  @IsString()
  cidade: string;

  @IsString()
  @Matches(/^\d{5}-\d{3}$/)
  cep: string;

  @IsString()
  estado: string;
}
