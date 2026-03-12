import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { CreateDlqEventDto } from './dto/create-dlqEvent.dto';
import { DeadLetterEvent } from '../../generated/prisma';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto) {
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        message: dto.message,
        status: dto.status,
      },
    });
  }

  async createDlqEvent(dto: CreateDlqEventDto): Promise<DeadLetterEvent> {
    return await this.prisma.deadLetterEvent.create({
      data: {
        topic: dto.topic,
        payload: dto.payload,
        error: dto.error,
      },
    });
  }
}
