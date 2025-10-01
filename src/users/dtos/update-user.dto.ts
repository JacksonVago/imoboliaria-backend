import { Permission } from '@prisma/client';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsString()
  login: string;

  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  email?: string;

  @IsStrongPassword()
  @IsString()
  password: string;

  @IsArray()
  @IsEnum(Permission, { each: true })
  @IsOptional()
  permissions: Permission[];
}
