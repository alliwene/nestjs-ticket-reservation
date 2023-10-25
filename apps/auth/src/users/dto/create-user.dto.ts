import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

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
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  roles?: string[];
}
