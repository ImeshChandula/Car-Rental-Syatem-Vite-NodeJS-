import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransformInterception } from './interceptors/transform.interceptor';
import { AllExceptionsFilter } from './filters/http-exception.filter';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  // Validating request body automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: configService.get('environment') === 'production',
    }),
  );

  // Custom Response Interceptor
  app.useGlobalInterceptors(new TransformInterception);
  app.useGlobalFilters(new AllExceptionsFilter);

  // Enable CORS
  app.enableCors({
    origin: configService.get('environment') === 'production' 
      ? configService.get('domain.production')
      : configService.get('domain.development'),
    credentials: true,
  });

  const port = configService.get('port') || 3000;
  await app.listen(port);
}

bootstrap();
