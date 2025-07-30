import { AppModule } from '@/app.module';
import { PrismaService } from '@/prisma/prisma.service';
import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { hash } from 'bcryptjs';
import request from 'supertest';

describe('Create account (E2E)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /login', async () => {
    await prisma.user.create({
      data: {
        email: 'flavio@example.com',
        password: await hash('OhMyGod123', 8),
        name: 'Flavio',
        permissions: [],
      },
    });

    const response = await request(app.getHttpServer()).post('/login').send({
      email: 'flavio@example.com',
      password: 'OhMyGod123',
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      access_token: expect.any(String),
    });
  });

  test('[POST] /login (invalid password)', async () => {
    const response = await request(app.getHttpServer()).post('/login').send({
      email: 'flavio@example.com',
      password: 'Wrong Password',
    });

    expect(response.status).toBe(401);
  });


});
