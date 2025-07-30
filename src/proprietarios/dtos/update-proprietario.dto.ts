import { PartialType } from '@nestjs/mapped-types';
import { Transform } from 'class-transformer';
import { CreateProprietarioDto } from './create-proprietario.dto';

export class UpdateProprietarioDto extends PartialType(CreateProprietarioDto) {
  desvincularImoveisIds?: number[];

  @Transform(({ value }) => {
    return value.map(Number);
  })
  documentosToDeleteIds?: number[];
}
