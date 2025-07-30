import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { IsArray, IsJSON, IsNumber, IsOptional } from 'class-validator';
import { CreateImovelDto } from './create-imovel.dto';

export class UpdateImovelDto extends PartialType(CreateImovelDto) {
  @IsNumber()
  @IsOptional()
  @IsJSON()
  @Transform(({ value }) => JSON.parse(value))
  imagesToDeleteIds?: number[];

  @IsOptional()
  /*@IsJSON()
  @Transform(({ value }) => JSON.parse(value))*/
  @IsArray()
  @Transform(({ value }) => {
    return value.map(Number);
  })
  docsToDeleteIds?: number[];
}
