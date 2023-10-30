import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

import { CreateUserDto, GetUserDto } from './dto';
import { UsersRepository } from './users.repository';
import { Role, User } from './entities';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}
  async create({ email, password, roles }: CreateUserDto) {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    try {
      const user = await this.usersRepository.create({
        email,
        password: hashedPassword,
        roles: roles?.map((roleDto) => new Role(roleDto)),
      } as User);
      return user;
    } catch (error) {
      if (error.code === 1062) {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async verifyUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({ email });
    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }

  async getUser({ id }: GetUserDto) {
    return this.usersRepository.findOne({ id });
  }
}
