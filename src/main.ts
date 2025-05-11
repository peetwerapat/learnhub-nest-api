import { ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Config declarations
  const configService = app.get(ConfigService);

  // Api configuration
  app.setGlobalPrefix('');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Cors configuration
  app.enableCors({ origin: '*' });

  // Swagger configuration
  const config = new DocumentBuilder()
      .setTitle('Learnhub Nest API')
      .setDescription('APIs for Learnhub')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'JWT',
      )
      .build(),
    documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, documentFactory, {
    swaggerOptions: {
      operationsSorter: 'method',
      tagsSorter: 'alpha',
      defaultModelsExpandDepth: -1,
      docExpansion: 'none',
    },
  });

  await app.listen(configService.get<number>('APP_PORT', 80));
}
bootstrap();