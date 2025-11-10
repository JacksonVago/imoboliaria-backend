import { PrismaModule } from '@/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { TipoLancamentoController } from './tipolancamento.controller';
import { TipoLancamentoService } from './tipolancamento.service';

@Module({
  imports: [PrismaModule],
  controllers: [TipoLancamentoController],
  providers: [TipoLancamentoService],
})
export class TipoLancamentoModule { }
