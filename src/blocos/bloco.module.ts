import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { BlocoController } from './bloco.controller';
import { BlocoService } from './bloco.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [BlocoController],
  providers: [BlocoService],
})
export class BlocoModule { }
