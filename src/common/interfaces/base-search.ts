import { ImovelStatus } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

//IMPROVE: create a base class for pagination
export const DEFAULT_PAGE_SIZE = 10;

//IMPROVE: create a base class for pagination
export class BaseGetPaginatedQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  tipo?: number | null;

  @IsOptional()
  exclude?: string;
}

export class BaseGetPessoaQueryDto {
  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  page?: number;

  @IsOptional()
  @Transform(({ value }) => parseInt(value, DEFAULT_PAGE_SIZE))
  limit?: number;

  @IsOptional()
  search?: string;

  @IsOptional()
  exclude?: string;
}

export class BaseParamsByIdDto {
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  id: number;
}

export class BaseParamsByStatus {
  imovelStatus: ImovelStatus;
}

