import { EnvModule } from '@/env/env.module';
import { EnvService } from '@/env/env.service';
import { PrismaService } from '@/prisma/prisma.service';
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthenticateUserController } from './controllers/authenticate-user.controller';
import { JwtStrategy } from './estrategies/jwt.strategy';
import { RolesGuard } from './guards/roles.guard';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [EnvModule],
      inject: [EnvService],
      global: true,
      useFactory: (env: EnvService) => {
        const privateKey = env.get('JWT_PRIVATE_KEY');
        const publicKey = env.get('JWT_PUBLIC_KEY');

        return {
          signOptions: {
            expiresIn: '1d',
            algorithm: 'RS256',
          },
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
        };
      },
    }),
  ],
  controllers: [AuthenticateUserController],
  providers: [
    AuthService,
    PrismaService,
    JwtStrategy,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    EnvService,
  ],
})
export class AuthModule {}
