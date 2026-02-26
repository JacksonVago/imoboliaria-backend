import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { UserPayload } from '@/auth/estrategies/jwt.strategy';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { IsString } from 'class-validator';
import { CreateUserDto } from './dtos/users.dto';
import { UsersService } from './users.service';

export const USER_ROUTES = {
  CREATE: '/',
  INFO: '/info',
  REGISTER_ADMIN: '/register-admin',
  GET_COLLABORATORS: '/collaborators',
  GET_USER_LOGIN: '/:login',
  UPDATE_USER: '/:id',
  UPDATE_PWD: '/updatepwd/:id',
  DELETE_USER: '/:id',
};

export enum USER_PERMISSIONS {
  CREATE_USER,
  EDIT_USER,
  DELETE_USER,
}

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;
}

export class BaseParamsByStringLoginDto {
  @IsString()
  login: string;
}

export class ParamsByStringPwdDto {
  @IsString()
  login: string;

  @IsString()
  password: string;

  @IsString()
  newpassword: string;
}

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) { }

  @Post(USER_ROUTES.CREATE)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.UsersService.createUser(createUserDto);
  }

  @Put(USER_ROUTES.UPDATE_USER)
  @Roles(Role.ADMIN)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateUserDto,
  ) {
    return this.UsersService.updateUser(id, data);
  }

  @Put(USER_ROUTES.UPDATE_PWD)
  @Roles(Role.PUBLIC)
  updatePwd(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: ParamsByStringPwdDto,
  ) {
    return this.UsersService.updatePwd(id, data);
  }

  @Get(USER_ROUTES.INFO)
  async getMe(@CurrentUser() user: UserPayload) {
    //Get my user data and permissions
    return await this.UsersService.getUsers({
      userId: user.id,
    });
  }

  /*@Post(USER_ROUTES.REGISTER_ADMIN)
  @Roles(Role.PUBLIC)
  async registerAdmin(@Body() createUserDto: CreateAdminUserDto) {
    //Only the first user can create an admin user
    return await this.UsersService.createAdminUser(
      createUserDto.login,
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
  }*/

  @Get(USER_ROUTES.GET_COLLABORATORS)
  @Roles(Role.ADMIN)
  async getCollaborators() {
    //Get all collaborators
    console.log('antes');
    const collaborators = await this.UsersService.getCollaborators();
    console.log('collaborators', collaborators);
    return collaborators
  }

  @Delete(USER_ROUTES.DELETE_USER)
  @Roles(Role.ADMIN)
  async deleteUser(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.UsersService.deleteUser(id);
  }

  @Get(USER_ROUTES.GET_USER_LOGIN)
  @Roles(Role.PUBLIC)
  async getUserByLogin(@Param() { login }: BaseParamsByStringLoginDto) {
    return await this.UsersService.getUserbyLogin(login);
  }

}
