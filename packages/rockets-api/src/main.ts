import { AppModule } from './app.module';
import { NestFactory } from '@nestjs/core';
import { SwaggerUiService } from '@concepta/nestjs-swagger-ui';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // get the swagger ui service, and set it up
  const swaggerUiService = app.get(SwaggerUiService);
  swaggerUiService.setup(app);

  // set up cors
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : 'http://localhost:3000',
  });

  await app.listen(3001);
}
bootstrap();
