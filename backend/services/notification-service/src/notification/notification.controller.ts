import { Controller } from '@nestjs/common';
import { EventPattern, GrpcMethod, Payload } from '@nestjs/microservices';
import { NotificationService } from './notification.service';

@Controller()
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @EventPattern('user.created')
  handleUserCreate(@Payload() data: any) {
    console.log(data);
  }

  @GrpcMethod('NotificationService', 'GetNotifications')
  async getNotifications(data: { userId: string }) {
    const notifications = await this.notificationService.getNotifications(
      data.userId,
    );

    return { notifications };
  }

  @GrpcMethod('NotificationService', 'GetDlqEvents')
  async getDlqEvents() {
    const events = await this.notificationService.getDlqEvents();

    return { events };
  }

  @GrpcMethod('NotificationService', 'ReplayDlqEvent')
  async replayDlqEvent(data: { id: string }) {
    await this.notificationService.replayDlqEvent(data.id);

    return {
      success: true,
      message: 'Event replayed successfully',
    };
  }
}
