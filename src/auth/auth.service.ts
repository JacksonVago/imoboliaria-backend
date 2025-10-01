// auth.service.ts
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { UserPayload } from './estrategies/jwt.strategy';

//IMPROVE: create errors enum with all possible errors messages for consistency

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private prismaService: PrismaService,
  ) { }

  async validateUser(login: string, password: string): Promise<any> {
    const user = await this.prismaService.user.findUnique({
      where: {
        login,
      },
    });

    if (user && user.password === password) {
      const { password, ...result } = user; //remove password from user object
      return result;
    }

    return null;
  }

  // async login(user: any) {
  //   const payload = { email: user.email, sub: user.id, roles: user.role };
  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  async authenticateUser(login: string, password: string) {
    const user = await this.prismaService.user.findUnique({
      where: {
        login,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: UserPayload = { id: user.id, role: user.role };

    const accessToken = this.jwtService.sign(payload);

    return accessToken;
  }
}
