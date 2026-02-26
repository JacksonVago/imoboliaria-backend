import { FilesModule } from '@/files/files.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { RepasseController } from './repasses.controller';
import { RepassesService } from './repasses.service';

@Module({
  imports: [
    PrismaModule,
    FilesModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [RepasseController],
  providers: [RepassesService],
})
export class RepasseModule { }
