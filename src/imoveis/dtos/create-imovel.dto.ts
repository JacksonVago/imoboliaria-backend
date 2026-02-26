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
  @IsOptional()
  finalidade: ImovelFinalidade = ImovelFinalidade.AMBOS;

  @Type(() => Number)
  @IsNumber()
  porcentagemLucroImobiliaria: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  valorAluguel?: number;

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  metragem?: number; //Metragem do imóvel

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  quartos?: number; //Número de quartos

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  banheiros?: number; //Número de banheiros

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  vagasEstacionamento?: number; //Número de vagas de estacionamento

  @Type(() => Number)
  @IsNumber()
  @IsOptional()
  andar?: number; //Andar do imóvel (se for apartamento)

  @IsOptional()
  @IsArray()
  proprietarios?: Proprietario[]

  @IsOptional()
  @IsArray()
  locacoes?: Locacao[]

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

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  condominioId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  blocoId: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  empresaId: number;

}
