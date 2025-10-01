import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { CepModule } from './cep/cep.module';
import { EmpresaModule } from './empresas/empresas.module';
import { EnvModule } from './env/env.module';
import { FilesModule } from './files/files.module';
import { ImoveisModule } from './imoveis/imoveis.module';
import { LocacaoModule } from './locacoes/locacoes.module';
import { PessoasModule } from './pessoas/pessoas.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProprietariosModule } from './proprietarios/proprietarios.module';
import { TipoImovelModule } from './tipoimovel/tipoimovel.module';
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
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
