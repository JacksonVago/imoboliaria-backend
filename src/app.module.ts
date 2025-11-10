import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CepModule } from './cep/cep.module';
import { EmpresaModule } from './empresas/empresas.module';
import { EnvModule } from './env/env.module';
import { FilesModule } from './files/files.module';
import { ImoveisModule } from './imoveis/imoveis.module';
import { LancamentoModule } from './lancamentos/lancamentos.module';
import { LocacaoModule } from './locacoes/locacoes.module';
import { PagamentoModule } from './pagamentos/pagamentos.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProprietariosModule } from './proprietarios/proprietarios.module';
import { ReajusteModule } from './reajustes/reajustes.module';
import { TipoImovelModule } from './tipoimovel/tipoimovel.module';
import { TipoLancamentoModule } from './tipolancamento/tipolancamento.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    EnvModule,
    PrismaModule,
    UsersModule,
    AuthModule,
    PessoasModule,
    ProprietariosModule,
    ImoveisModule,
    LocacaoModule,
    FilesModule,
    CepModule,
    TipoImovelModule,
    EmpresaModule,
    TipoLancamentoModule,
    LancamentoModule,
    ReajusteModule,
    PagamentoModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
