import { Injectable } from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from './users/entities/user.entity';
import { TokenPayload } from './interfaces/token-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}
  async login({ id }: User, response: Response): Promise<string> {
    const tokenPayload: TokenPayload = { userId: id.toString() };

    const expires = new Date();
    expires.setSeconds(
      expires.getSeconds() + this.configService.get('JWT_EXPIRES_IN'),
    );

    const token = this.jwtService.sign(tokenPayload);

    response.cookie('Authentication', token, {
      expires,
      httpOnly: true,
    });

    return token;
  }
}
