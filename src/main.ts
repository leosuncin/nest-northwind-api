import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { useContainer } from 'class-validator';
import { DocfyUiModule } from 'nestjs-docfy'

import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Northwind API')
    .setDescription('The Northwind API description')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  
  DocfyUiModule.setup('/docs', app)
  SwaggerModule.setup('api', app, document);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
