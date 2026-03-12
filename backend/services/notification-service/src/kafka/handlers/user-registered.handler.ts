import { Injectable } from '@nestjs/common';
import { NotificationService } from '../../notification/notification.service';
import { UserRegisteredEvent } from '../../types/types';
import { KafkaEvent } from '../decorators/kafka-event.decorator';
import { KafkaEventHandler } from '../event-handler.interface';
import { KafkaEvents } from '../kafka.events';

@Injectable()
@KafkaEvent(KafkaEvents.USER_REGISTERED)
export class UserRegisteredHandler implements KafkaEventHandler<UserRegisteredEvent> {
  constructor(private notificationService: NotificationService) {}

  async handle(data: UserRegisteredEvent) {
    await this.notificationService.handleUserRegistered(
      data.userId,
      data.email,
      data.name,
    );
  }
}
