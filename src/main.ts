import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { EnvService } from './env/env.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(EnvService);
  const port = configService.get('PORT');

  app.enableCors();
  //enable validation pipe globally
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  //IMPROVE: separete that to a different file, create a admin user
  // try {
  //   const userService = app.get(UsersService);
  //   const adminEmail = configService.get('ADMIN_EMAIL');
  //   const adminPassword = configService.get('ADMIN_PASSWORD');
  //   const adminName = configService.get('ADMIN_NAME');
  //   await userService.createAdminUser(adminName, adminEmail, adminPassword);
  // } catch (error) {
  //   console.error('Error creating admin user', error);
  // }

  console.log(port);

  await app.listen(port);

}

bootstrap();
