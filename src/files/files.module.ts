import { EnvModule } from '@/env/env.module';
import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    EnvModule,
    NestjsFormDataModule.config({ storage: MemoryStoredFile }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
