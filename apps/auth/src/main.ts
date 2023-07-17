import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger as NestLogger } from '@nestjs/common';
import { Logger } from 'nestjs-pino';

import { AuthModule } from './auth.module';
import { AllExceptionsFilter } from '@app/common';

async function bootstrap() {
  const logger = new NestLogger();
  const app = await NestFactory.create(AuthModule);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());

  await app.listen(3001);
  logger.log('Auth service is running on port 3001');
}
bootstrap();
