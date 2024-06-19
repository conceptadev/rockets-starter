import { AppModule } from './app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerUiService } from '@concepta/nestjs-swagger-ui';
import { ExceptionsFilter } from '@concepta/nestjs-exception';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // get the swagger ui service, and set it up
  const swaggerUiService = app.get(SwaggerUiService);
  swaggerUiService.builder().addBearerAuth();
  swaggerUiService.setup(app);

  const exceptionsFilter = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(exceptionsFilter));

  // set up cors
  app.enableCors({
    origin: process.env.CORS_ORIGIN
      ? process.env.CORS_ORIGIN.split(',')
      : 'http://localhost:3000',
  });

  await app.listen(3001);
}
bootstrap();
