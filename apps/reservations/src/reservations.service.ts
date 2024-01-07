import { Injectable, Inject, Logger, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { map, catchError } from 'rxjs';

import {
  PAYMENTS_SERVICE_NAME,
  PaymentsServiceClient,
  UserDto,
} from '@app/common';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';
import { ReservationsRepository } from './reservations.repository';

@Injectable()
export class ReservationsService implements OnModuleInit {
  protected readonly logger = new Logger(ReservationsService.name);
  private paymentsService: PaymentsServiceClient;

  constructor(
    private readonly reservationsRepository: ReservationsRepository,
    @Inject(PAYMENTS_SERVICE_NAME) private readonly client: ClientGrpc,
  ) {}

  onModuleInit() {
    this.paymentsService = this.client.getService<PaymentsServiceClient>(
      PAYMENTS_SERVICE_NAME,
    );
  }

  async create(
    { startDate, endDate, charge }: CreateReservationDto,
    { email, _id: userId }: UserDto,
  ) {
    const { amount } = charge;

    return this.paymentsService.createCharge({ amount, email }).pipe(
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
