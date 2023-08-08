import { Injectable } from '@nestjs/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
  ) {}
  create(
    { startDate, endDate, placeId, invoiceId }: CreateReservationDto,
    userId: string,
  ) {
    return this.reservationsRepository.create({
      startDate,
      endDate,
      placeId,
      invoiceId,
      timestamp: new Date(),
      userId,
    });
  }

  findAll(userId: string) {
    return this.reservationsRepository.find({ userId });
  }

  findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  update(
    _id: string,
    { startDate, endDate, placeId, invoiceId }: UpdateReservationDto,
  ) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: { startDate, endDate, placeId, invoiceId } },
    );
  }

  remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
