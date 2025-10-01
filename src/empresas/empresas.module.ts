import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { EmpresasController } from './empresas.controller';
import { EmpresasService } from './empresas.service';

@Module({
  imports: [PrismaModule],
  controllers: [EmpresasController],
  providers: [EmpresasService],
})
export class EmpresaModule { }
