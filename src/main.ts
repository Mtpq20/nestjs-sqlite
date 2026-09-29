import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'node:path';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, forbidNonWhitelisted: true, transform: true,
  }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.enableShutdownHooks();
  return app;
}

if (require.main === module) {
  void createApp().then(async (app) => {
    await app.listen(Number(process.env.PORT ?? 3000), '127.0.0.1');
    console.log(`Formulario disponible en ${await app.getUrl()}`);
  });
}
