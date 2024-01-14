import { UnauthorizedException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

import { app } from './app';
import { AUTH_SERVICE } from '@app/common';

export const authContext = async ({ req }) => {
  try {
    const authClient = app.get<ClientProxy>(AUTH_SERVICE);
    const user = await lastValueFrom(
      authClient.send('authenticate', {
        Authentication: req.headers?.authentication,
      }),
    );

    return { user };
  } catch (error) {
    throw new UnauthorizedException(error);
  }
};
