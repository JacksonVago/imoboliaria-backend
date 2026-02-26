import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AssinaturaController } from './assinatura.controller';
import { AssinaturaService } from './assinatura.service';

@Module({
  imports: [PrismaModule],
  controllers: [AssinaturaController],
  providers: [AssinaturaService],
})
export class AssinaturaModule { }
