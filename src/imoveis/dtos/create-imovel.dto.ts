import { EnderecoDto } from '@/common/interfaces/dtos/endereco.dto';
import { ImovelFinalidade, ImovelStatus, Locacao, Proprietario } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class CreateImovelDto extends EnderecoDto {
  @IsEnum(ImovelStatus)
  status: ImovelStatus;

  @Type(() => String)
  @IsString()
  @IsOptional()
  description?: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  tipoId: number;

  @IsEnum(ImovelFinalidade)
  finalidade: ImovelFinalidade = ImovelFinalidade.AMBOS;

  @Type(() => Number)
  @IsNumber()
  porcentagem_lucro_imobiliaria: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valor_iptu?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valor_condominio?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valor_aluguel?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valor_venda?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valor_agua?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valor_taxa_lixo?: number;

  @IsOptional()
  @IsArray()
  proprietario?: Proprietario[]

  @IsOptional()
  @IsArray()
  locacao?: Locacao[]

  @IsOptional()
  @IsFiles()
  //Limiting to 50 for supabase free tier limit
  @MaxFileSize(50 * 1024 * 1024, { each: true })
  @HasMimeType(
    [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'image/gif',
      'image/svg+xml',
      'image/webp',
    ],
    { each: true },
  )
  images?: MemoryStoredFile[];

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
