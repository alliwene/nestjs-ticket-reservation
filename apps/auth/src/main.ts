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
import { join } from 'path';

import { AuthModule } from './auth.module';
import { AUTH_PACKAGE_NAME, AllExceptionsFilter } from '@app/common';

async function bootstrap() {
  const logger = new NestLogger();
  const app = await NestFactory.create(AuthModule);
  const configService = app.get(ConfigService);

  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: AUTH_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/auth.proto'),
      url: configService.getOrThrow('AUTH_GRPC_URL'),
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
