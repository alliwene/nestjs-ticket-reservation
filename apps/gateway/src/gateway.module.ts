import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

import { LoggerModule } from '@app/common';

@Module({
  imports: [
    GraphQLModule.forRootAsync<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      useFactory: (configService: ConfigService) => ({
        gateway: {
          supergraphSdl: new IntrospectAndCompose({
            subgraphs: [],
          }),
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/gateway/.env',
    }),
    LoggerModule,
  ],
  controllers: [],
  providers: [],
})
export class GatewayModule {}
