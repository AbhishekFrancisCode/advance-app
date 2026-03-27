import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';
import { logger } from 'src/common/logger/logger';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user.created')
  handleUserCreate(@Payload() data: any) {
    console.log(data);
  }

  @GrpcMethod('NotificationService', 'GetNotifications')
  async getNotifications(data: { userId: string }) {
    logger.info({
      msg: 'processing register',
      userId: data.userId,
    });
    const notifications = await this.notificationService.getNotifications(
      data.userId,
    );

    return { notifications };
  }

  @GrpcMethod('NotificationService', 'GetDlqEvents')
  async getDlqEvents() {
    logger.info({
      msg: 'Get Dlq events',
    });
    const events = await this.notificationService.getDlqEvents();

    return { events };
  }

  @GrpcMethod('NotificationService', 'GetDlqEventById')
  async getDlqEventsById(data: { id: string }) {
    logger.info({
      msg: 'Get Dlq event:',
      id: data.id,
    });
    const event = await this.notificationService.getDlqEventsById(data.id);
    console.log('event data : ', event);
    return {
      event: {
        ...event,
        payload: JSON.parse(JSON.stringify(event.payload)),
      },
    };
  }

  @GrpcMethod('NotificationService', 'ReplayDlqEvent')
  async replayDlqEvent(data: { id: string }) {
    logger.info({
      msg: 'replay Dlq events',
      id: data.id,
    });
    await this.notificationService.replayDlqEvent(data.id);

    return {
      success: true,
      message: 'Event replayed successfully',
    };
  }
}
