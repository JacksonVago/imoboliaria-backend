import { Module } from '@nestjs/common';
import { AssinaturaModule } from './assinatura/assinatura.module';
import { AuthModule } from './auth/auth.module';
import { BlocoModule } from './blocos/bloco.module';
import { CepModule } from './cep/cep.module';
import { CondominioModule } from './condominios/condominio.module';
import { EmpresaModule } from './empresas/empresas.module';
import { EnvModule } from './env/env.module';
import { FilesModule } from './files/files.module';
import { ImoveisModule } from './imoveis/imoveis.module';
import { LancamentoModule } from './lancamentos/lancamentos.module';
import { LancamentoCondominioModule } from './lancamentosCondominios/lanctosCondominios.module';
import { LocacaoModule } from './locacoes/locacoes.module';
import { PagamentoModule } from './pagamentos/pagamentos.module';
import { PagSeguroModule } from './pagseguro/pagseguro.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProprietariosModule } from './proprietarios/proprietarios.module';
import { ReajusteModule } from './reajustes/reajustes.module';
import { RepasseModule } from './repasses/repasses.module';
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
    RepasseModule,
    CondominioModule,
    AssinaturaModule,
    PagSeguroModule,
    BlocoModule,
    LancamentoCondominioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
