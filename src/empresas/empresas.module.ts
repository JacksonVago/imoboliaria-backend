import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';

@Module({
  imports: [PrismaModule, NestjsFormDataModule],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresaModule { }
