import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import { join } from 'path';

import { PaymentsModule } from './payments.module';
import { PAYMENTS_PACKAGE_NAME } from '@app/common';

async function bootstrap() {
  const app = await NestFactory.create(PaymentsModule);

  const configService = app.get(ConfigService);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      package: PAYMENTS_PACKAGE_NAME,
      protoPath: join(__dirname, '../../../proto/payments.proto'),
      url: configService.getOrThrow('PAYMENTS_GRPC_URL'),
    },
  });

  app.useLogger(app.get(Logger));
  await app.startAllMicroservices();
}
bootstrap();
