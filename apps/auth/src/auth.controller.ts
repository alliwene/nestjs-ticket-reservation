import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';

import { AuthService } from './auth.service';
import { CurrentUser } from '@app/common';
import { User } from './users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(
    @CurrentUser() { id, email }: User,
    @Res({ passthrough: true }) response: Response,
  ) {
    const accessToken = await this.authService.login({ id } as User, response);

    response.status(200).send({ user: { id, email }, accessToken });
  }

  @UseGuards(AuthGuard('jwt'))
  @MessagePattern('authenticate')
  async authenticate(@Payload() data: any) {
    return data.user;
  }
}
