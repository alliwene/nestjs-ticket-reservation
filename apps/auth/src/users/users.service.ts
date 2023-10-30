import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
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
      const user = new User({
        email,
        password: hashedPassword,
        roles: roles?.map((roleDto) => new Role(roleDto)),
      });
      return await this.usersRepository.create(user);
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async verifyUser(email: string, password: string) {
    try {
      const user = await this.usersRepository.findOne({ email });

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }
      return user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        throw new UnauthorizedException('Invalid credentials');
      }
      throw new InternalServerErrorException(err);
    }
  }

  async getUser({ id }: GetUserDto) {
    return this.usersRepository.findOne({ id });
  }
}
