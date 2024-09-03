import { AppModule } from './app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { SwaggerUiService } from '@concepta/nestjs-swagger-ui';
import { ExceptionsFilter } from '@concepta/nestjs-exception';

async function bootstrap() {
  console.log('================================');
  console.log('APPLE_CLIENT_ID:', process.env.APPLE_CLIENT_ID);
  console.log('APPLE_CALLBACK_URL:', process.env.APPLE_CALLBACK_URL);
  console.log('APPLE_SCOPE:', process.env.APPLE_SCOPE);
  console.log('APPLE_TEAM_ID:', process.env.APPLE_TEAM_ID);
  console.log('APPLE_KEY_ID:', process.env.APPLE_KEY_ID);
  console.log(
    'APPLE_PRIVATE_KEY_LOCATION:',
    process.env.APPLE_PRIVATE_KEY_LOCATION,
  );
  console.log('================================');
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
