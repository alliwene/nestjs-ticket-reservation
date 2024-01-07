import { Transform, Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';
import { CreateChargeMessage } from '../types';

export class CreateChargeDto implements Omit<CreateChargeMessage, 'email'> {
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: 'Amount must be a number' },
  )
  @IsNotEmpty()
  @Min(0, { message: 'Amount must be a non-negative number' })
  @Transform(({ value }) => parseFloat(value))
  @Type(() => Number)
  amount: number;
}
