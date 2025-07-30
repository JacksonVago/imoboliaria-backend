import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { UserPayload } from '@/auth/estrategies/jwt.strategy';
import { Controller, Get, Param } from '@nestjs/common';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';
import { CepService } from './cep.service';
export class GetCepParamsDto {
  
  @Transform(({ value }) => value.replace(/\D/g, '').toString())
  cep: string;
}
@Controller('cep')
export class CepController {
  constructor(private readonly cepService: CepService) {}

  @Get(':cep')
  async getCep(
    @CurrentUser() user: UserPayload,
    @Param() { cep }: GetCepParamsDto,
  ) {
    //Get my user data and permissions
    return await this.cepService.getCep(cep);
  }
}
