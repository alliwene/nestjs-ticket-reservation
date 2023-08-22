import { Injectable } from '@nestjs/common';
import { NotifyEmailDto } from './dto/notify-email.dto';

@Injectable()
export class NotificationsService {
  async notifyEmail({ email }: NotifyEmailDto) {
    console.log(`Sending email to ${email}`);
  }
}
