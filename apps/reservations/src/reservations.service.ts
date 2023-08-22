import { Injectable, Inject, Logger } from '@nestjs/common';
import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, catchError } from 'rxjs';

import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService {
  protected readonly logger = new Logger(ReservationsService.name);
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(
    { startDate, endDate, charge }: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    const { amount } = charge;

    return this.paymentsService.send('create_charge', { amount, email }).pipe(
      catchError((error) => {
        this.logger.error('Error creating charge:', error);
        throw new Error(error.message);
      }),
      map(async (response) => {
        return this.reservationsRepository.create({
          startDate,
          endDate,
          timestamp: new Date(),
          userId,
          invoiceId: response.id,
          amount,
        });
      }),
    );
  }

  async findAll(userId: string) {
    return this.reservationsRepository.find({ userId });
  }

  async findOne(_id: string) {
    return this.reservationsRepository.findOne({ _id });
  }

  async update(_id: string, { startDate, endDate }: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { _id },
      { $set: { startDate, endDate } },
    );
  }

  async remove(_id: string) {
    return this.reservationsRepository.findOneAndDelete({ _id });
  }
}
