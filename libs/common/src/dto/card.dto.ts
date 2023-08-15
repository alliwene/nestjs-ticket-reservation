import { Type } from 'class-transformer';
import {
  IsCreditCard,
  IsInt,
  IsString,
  Min,
  Max,
  MinLength,
} from 'class-validator';

export class CardDto {
  /**
   * The card's CVC. It is highly recommended to always include this value.
   */
  @IsString()
  @MinLength(3)
  cvc: string;

  /**
   * Two-digit number representing the card's expiration month.
   */
  @IsInt()
  @Min(1)
  @Max(12)
  @Type(() => Number)
  exp_month: number;

  /**
   * Four-digit number representing the card's expiration year.
   */
  @IsInt()
  @Min(new Date().getFullYear())
  @Type(() => Number)
  exp_year: number;

  /**
   * The card number, as a string without any separators.
   */
  @IsCreditCard()
  number: string;
}
