import { PrismaService } from '@/prisma/prisma.service';
import { ConflictException, Injectable } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { compare, hash } from 'bcryptjs';
import { CreateUserDto } from './dtos/users.dto';

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

  async updateUser(id: string, { name, email, permissions }: CreateUserDto) {
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

  async updatePwd(id: string, data: { login: string; password: string; newpassword: string }) {
    const hashedPasword = await hash(data.password, 10);
    const hashedNewPasword = await hash(data.newpassword, 10);

    const user = await this.PrismaService.user.findUnique({
      where: {
        id,
      },
    });

    if (!user) {
      throw new ConflictException('Usuário não existe');
    }

    const isPasswordValid = await compare(data.password, user.password);

    if (!isPasswordValid) {
      throw new ConflictException('Senha anterior incorreta.');
    }

    if (data.login !== user.login) {
      throw new ConflictException('Login inválido.');
    }

    return await this.PrismaService.user.update({
      where: {
        id,
      },
      data: {
        password: hashedNewPasword,
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

  async getUserbyLogin(login: string) {
    return await this.PrismaService.user.findFirst({
      where: {
        login: login,
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
