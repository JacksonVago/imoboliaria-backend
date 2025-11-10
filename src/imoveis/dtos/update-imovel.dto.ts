import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';
import { CreateImovelDto } from './create-imovel.dto';

export class UpdateImovelDto extends PartialType(CreateImovelDto) {
  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  imagesToDeleteIds?: number[];

  @IsOptional()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}
