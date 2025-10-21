import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

// root file -> entry point of nest js app

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // validating req.body automatically
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips properties that don't have decorations
      forbidNonWhitelisted: true,
      transform: true,
      disableErrorMessages: 
        process.env.NODE_ENV === 'development' ? false : true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
