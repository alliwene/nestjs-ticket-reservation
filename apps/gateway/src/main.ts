import { NestFactory } from '@nestjs/core';
import { Logger } from 'nestjs-pino';
import { ConfigService } from '@nestjs/config';

import { GatewayModule } from './gateway.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayModule);
  app.useLogger(app.get(Logger));

  const configService = app.get(ConfigService);
  await app.listen(configService.getOrThrow('PORT'));
}
bootstrap();
