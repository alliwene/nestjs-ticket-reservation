import { Type } from 'class-transformer';
import { Field, InputType } from '@nestjs/graphql';

import {
  IsDate,
  IsDefined,
  IsNotEmptyObject,
  ValidateNested,
} from 'class-validator';
import { CreateChargeDto } from '@app/common';

@InputType()
export class CreateReservationDto {
  /**
   * Reservation start date
   * @example '2021-01-01'
   */
  @IsDate()
  @Type(() => Date)
  @Field()
  startDate: Date;

  /**
   * Reservation end date
   * @example '2021-01-01'
   */
  @IsDate()
  @Type(() => Date)
  @Field()
  endDate: Date;

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => CreateChargeDto)
  @Field(() => CreateChargeDto)
  charge: CreateChargeDto;
}
