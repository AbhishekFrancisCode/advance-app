import { KafkaEventHandler } from '../event-handler.interface';
import { DiscountNotificationEvent } from '../../types/discount-notification.event';
import { NotificationService } from '../../notification/notification.service';
import { Injectable } from '@nestjs/common';
import { KafkaEvent } from '../decorators/kafka-event.decorator';
import { KafkaEvents } from '../kafka.events';

@Injectable()
@KafkaEvent(KafkaEvents.DISCOUNT_NOTIFICATION)
export class DiscountHandler implements KafkaEventHandler<DiscountNotificationEvent> {
  constructor(private notificationService: NotificationService) {}

  async handle(data: DiscountNotificationEvent) {
    await this.notificationService.sendDiscountNotification(
      data.userId,
      data.email,
      data.discountCode,
      data.percentage,
    );
  }
}
