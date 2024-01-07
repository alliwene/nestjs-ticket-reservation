import { Controller, UsePipes, ValidationPipe } from '@nestjs/common';

import { NotificationsService } from './notifications.service';
import { NotifyEmailDto } from './dto/notify-email.dto';
import {
  NotificationsServiceController,
  NotificationsServiceControllerMethods,
} from '@app/common';

@Controller()
@NotificationsServiceControllerMethods()
export class NotificationsController implements NotificationsServiceController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @UsePipes(new ValidationPipe())
  async notifyEmail({ email, text }: NotifyEmailDto) {
    this.notificationsService.notifyEmail({ email, text });
  }
}
