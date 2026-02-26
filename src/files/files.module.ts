import { EnvModule } from '@/env/env.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { FilesAzureService } from './azurefiles.service';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    EnvModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [FilesController],
  providers: [FilesService, FilesAzureService],
  exports: [FilesService, FilesAzureService],
})
export class FilesModule { }
