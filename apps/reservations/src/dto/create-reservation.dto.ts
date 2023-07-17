import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
export class CreateReservationDto {
  /**
   * Reservation start date
   * @example '2021-01-01'
   */
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  /**
   * Reservation end date
   * @example '2021-01-01'
   */
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  /**
   * Reservation place id
   */
  @IsString()
  @IsNotEmpty()
  placeId: string;

  /**
   * Reservation invoice id
   */
  @IsString()
  @IsNotEmpty()
  invoiceId: string;
}
