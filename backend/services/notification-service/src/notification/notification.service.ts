import { Injectable, OnModuleInit } from '@nestjs/common';
import { sendDiscountEmail, sendWelcomeEmail } from '../email/email.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { NotificationRepository } from './notification.repository';
import { Prisma } from 'generated/prisma/client';
import { KafkaService } from 'src/kafka/kafka.service';
import { Producer } from 'kafkajs';

@Injectable()
export class NotificationService implements OnModuleInit {
  private producer: Producer;
  constructor(
    private readonly notificationRepo: NotificationRepository,
    private readonly kafkaService: KafkaService,
  ) {}

  async onModuleInit() {
    this.producer = this.kafkaService.createProducer();
    await this.producer.connect();
  }

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

  async handleDLQEvent(data: {
    topic: string;
    payload: Prisma.InputJsonValue;
    error?: string;
  }) {
    console.log('handleDLQEvent:> hit');
    await this.notificationRepo.createDlqEvent({
      topic: data.topic,
      payload: data.payload,
      error: 'Retries exhausted',
    });
  }

  async getNotifications(userId: string) {
    return this.notificationRepo.findNotificationsByUser(userId);
  }

  async getDlqEvents() {
    return this.notificationRepo.getDlqEvents();
  }

  async replayDlqEvent(id: string) {
    const event = await this.notificationRepo.getDlqEventById(id);

    if (!event) {
      throw new Error('DLQ event not found');
    }
    try {
      const originalTopic = event.topic.replace('_dlq', '');
      await this.producer.send({
        topic: originalTopic,
        messages: [
          {
            value: JSON.stringify(event.payload),
          },
        ],
      });
      await this.notificationRepo.updateStatus(id, 'REPLAYED');
    } catch (error) {
      await this.notificationRepo.updateStatus(id, 'FAILED');
      throw error;
    }

    console.log(`Replayed DLQ event ${id}`);
  }
}
