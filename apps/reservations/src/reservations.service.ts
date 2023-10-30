import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { map, catchError } from 'rxjs';

import { PAYMENTS_SERVICE, UserDto } from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';
import { Reservation } from './entities/reservation.entity';

@Injectable()
export class ReservationsService {
  protected readonly logger = new Logger(ReservationsService.name);
  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE) private readonly paymentsService: ClientProxy,
  ) {}
  async create(
    { startDate, endDate, charge }: CreateReservationDto,
    { email, id: userId }: UserDto,
  ) {
    const { amount } = charge;

    return this.paymentsService.send('create_charge', { amount, email }).pipe(
      catchError((error) => {
        this.logger.error('Error creating charge:', error);
        throw new Error(error.message);
      }),
      map(async (response) => {
        const reservation = new Reservation({
          startDate,
          endDate,
          timestamp: new Date(),
          userId,
          invoiceId: response.id,
          amount,
        });

        return this.reservationsRepository.create(reservation);
      }),
    );
  }

  async findAll(userId: string) {
    return this.reservationsRepository.find({ userId });
  }

  async findOne(id: string) {
    return this.reservationsRepository.findOne({ id });
  }

  async update(id: string, { startDate, endDate }: UpdateReservationDto) {
    return this.reservationsRepository.findOneAndUpdate(
      { id },
      { startDate, endDate },
    );
  }

  async remove(id: string) {
    return this.reservationsRepository.findOneAndDelete({ id });
  }
}
