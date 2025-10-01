import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { Body, Controller, Delete, Get, Param, Patch, Post, Put } from '@nestjs/common';
import { IsString } from 'class-validator';
import { TipoImovelService } from './tipoimovel.service';

export class CreateTipoDto {
  @IsString()
  name: string;
}

export const TIPO_ROUTES = {
  CREATE: '/',
  GET_TIPO: '/',
  UPDATE_TIPO: '/:id',
  DELETE_TIPO: '/:id',
  PATCH_ATIVA: '/statusAtiva/:id',
  PATCH_DESATIVA: '/statusDesativa/:id',
};

export enum USER_PERMISSIONS {
  CREATE_TIPO,
  EDIT_TIPO,
  DELETE_TIPO,
}

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;


}

@Controller('tipoimovel')
export class TipoImovelController {
  constructor(private readonly TipoImovelService: TipoImovelService) { }

  @Post(TIPO_ROUTES.CREATE)
  @Roles(Role.ADMIN)
  create(@Body() createTipoDto: CreateTipoDto) {
    return this.TipoImovelService.createUser(createTipoDto);
  }

  @Put(TIPO_ROUTES.UPDATE_TIPO)
  @Roles(Role.ADMIN)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateTipoDto,
  ) {
    return this.TipoImovelService.updateTipo(Number(id), data);
  }


  @Delete(TIPO_ROUTES.DELETE_TIPO)
  @Roles(Role.ADMIN)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoImovelService.deleteTipo(Number(id));
  }

  @Get(TIPO_ROUTES.GET_TIPO)
  @Roles(Role.ADMIN)
  async getTipo() {
    return await this.TipoImovelService.getTipos();
  }

  @Patch(TIPO_ROUTES.PATCH_ATIVA)
  @Roles(Role.ADMIN)
  async ativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoImovelService.ativaTipo(Number(id));
  }

  @Patch(TIPO_ROUTES.PATCH_DESATIVA)
  @Roles(Role.ADMIN)
  async desativaTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.TipoImovelService.desativaTipo(Number(id));
  }

}
