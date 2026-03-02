import { EnvService } from '@/env/env.service';
import { PrismaService } from '@/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { PessoaStatus } from '@prisma/client';
import axios from 'axios';
import { hash } from 'bcryptjs';
import { CreateOrderDto } from './pagseguro.controller';

@Injectable()
export class PagSeguroService {
  constructor(
    private PrismaService: PrismaService,
    private readonly httpService: HttpService,
    private envService: EnvService,

  ) { }

  async createOrder(createOrderDto: CreateOrderDto) {

    let emp_id = 0;
    let assEmp_id = 0;

    if (createOrderDto.empresaId > 0) {
      emp_id = createOrderDto.empresaId
    }
    else {
      //Cria empresa pois é o primeiro pagamento
      const empresa = await this.PrismaService.empresa.create({
        data: {
          nome: createOrderDto.nome,
          cnpj: createOrderDto.cpf.toString(), // Usando CPF como CNPJ para simplificar
          email: createOrderDto.email,
          status: PessoaStatus.ATIVA,
          endereco: {
            create: {
              logradouro: 'Não informado',
              numero: '0',
              bairro: 'Não informado',
              cidade: 'Não informado',
              estado: 'NI',
              cep: '00000000',
              complemento: 'Não informado',
            },
          }
        }
      });

      emp_id = empresa.id

      //Cria usuário com e-mail e senha padrão Senha123@
      const hashedPasword = await hash('Senha123@', 10);
      const user = await this.PrismaService.user.create({
        data: {
          name: createOrderDto.nome,
          login: createOrderDto.email,
          email: createOrderDto.email,
          password: hashedPasword, // Senha123@
          role: 'ADMIN',
          permissions: ['ALL'],
          empresa: {
            connect: {
              id: emp_id
            }
          }
        }
      });

      //Cria assinatura para empresa
      const assinatura = await this.PrismaService.empresaAssinatura.create({
        data: {
          dataInicio: new Date(),
          dataFim: new Date(createOrderDto.frequencia == "ANUAL" ? new Date().setFullYear(new Date().getFullYear() + 1) :
            createOrderDto.frequencia == "SEMESTRAL" ? new Date().setMonth(new Date().getMonth() + 6) : new Date().setMonth(new Date().getMonth() + 1)),
          status: 'PENDENTE',
          assinatura: createOrderDto.assinaturaId ? {
            connect: { id: createOrderDto.assinaturaId }
          } : undefined,
          empresa: emp_id ? { connect: { id: emp_id } } : undefined,
        }
      });
      assEmp_id = assinatura.id
    }

    if (assEmp_id > 0) {
      const pagamentoAssinatura = await this.PrismaService.pagamentoAssinatura.create({
        data: {
          dataPagamento: new Date(),
          valorPago: createOrderDto.valorPagamento,
          metodoPagamento: createOrderDto.metodoPagamento,
          empresa_pagamento: createOrderDto.empresa_pagamento,
          assinaturaempresa: {
            connect: {
              id: assEmp_id,
            },
          },

          id_request: "",
          reference_id: "",
          created_at: new Date(),

          costumer_name: createOrderDto.nome,
          costumer_email: createOrderDto.email,
          costumer_tax_id: createOrderDto.cpf.toString(),
          costumer_phone_type: "",
          costumer_phone_country: "",
          costumer_phone_area: "",
          costumer_phone_number: "",

          items_reference_id: "",
          items_name: "",
          items_quantity: 0,
          items_unit_amount: 0,

          shipping_address_street: "",
          shipping_address_number: "",
          shipping_address_locality: "",
          shipping_address_city: "",
          shipping_address_region_code: "",
          shipping_address_country: "",
          shipping_address_postal_code: "",

          charges_id: "",
          charges_reference_id: "",
          charges_status: "",
          charges_created_at: new Date(),
          charges_paid_at: new Date(),
          charges_description: "",

          charges_amount_value: 0,
          charges_amount_currency: "BRL",

          charges_amount_summary_total: 0,
          charges_amount_summary_paid: 0,
          charges_amount_summary_refunded: 0,

          charges_payment_response_code: 0,
          charges_payment_response_message: "",
          charges_payment_response_reference: "",

          charges_payment_response_raw_data_authorization_code: "",
          charges_payment_response_raw_data_nsu: "",
          charges_payment_response_raw_data_tid: "",
          charges_payment_response_raw_data_reason_code: "",

          charges_payment_method_type: "",
          charges_payment_method_installments: 0,
          charges_payment_method_capture: true,
          charges_payment_method_soft_description: "",

          charges_payment_method_card_id: "",
          charges_payment_method_card_brand: "",
          charges_payment_method_card_first_digits: "",
          charges_payment_method_card_last_digits: "",
          charges_payment_method_card_exp_month: "",
          charges_payment_method_card_exp_year: "",
          charges_payment_method_card_store: false,

          charges_payment_method_holder_name: "",
          charges_payment_method_holder_tax_id: "",
        },
      });

      const pagamentoData = {
        reference_id: pagamentoAssinatura.id.toString(),
        customer: {
          name: createOrderDto.nome,
          email: createOrderDto.email,
          tax_id: createOrderDto.cpf,
        },
        items: [
          {
            name: `Assinatura Plano ${createOrderDto.plano}`,
            quantity: 1,
            unit_amount: createOrderDto.valorPagamento,
          }
        ],
        //qr_codes : []
        //notification_urls: ['https://meusite.com/notificacoes'],
        charges: [
          {
            reference_id: pagamentoAssinatura.id.toString(),
            description: `Pagamento Plano ${createOrderDto.plano}`,
            amount: {
              value: createOrderDto.valorPagamento,
              currency: 'BRL'
            },
            payment_method: {
              type: 'CREDIT_CARD',
              installments: 1,
              capture: true,
              soft_description: 'ADM Imóveis',
              card: {
                encrypted: createOrderDto.encryptedCard,
                store: true,
              }
            }

          }

        ]
      }


      //const responseOrder = await this.httpService.axiosRef.post<pagseguroOrderResponse>('https://sandbox.api.pagseguro.com/orders', pagamentoData, {
      try {
        //console.log('token', pagamentoData);

        const responseOrder = await this.httpService.axiosRef.post('https://sandbox.api.pagseguro.com/orders', pagamentoData, {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            //'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${this.envService.get('PAGSEGURO_TOKEN')}`
          }
        });

        /*
        console.log('responseOrder', responseOrder.data);
        console.log('amount', responseOrder.data.charges[0].amount);
        console.log('payment_response', responseOrder.data.charges[0].payment_response);
        console.log('payment_method', responseOrder.data.charges[0].payment_method);
        console.log('payment_method_card', responseOrder.data.charges[0].payment_method.card);
        console.log('costumer_phone_type', responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.type : null);
        console.log('costumer_phone_country', responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.country : null);
        console.log('costumer_phone_area', responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.area : null);
        console.log('costumer_phone_number', responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.number : null);
  
        console.log('items_reference_id', responseOrder.data.items[0].reference_id);
        console.log('items_name', responseOrder.data.items[0].name);
        console.log('items_quantity', responseOrder.data.items[0].quantity);
        console.log('items_unit_amount', responseOrder.data.items[0].unit_amount);
  
        console.log('shipping_address_street', responseOrder.data.shipping?.address?.street || "");
        console.log('shipping_address_number', responseOrder.data.shipping?.address?.number || "");
        console.log('shipping_address_locality', responseOrder.data.shipping?.address?.locality || "");
        console.log('shipping_address_city', responseOrder.data.shipping?.address?.city || "");
        console.log('shipping_address_region_code', responseOrder.data.shipping?.address?.region_code || "");
        console.log('shipping_address_country', responseOrder.data.shipping?.address?.country || "");
        console.log('shipping_address_postal_code', responseOrder.data.shipping?.address?.postal_code || "");
        console.log('charges_id', responseOrder.data.charges[0].id);
        console.log('charges_reference_id', responseOrder.data.charges[0].reference_id);
        console.log('charges_status', responseOrder.data.charges[0].status);
        console.log('charges_created_at', responseOrder.data.charges[0].created_at);
        console.log('charges_paid_at', responseOrder.data.charges[0].paid_at);
        console.log('charges_description', responseOrder.data.charges[0].description);
  
        console.log('charges_amount_value', responseOrder.data.charges[0].amount?.value);
        console.log('charges_amount_currency', responseOrder.data.charges[0].amount?.currency);
  
        console.log('charges_amount_summary_total', responseOrder.data.charges[0].amount?.summary?.total);
        console.log('charges_amount_summary_paid', responseOrder.data.charges[0].amount?.summary?.paid);
        console.log('charges_amount_summary_refunded', responseOrder.data.charges[0].amount?.summary?.refunded);
  
        console.log('charges_payment_response_code', responseOrder.data.charges[0].payment_response?.code);
        console.log('charges_payment_response_message', responseOrder.data.charges[0].payment_response?.message);
        console.log('charges_payment_response_reference', responseOrder.data.charges[0].payment_response?.reference);
  
        console.log('charges_payment_response_raw_data_authorization_code', responseOrder.data.charges[0].payment_response.raw_data?.authorization_code);
        console.log('charges_payment_response_raw_data_nsu', responseOrder.data.charges[0].payment_response.raw_data?.nsu);
        console.log('charges_payment_response_raw_data_tid', responseOrder.data.charges[0].payment_response.raw_data?.tid);
        console.log('charges_payment_response_raw_data_reason_code', responseOrder.data.charges[0].payment_response.raw_data?.reason_code);
  
        console.log('charges_payment_method_type', responseOrder.data.charges[0].payment_method?.type);
        console.log('charges_payment_method_installments', responseOrder.data.charges[0].payment_method?.installments);
        console.log('charges_payment_method_capture', responseOrder.data.charges[0].payment_method?.capture);
        console.log('charges_payment_method_soft_description', responseOrder.data.charges[0].payment_method?.soft_descriptor);
  
        console.log('charges_payment_method_card_brand', responseOrder.data.charges[0].payment_method.card?.brand);
        console.log('charges_payment_method_card_first_digits', responseOrder.data.charges[0].payment_method.card?.first_digits);
        console.log('charges_payment_method_card_last_digits', responseOrder.data.charges[0].payment_method.card?.last_digits);
        console.log('charges_payment_method_card_exp_month', responseOrder.data.charges[0].payment_method.card?.exp_month);
        console.log('charges_payment_method_card_exp_year', responseOrder.data.charges[0].payment_method.card?.exp_year);
        console.log('charges_payment_method_card_store', responseOrder.data.charges[0].payment_method.card?.store);
  
        console.log('charges_payment_method_holder_name', responseOrder.data.charges[0].payment_method.card.holder?.name);
        console.log('charges_payment_method_holder_tax_id', responseOrder.data.charges[0].payment_method.card.holder?.tax_id);
        */

        //Grava LINK de pagamento
        if (responseOrder.data.links && responseOrder.data.links.length > 0) {
          for (let link of responseOrder.data.links) {
            await this.PrismaService.pagamentoLinks.create({
              data: {
                pagamentoassinatura: {
                  connect: {
                    id: pagamentoAssinatura.id,
                  }
                },
                rel: link.rel,
                href: link.href,
                media: link.media,
                method: link.type,
              }
            });
          }
        }

        //Atualiza dados do pedido retornado do PagSeguro
        const result = await this.PrismaService.pagamentoAssinatura.update({
          where: {
            id: pagamentoAssinatura.id,
          },
          data: {
            dataPagamento: responseOrder.data.charges[0].paid_at || new Date(),

            id_request: responseOrder.data.id,
            reference_id: responseOrder.data.reference_id,
            created_at: responseOrder.data.created_at,

            costumer_name: responseOrder.data.customer.name,
            costumer_email: responseOrder.data.customer.email,
            costumer_tax_id: responseOrder.data.customer.tax_id,
            costumer_phone_type: responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.type : "",
            costumer_phone_country: responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.country : "",
            costumer_phone_area: responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.area : "",
            costumer_phone_number: responseOrder.data.customer && responseOrder.data.customer.phones > 0 ? responseOrder.data.customer.phones[0]?.number : "",

            items_reference_id: responseOrder.data.items[0].reference_id,
            items_name: responseOrder.data.items[0].name,
            items_quantity: responseOrder.data.items[0].quantity,
            items_unit_amount: responseOrder.data.items[0].unit_amount,

            shipping_address_street: responseOrder.data.shipping?.address?.street || "",
            shipping_address_number: responseOrder.data.shipping?.address?.number || "",
            shipping_address_locality: responseOrder.data.shipping?.address?.locality || "",
            shipping_address_city: responseOrder.data.shipping?.address?.city || "",
            shipping_address_region_code: responseOrder.data.shipping?.address?.region_code || "",
            shipping_address_country: responseOrder.data.shipping?.address?.country || "",
            shipping_address_postal_code: responseOrder.data.shipping?.address?.postal_code || "",

            charges_id: responseOrder.data.charges[0].id,
            charges_reference_id: responseOrder.data.charges[0].reference_id,
            charges_status: responseOrder.data.charges[0].status,
            charges_created_at: responseOrder.data.charges[0].created_at,
            charges_paid_at: responseOrder.data.charges[0].paid_at,
            charges_description: responseOrder.data.charges[0].description,

            charges_amount_value: responseOrder.data.charges[0].amount?.value || 0,
            charges_amount_currency: responseOrder.data.charges[0].amount?.currency || "BRL",

            charges_amount_summary_total: responseOrder.data.charges[0].amount?.summary?.total || 0,
            charges_amount_summary_paid: responseOrder.data.charges[0].amount?.summary?.paid || 0,
            charges_amount_summary_refunded: responseOrder.data.charges[0].amount?.summary?.refunded || 0,

            charges_payment_response_code: Number(responseOrder.data.charges[0].payment_response?.code || 0),
            charges_payment_response_message: responseOrder.data.charges[0].payment_response?.message || "",
            charges_payment_response_reference: responseOrder.data.charges[0].payment_response?.reference || "",

            charges_payment_response_raw_data_authorization_code: responseOrder.data.charges[0].payment_response.raw_data?.authorization_code || "",
            charges_payment_response_raw_data_nsu: responseOrder.data.charges[0].payment_response.raw_data?.nsu || "",
            charges_payment_response_raw_data_tid: responseOrder.data.charges[0].payment_response.raw_data?.tid || "",
            charges_payment_response_raw_data_reason_code: responseOrder.data.charges[0].payment_response.raw_data?.reason_code || "",

            charges_payment_method_type: responseOrder.data.charges[0].payment_method?.type || "",
            charges_payment_method_installments: responseOrder.data.charges[0].payment_method?.installments || 0,
            charges_payment_method_capture: responseOrder.data.charges[0].payment_method?.capture || true,
            charges_payment_method_soft_description: responseOrder.data.charges[0].payment_method?.soft_descriptor || "",

            charges_payment_method_card_brand: responseOrder.data.charges[0].payment_method.card?.brand || "",
            charges_payment_method_card_first_digits: responseOrder.data.charges[0].payment_method.card?.first_digits || "",
            charges_payment_method_card_last_digits: responseOrder.data.charges[0].payment_method.card?.last_digits || "",
            charges_payment_method_card_exp_month: responseOrder.data.charges[0].payment_method.card?.exp_month || "",
            charges_payment_method_card_exp_year: responseOrder.data.charges[0].payment_method.card?.exp_year || "",
            charges_payment_method_card_store: responseOrder.data.charges[0].payment_method.card?.store || false,

            charges_payment_method_holder_name: responseOrder.data.charges[0].payment_method.card.holder?.name || "",
            charges_payment_method_holder_tax_id: responseOrder.data.charges[0].payment_method.card.holder?.tax_id || "",
          },
          include: {
            pagamentoLinks: true,
            assinaturaempresa: { include: { empresa: true } }
          },
        });

        //Atualiza status da assionaturaempresa
        await this.PrismaService.empresaAssinatura.update({
          where: {
            id: assEmp_id,
          },
          data: {
            status: result.charges_status == 'PAID' ? 'PAGO' : 'PENDENTE',
          }
        });

        return result;
        //return responseOrder.data;

      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Check if there's a response and data within the error
          if (error.response && error.response.data) {
            console.error('Error message from server:', error.response.data);

            // You can also set this error message to a state to display it in your UI
          } else {
            console.error('Axios error without response data:', error.message);
          }
        } else {
          console.error('Non-Axios error:', error);
        }
      }
    }

    return null;
  }

  async updateOrder(id: number, { nome }: CreateOrderDto) {
    return await this.PrismaService.imovelTipo.update({
      where: {
        id,
      },
      data: {
        name: nome,
      },
    });
  }

  async getOrders() {
    return await this.PrismaService.imovelTipo.findMany({
    });
  }


  async deleteOrder(id: number) {
    return await this.PrismaService.imovelTipo.delete({
      where: {
        id,
      }
    });
  }
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