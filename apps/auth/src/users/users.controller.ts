import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '@app/common';
import { User } from './entities/user.entity';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() { email, password, roles }: CreateUserDto) {
    return this.usersService.create({
      email,
      password,
      roles,
    });
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getUser(@CurrentUser() user: User) {
    return user;
  }
}
