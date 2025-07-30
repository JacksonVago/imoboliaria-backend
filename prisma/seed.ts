import { faker } from '@faker-js/faker';
import {
  Endereco,
  Prisma,
  PrismaClient
} from '@prisma/client';

const prisma = new PrismaClient();

const generateRandomDocument = () => {
  return Math.floor(Math.random() * 100000000000).toString();
};

const generateRandomPhone = () => {
  return Math.floor(Math.random() * 100000000000).toString();
};

//factories
export const makeAddress = (
  endereco: Partial<Endereco> = {},
): Prisma.EnderecoCreateInput => {
  return {
    numero: faker.location.buildingNumber(),
    logradouro: faker.location.streetAddress(),
    complemento: faker.location.secondaryAddress(),
    bairro: faker.location.county(),
    cidade: faker.location.city(),
    estado: faker.location.state(),
    cep: faker.location.zipCode(),
    ...endereco,
  };
};

/*export const makeProprietario = (
  proprietario: Partial<Prisma.ProprietarioCreateInput> = {},
): Prisma.ProprietarioCreateInput => {
  return {
    documento: generateRandomDocument(),
    nome: faker.name.fullName(),
    profissao: faker.name.jobTitle(),
    estadoCivil: faker.helpers.arrayElement(Object.values(EstadoCivil)),
    endereco: {
      create: makeAddress(),
    },
    email: faker.internet.email(),
    telefone: generateRandomPhone(),
    ...proprietario,
  };
};*/

async function seed() {
  await prisma.$connect();

  try {
    // Proprietários
    const numProprietarios = 5;
    const proprietarios = [];
    for (let i = 0; i < numProprietarios; i++) {
      /*const proprietario = await prisma.proprietario.create({
        data: {
          documento: generateRandomDocument(),
          nome: faker.name.fullName(),
          profissao: faker.name.jobTitle(),
          estadoCivil: faker.helpers.arrayElement(Object.values(EstadoCivil)),
          endereco: {
            create: {
              numero: faker.location.buildingNumber(),
              logradouro: faker.location.streetAddress(),
              complemento: faker.location.secondaryAddress(),
              bairro: faker.location.county(),
              cidade: faker.location.city(),
              estado: faker.location.state(),
              cep: faker.location.zipCode(),
            },
          },
          email: faker.internet.email(),
          telefone: generateRandomPhone(),
        },
      });
      proprietarios.push(proprietario);*/
    }

    // Imóveis
    const numImoveis = 10;
    for (let i = 0; i < numImoveis; i++) {
      const proprietario =
        proprietarios[Math.floor(Math.random() * proprietarios.length)]; // Escolhe um proprietário aleatoriamente
      /*const imovel = await prisma.imovel.create({
        data: {
          endereco: {
            create: {
              numero: faker.location.buildingNumber(),
              logradouro: faker.location.streetAddress(),
              complemento: faker.location.secondaryAddress(),
              bairro: faker.location.county(),
              cidade: faker.location.city(),
              estado: faker.location.state(),
              cep: faker.location.zipCode(),
            },
          },
          tipo: faker.helpers.arrayElement(Object.values(ImovelTipo)),
          porcentagem_lucro_imobiliaria: faker.number.float({
            min: 0,
            max: 20,
          }),
          valor_aluguel: faker.number.float({ min: 1000, max: 100000 }),
          valor_iptu: faker.number.float({ min: 100, max: 5000 }),
          valor_condominio: faker.number.float({ min: 1000, max: 5000 }),
          status: faker.helpers.arrayElement(Object.values(ImovelStatus)),
        },
      });*/
    }

    // Locatários
    const numLocatarios = 15;
    for (let i = 0; i < numLocatarios; i++) {
      /*const currentLocatario = await prisma.locatario.create({
        data: {
          nome: faker.person.fullName(),
          documento: generateRandomDocument(),
          email: faker.internet.email(),
          telefone: generateRandomPhone(),
          endereco: {
            create: {
              numero: faker.location.buildingNumber(),
              logradouro: faker.location.streetAddress(),
              complemento: faker.location.secondaryAddress(),
              bairro: faker.location.county(),
              cidade: faker.location.city(),
              estado: faker.location.state(),
              cep: faker.location.zipCode(),
            },
          },
        },
      });

      // Adiciona locacao para locatario
      const imovel = await prisma.locacao.create({
        data: {
          dataInicio: faker.date.past(),
          dataFim: faker.date.future(),
          valor_aluguel: parseFloat(
            faker.commerce.price({ min: 1000, max: 5000 }),
          ),
          locatarioId: currentLocatario.id,
          imovelId: Math.floor(Math.random() * numImoveis) + 1,
          garantiaLocacaoTipo: faker.helpers.arrayElement(
            Object.values(GarantiaLocacaoTypes),
          ),
        },
      });*/
    }

    // Locações (relacionamento com Imóveis e Locatários)
    // Preencha com dados reais usando as funções de faker
    const imoveis = await prisma.imovel.findMany();
    const locatarios = await prisma.locatario.findMany();
    for (let i = 0; i < 5; i++) {
      const imovel = imoveis[i];
      const locatario = locatarios[i];
      /*await prisma.locacao.create({
        data: {
          dataInicio: faker.date.past(),
          dataFim: faker.date.future(), // Pode ser nulo para contratos em andamento
          valor_aluguel: parseFloat(
            faker.commerce.price({ min: 1000, max: 5000 }),
          ),
          locatarioId: locatario.id,
          imovelId: imovel.id,
          garantiaLocacaoTipo: faker.helpers.arrayElement(
            Object.values(GarantiaLocacaoTypes),
          ),
        },
      });*/
    }
  } catch (error) {
    console.error('Erro ao executar o seed:', error);
    process.exit(1); // Encerra a aplicação com código de erro
  } finally {
    console.log('Seed executado com sucesso!');
    await prisma.$disconnect();
  }
}

seed();
