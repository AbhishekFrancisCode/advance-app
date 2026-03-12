import { Injectable } from '@nestjs/common';
import { sendDiscountEmail, sendWelcomeEmail } from '../email/email.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationRepository } from './notification.repository';

@Injectable()
export class NotificationService {
  constructor(private readonly notificationRepo: NotificationRepository) {}

  async handleUserRegistered(userId: string, email: string, name: string) {
    console.log('notificationRepo:> hit');
    try {
      await sendWelcomeEmail({
        email,
        name,
      });

      const dto: CreateNotificationDto = {
        userId,
        type: 'WELCOME_EMAIL',
        message: `Welcome email sent to ${email}`,
        status: 'SUCCESS',
      };

      await this.notificationRepo.createNotification(dto);
    } catch (error) {
      const dto: CreateNotificationDto = {
        userId,
        type: 'WELCOME_EMAIL',
        message: `Failed to send welcome email to ${email}`,
        status: 'FAILED',
      };

      await this.notificationRepo.createNotification(dto);

      console.error('Email failed:', error);
      throw error;
    }
  }

  async sendDiscountNotification(
    userId: string,
    email: string,
    code: string,
    percentage: number,
  ) {
    await sendDiscountEmail({
      email,
      code,
      percentage,
    });

    await this.notificationRepo.createNotification({
      userId,
      type: 'DISCOUNT_EMAIL',
      message: `Discount email sent: ${code}`,
      status: 'SUCCESS',
    });
  }
}
