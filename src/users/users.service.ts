import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { hash } from 'bcryptjs';
import { UpdateUserDto } from './dtos/update-user.dto';
import { CreateUserDto } from './users.controller';

@Injectable()
export class UsersService {
  constructor(private PrismaService: PrismaService) { }
  async createUser(createUserDto: CreateUserDto) {
    const { login, name, email, permissions } = createUserDto;
    const checkIfUserExists = await this.PrismaService.user.findUnique({
      where: {
        login: email,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException(' user already exists');
    }

    const hashedPasword = await hash(createUserDto.password, 10);

    return await this.PrismaService.user.create({
      data: {
        login: login,
        name: name,
        email: email,
        password: hashedPasword,
        permissions: permissions,
      },
    });
  }

  async updateUser(id: string, { name, email, permissions }: UpdateUserDto) {
    return await this.PrismaService.user.update({
      where: {
        id,
      },
      data: {
        name,
        email,
        permissions,
      },
    });
  }

  async getUsers({ userId }: { userId: string }) {
    return await this.PrismaService.user.findFirst({
      where: {
        id: userId,
      },
    });
  }

  async createAdminUser(login: string, name: string, email: string, password: string) {
    const checkAdminExists = await this.PrismaService.user.findFirst({
      where: {
        role: UserRole.ADMIN,
      },
    });

    if (checkAdminExists) {
      throw new ConflictException('admin user already exists');
    }

    const checkIfUserExists = await this.PrismaService.user.findUnique({
      where: {
        login: login,
      },
    });

    if (checkIfUserExists) {
      throw new ConflictException('user already exists');
    }

    const hashedPasword = await hash(password, 10);

    const result = await this.PrismaService.user.create({
      data: {
        login,
        name,
        email,
        password: hashedPasword,
        role: UserRole.ADMIN,
        permissions: ['ALL'],
      },
    });

    return {
      password: undefined,
      ...result,
    };
  }

  //get all users
  async getCollaborators() {
    return await this.PrismaService.user.findMany({
      where: {
        role: UserRole.COLLABORATOR,
      },
    });
  }

  async deleteUser(id: string) {
    return await this.PrismaService.user.delete({
      where: {
        id,
      },
    });
  }
}
