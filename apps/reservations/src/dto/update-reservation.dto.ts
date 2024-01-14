import { PartialType } from '@nestjs/swagger';
import { InputType } from '@nestjs/graphql';

import { CreateReservationDto } from './create-reservation.dto';

@InputType()
export class UpdateReservationDto extends PartialType(CreateReservationDto) {}
