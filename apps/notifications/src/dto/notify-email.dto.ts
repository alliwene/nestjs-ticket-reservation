import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class NotifyEmailDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  text: string;
}
