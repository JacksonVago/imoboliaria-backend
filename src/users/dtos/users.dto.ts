import { Permission } from "@prisma/client";
import { IsArray, IsEnum, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class CreateUserDto {
    @IsString()
    login: string;

    @IsString()
    name: string;

    @IsString()
    @IsOptional()
    email?: string;

    @IsStrongPassword()
    password: string;

    @IsArray()
    @IsOptional()
    @IsEnum(Permission, { each: true })
    permissions: Permission[];
}

export class CreateAdminUserDto {
    @IsString()
    login: string;

    @IsString()
    name: string;

    @IsString()
    email?: string;

    @IsStrongPassword()
    password: string;
}

/*export class UpdateUserDto {
  @IsString()
  login: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsStrongPassword()
  password: string;

  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions: Permission[];
}
 */