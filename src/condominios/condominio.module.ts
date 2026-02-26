import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { CondominioController } from './condominio.controller';
import { CondominioService } from './condominio.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [CondominioController],
  providers: [CondominioService],
})
export class CondominioModule { }
