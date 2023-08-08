import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger as NestLogger,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { AuthModule } from './auth.module';
import { AllExceptionsFilter } from '@app/common';

async function bootstrap() {
  const logger = new NestLogger();
  const app = await NestFactory.create(AuthModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  await app.listen(port);
  logger.log(`Auth service is running on port ${port}`);
}
bootstrap();
