import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ImoveisController } from './imoveis.controller';
import { ImoveisService } from './imoveis.service';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [PrismaModule, FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile })

  ],
  controllers: [ImoveisController],
  providers: [ImoveisService],
})
export class ImoveisModule {}
