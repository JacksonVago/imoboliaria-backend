import { Permissions } from '@/auth/decorators/permissions.decorator';
import { Roles } from '@/auth/decorators/roles.decorator';
import { Role } from '@/auth/enums/roles.enum';
import { BaseRoutes } from '@/common/interfaces/base-routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Permission } from '@prisma/client';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { FormDataRequest } from 'nestjs-form-data';
import { PagSeguroService } from './pagseguro.service';

export class CreateOrderDto {


  @IsString()
  nome: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  cpf: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  numeroCartao: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  expMes: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  expAno: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  codigoSeguranca: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  valorPagamento: number;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  parcela: number;

  @IsString()
  observacao: string;

  @IsString()
  encryptedCard: string;

  @IsString()
  plano: string;

  @IsString()
  frequencia: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  assinaturaId: number;

  @IsString()
  metodoPagamento: string;

  @IsString()
  empresa_pagamento: string;

  @IsString()
  email: string;

  @Transform(({ value }) => Number(value))
  @IsNumber()
  @IsOptional()
  empresaId: number;

}

export const TIPO_ROUTES: BaseRoutes = {
  create: {
    name: 'create order',
    route: '/',
    permission: Permission.PAGSEGURO_CREATE_ORDER,
  },
  findById: {
    name: 'findById',
    route: ':id',
    permission: Permission.PAGSEGURO_VIEW_ORDERS,
  },
  update: {
    name: 'update Order',
    route: ':id',
    permission: Permission.PAGSEGURO_UPDATE_ORDER,
  },
  findMany: {
    name: 'findMany',
    route: '/',
    permission: Permission.PAGSEGURO_VIEW_ORDERS,
  },
  delete: {
    name: 'delete Order',
    route: ':id',
    permission: Permission.PAGSEGURO_DELETE_ORDER,
  },

};

export class BaseParamsByStringIdDto {
  @IsString()
  id: string;


}

@Roles(Role.PUBLIC)
@Controller('pagseguro')
export class PagSeguroController {
  constructor(
    private readonly pagseguroService: PagSeguroService,

  ) { }

  @Post(TIPO_ROUTES.create.route)
  //@Permissions(TIPO_ROUTES.create.permission)
  @FormDataRequest()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.pagseguroService.createOrder(createOrderDto);
  }

  @Put(TIPO_ROUTES.update.route)
  @Permissions(TIPO_ROUTES.update.permission)
  update(
    @Param() { id }: BaseParamsByStringIdDto,
    @Body() data: CreateOrderDto,
  ) {
    return this.pagseguroService.updateOrder(Number(id), data);
  }


  @Delete(TIPO_ROUTES.delete.route)
  @Permissions(TIPO_ROUTES.delete.permission)
  async deleteTipo(@Param() { id }: BaseParamsByStringIdDto) {
    return await this.pagseguroService.deleteOrder(Number(id));
  }

  @Get(TIPO_ROUTES.findMany.route)
  @Permissions(TIPO_ROUTES.findMany.permission)
  async getTipo() {
    return await this.pagseguroService.getOrders();
  }

  /*private async createOrder(
    data: CreateOrderDto,
  ): Promise<AxiosResponse<PagamentoAssinatura>> {

    const pagamentoData = {
      reference_id: 'pagamento-001',
      costumer: {
        name: data.nome,
        tax_id: data.cpf,
      },
      items: [
        {
          name: `Assinatura Plano ${data.plano}`,
          quantity: 1,
          unit_amount: 18000
        }
      ],
      //qr_codes : []
      //notification_urls: ['https://meusite.com/notificacoes'],
      charges: [
        {
          reference_id: 'charge-001',
          description: `Pagamento Plano ${data.plano}`,
          amount: {
            value: 18000,
            currency: 'BRL'
          },
          payment_method: {
            type: 'CREDIT_CARD',
            installments: 1,
            capture: true,
            soft_description: 'ADM Imóveis',
            card: {
              encrypted: data.encryptedCard,
              store: true,
            }
          }

        }

      ]
    }

    const responseOrder = await this.httpService.axiosRef.post<pagseguroOrderResponse>('https://sandbox.api.pagseguro.com/orders', data, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${this.envService.get('PAGSEGURO_TOKEN')}`
      }
    });

    console.log('responseOrder', responseOrder.data);    
    return responseOrder;

    return this.pagseguroService.createOrder(data);
  }*/

}

export interface pagseguroOrderResponse {
  id: string;
  reference_id: string;
  created_at: Date;
  customer: {
    name: string;
    email: string;
    tax_id: string;
    phones: [
      {
        type: string;
        country: string;
        area: string;
        number: string;
      }
    ]
  },
  items: [
    {
      reference_id: string;
      name: string;
      quantity: number;
      unit_amount: number;
    }
  ],
  shipping: {
    address: {
      street: string;
      number: string;
      complement: string;
      locality: string;
      city: string;
      region_code: string;
      country: string;
      postal_code: string;
    }
  },
  charges: [
    {
      id: string;
      reference_id: string;
      status: string;
      created_at: Date;
      paid_at: Date;
      description: string;
      amount: {
        value: number,
        currency: string;
        summary: {
          total: number
          paid: number;
          refunded: number;
        }
      },
      payment_response: {
        code: string;
        message: string;
        reference: string;
      },
      payment_method: {
        type: string;
        installments: number;
        capture: boolean;
        card: {
          brand: string;
          first_digits: string;
          last_digits: string;
          exp_month: string;
          exp_year: string;
          holder: {
            name: string;
            tax_id: string;
          },
          store: boolean;
        },
        soft_descriptor: string;
      },
      links: [
        {
          rel: string;
          href: string;
          media: string;
          type: string;
        },
        {
          rel: string;
          href: string;
          media: string;
          type: string;
        }
      ]
    }
  ],
  notification_urls: string[];
  links: [
    {
      rel: string;
      href: string;
      media: string;
      type: string;
    }
  ]
}