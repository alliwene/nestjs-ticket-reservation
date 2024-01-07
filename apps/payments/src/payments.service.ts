import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import {
  NOTIFICATIONS_SERVICE_NAME,
  NotificationsServiceClient,
} from '@app/common';
import { ClientGrpc } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private notificationsService: NotificationsServiceClient;

  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2023-08-16',
    },
  );
  constructor(
    private configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE_NAME)
    private readonly client: ClientGrpc,
  ) {}

  async createCharge({ amount, email }: PaymentsCreateChargeDto) {
    try {
      const existingCustomers = await this.stripe.customers.list({ email });

      if (existingCustomers.data.length > 0) {
        const paymentIntent = await this.stripe.paymentIntents.create({
          payment_method: 'pm_card_visa',
          amount: amount * 100,
          confirm: true,
          currency: 'usd',
          customer: existingCustomers.data[0].id,
          automatic_payment_methods: {
            enabled: true,
            allow_redirects: 'never',
          },
        });

        return paymentIntent;
      }

      const customer = await this.stripe.customers.create({
        email,
        validate: true,
      });

      const paymentIntent = await this.stripe.paymentIntents.create({
        payment_method: 'pm_card_visa',
        amount: amount * 100,
        confirm: true,
        currency: 'usd',
        customer: customer.id,
        automatic_payment_methods: {
          enabled: true,
          allow_redirects: 'never',
        },
      });

      if (!this.notificationsService) {
        this.notificationsService =
          this.client.getService<NotificationsServiceClient>(
            NOTIFICATIONS_SERVICE_NAME,
          );
      }

      this.notificationsService
        .notifyEmail({
          email,
          text: `Your payment of $${amount} has completed successfully!`,
        })
        .subscribe(() => {});

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
