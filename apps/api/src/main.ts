import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionsFilter, SwaggerUiService } from '@concepta/rockets';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const swaggerUiService = app.get(SwaggerUiService);
  swaggerUiService
    .builder()
    .setTitle('Rockets Starter API')
    .setDescription('Rockets SDK starter with Microsoft 365 (Entra ID) auth')
    .setVersion('1.0')
    .addBearerAuth();

  const swaggerPath = process.env.SWAGGER_UI_PATH ?? 'api';
  const document = SwaggerModule.createDocument(
    app,
    swaggerUiService.builder().build(),
  );
  SwaggerModule.setup(swaggerPath, app, document);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapterHost));

  const port = Number(process.env.PORT ?? 3001);
  await app.listen(port);
}

bootstrap();
