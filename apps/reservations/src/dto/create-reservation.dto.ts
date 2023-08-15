import { Type } from 'class-transformer';
import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from '@app/common';
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

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  charge: CreateChargeDto;
}
