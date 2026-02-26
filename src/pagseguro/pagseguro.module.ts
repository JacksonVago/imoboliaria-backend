import { EnvModule } from '@/env/env.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { PagSeguroController } from './pagseguro.controller';
import { PagSeguroService } from './pagseguro.service';

@Module({
  imports: [PrismaModule,
    HttpModule,
    EnvModule,
    NestjsFormDataModule
  ],
  controllers: [PagSeguroController],
  providers: [PagSeguroService],
})
export class PagSeguroModule { }
