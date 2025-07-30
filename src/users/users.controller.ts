import { CurrentUser } from '@/auth/decorators/current-user.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { UserPayload } from '@/auth/estrategies/jwt.strategy';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { IsArray, IsEnum, IsString, IsStrongPassword } from 'class-validator';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  email?: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @IsEnum(Permission, { each: true })
  permissions: Permission[];
}

export class CreateAdminUserDto {
  @IsString()
  name: string;

  @IsString()
  email?: string;

  @IsStrongPassword()
  password: string;
}

export const USER_ROUTES = {
  CREATE: '/',
  INFO: '/info',
  REGISTER_ADMIN: '/register-admin',
  GET_COLLABORATORS: '/collaborators',
  UPDATE_USER: '/:id',
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

@Controller('users')
export class UsersController {
  constructor(private readonly UsersService: UsersService) {}

  @Post(USER_ROUTES.CREATE)
  @Roles(Role.ADMIN)
  create(@Body() createUserDto: CreateUserDto) {
    return this.UsersService.createUser(createUserDto);
  }

  @Put(USER_ROUTES.UPDATE_USER)
  @Roles(Role.ADMIN)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: UpdateUserDto,
  ) {
    return this.UsersService.updateUser(id, data);
  }

  @Get(USER_ROUTES.INFO)
  @Roles(Role.COLLABORATOR)
  getData(@CurrentUser() user: UserPayload) {
    return this.UsersService.getUsers({
      userId: user.id,
    });
  }

  @Get(USER_ROUTES.INFO)
  async getMe(@CurrentUser() user: UserPayload) {
    //Get my user data and permissions
    return await this.UsersService.getUsers({
      userId: user.id,
    });
  }

  @Post(USER_ROUTES.REGISTER_ADMIN)
  @Roles(Role.PUBLIC)
  async registerAdmin(@Body() createUserDto: CreateAdminUserDto) {
    //Only the first user can create an admin user
    return await this.UsersService.createAdminUser(
      createUserDto.name,
      createUserDto.email,
      createUserDto.password,
    );
  }

  @Get(USER_ROUTES.GET_COLLABORATORS)
  @Roles(Role.ADMIN)
  async getCollaborators() {
    //Get all collaborators
    return await this.UsersService.getCollaborators();
  }

  @Delete(USER_ROUTES.DELETE_USER)
  @Roles(Role.ADMIN)
  async deleteUser(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.UsersService.deleteUser(id);
  }
}
