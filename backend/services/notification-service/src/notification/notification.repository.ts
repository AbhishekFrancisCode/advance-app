import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Injectable()
export class NotificationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createNotification(dto: CreateNotificationDto) {
    console.log('notificationRepo:>>>>', dto);
    return this.prisma.notification.create({
      data: {
        userId: dto.userId,
        type: dto.type,
        message: dto.message,
        status: dto.status,
      },
    });
  }
}
