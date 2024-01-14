import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { Query } from '@nestjs/graphql';

import { ReservationDocument } from './models/reservation.schema';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CurrentUser, UserDto } from '@app/common';
import { UpdateReservationDto } from './dto/update-reservation.dto';

@Resolver(() => ReservationDocument)
export class ReservationsResolver {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Mutation(() => ReservationDocument)
  createReservation(
    @Args('createReservationInput')
    createReservationInput: CreateReservationDto,
    @CurrentUser() user: UserDto,
  ) {
    return this.reservationsService.create(createReservationInput, user);
  }

  @Query(() => [ReservationDocument], { name: 'reservations' })
  findAll(@CurrentUser() { _id }: UserDto) {
    return this.reservationsService.findAll(_id);
  }

  @Query(() => ReservationDocument, { name: 'reservation' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.reservationsService.findOne(id);
  }

  @Mutation(() => ReservationDocument)
  removeReservation(@Args('id', { type: () => String }) id: string) {
    return this.reservationsService.remove(id);
  }

  @Mutation(() => ReservationDocument)
  updateReservation(
    @Args('id', { type: () => String }) id: string,
    @Args('updateReservationInput')
    updateReservationInput: UpdateReservationDto,
  ) {
    return this.reservationsService.update(id, updateReservationInput);
  }
}
