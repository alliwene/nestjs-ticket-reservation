import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';

import { NOTIFICATIONS_SERVICE } from '@app/common';
import { ClientProxy } from '@nestjs/microservices';
import { PaymentsCreateChargeDto } from './dto/payments-create-charge.dto';

@Injectable()
export class PaymentsService {
  private readonly stripe = new Stripe(
    this.configService.get('STRIPE_SECRET_KEY'),
    {
      apiVersion: '2022-11-15',
    },
  );
  constructor(
    private configService: ConfigService,
    @Inject(NOTIFICATIONS_SERVICE)
    private readonly notificationsService: ClientProxy,
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
      });

      this.notificationsService.emit('notify_email', {
        email,
        text: `Your payment of $${amount} has completed successfully!`,
      });

      return paymentIntent;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
