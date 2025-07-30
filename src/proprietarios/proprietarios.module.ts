import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { ProprietariosController } from './proprietarios.controller';
import { ProprietariosService } from './proprietarios.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [ProprietariosController],
  providers: [ProprietariosService],
})
export class ProprietariosModule {}
