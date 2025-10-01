import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoImovelController } from './tipoimovel.controller';
import { TipoImovelService } from './tipoimovel.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoImovelController],
  providers: [TipoImovelService],
})
export class TipoImovelModule { }
