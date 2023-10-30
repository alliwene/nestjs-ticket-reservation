import {
  IsArray,
  IsEmail,
  IsOptional,
  IsStrongPassword,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import { RoleDto } from './role.dto';

export class CreateUserDto {
  /**
   * User email address
   * @example 'ab@example.com'
   */
  @IsEmail()
  email: string;

  /**
   * User password
   * @minLength 8
   * @pattern ^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,20}$
   * @description Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character
   */
  @IsStrongPassword(
    {},
    {
      message:
        'Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number and one special character',
    },
  )
  password: string;

  /**
   * User role
   */
  @IsOptional()
  @IsArray()
  @ValidateNested()
  @Type(() => RoleDto)
  roles?: RoleDto[];
}
