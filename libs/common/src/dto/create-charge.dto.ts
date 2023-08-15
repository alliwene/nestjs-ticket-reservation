import { Transform, Type } from 'class-transformer';
import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class CreateChargeDto {
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
