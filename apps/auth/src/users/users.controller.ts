import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '@app/common';
import { UserDocument } from './models/user.schema';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() { email, password }: CreateUserDto) {
    return this.usersService.create({
      email,
      password,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@CurrentUser() user: UserDocument) {
    return user;
  }
}
