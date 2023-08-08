import { NestFactory, Reflector } from '@nestjs/core';
import {
  ValidationPipe,
  Logger as NestLogger,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';
import cookieParser from 'cookie-parser';
import { Transport } from '@nestjs/microservices';

import { AuthModule } from './auth.module';
import { AllExceptionsFilter } from '@app/common';

async function bootstrap() {
  const logger = new NestLogger();
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: '0.0.0.0',
      port: configService.get('TCP_PORT'),
    },
  });

  app.enableCors();
  app.use(cookieParser());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  await app.startAllMicroservices();

  const port = configService.get('HTTP_PORT');
  await app.listen(port);

  logger.log(`Auth service is running on port ${port}`);
}
bootstrap();
