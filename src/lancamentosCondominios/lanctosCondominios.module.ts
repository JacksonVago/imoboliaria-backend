import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { LanctoCondominioController } from './lanctosCondominios.controller';
import { LanctosCondominiosService } from './lanctosCondominios.service';

@Module({
  imports: [
    PrismaModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [LanctoCondominioController],
  providers: [LanctosCondominiosService],
})
export class LancamentoCondominioModule { }
