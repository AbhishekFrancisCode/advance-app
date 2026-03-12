import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { NotificationRepository } from './notification.repository';
import { PrismaModule } from 'src/prisma/prisma.module';
import { DiscountHandler } from 'src/kafka/handlers/discount.handler';
import { UserRegisteredHandler } from 'src/kafka/handlers/user-registered.handler';
import { KafkaConsumerService } from 'src/kafka/services/kafka-consumer.services';
import { EventRouterService } from 'src/kafka/services/kafka-router.service';
import { DiscoveryModule } from '@nestjs/core';
import { DlqConsumerService } from 'src/kafka/dlq/dlq-consumer.service';
import { KafkaModule } from 'src/kafka/kafka.module';
import { DlqProducer } from 'src/kafka/dlq/dlq.producer';

@Module({
  imports: [PrismaModule, DiscoveryModule, KafkaModule],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,

    KafkaConsumerService,
    EventRouterService,

    UserRegisteredHandler,
    DiscountHandler,

    DlqProducer,
    DlqConsumerService,
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
