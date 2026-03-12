import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { EventRouterService } from './kafka-router.service';
import { publishToDLQ } from '../dlq/dlq.producer';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(private eventRouter: EventRouterService) {}

  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'notification-service',
      brokers: ['kafka:9092'],
    });

    const consumer = kafka.consumer({
      groupId: 'notification-group',
    });

    await consumer.connect();

    await consumer.subscribe({
      topic: 'user_registered',
    });

    await consumer.subscribe({
      topic: 'discount_notification',
    });

    const MAX_RETRIES = 3;

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const payload: unknown = JSON.parse(message.value!.toString());

        console.log('Kafka event received:', topic);

        let attempt = 0;

        while (attempt < MAX_RETRIES) {
          try {
            await this.eventRouter.route(topic, payload);
            return;
          } catch (error) {
            attempt++;
            console.error(`Retry ${attempt} failed`, error);
          }
        }

        // retries exhausted → send to DLQ
        await publishToDLQ(topic, payload);
      },
    });
  }
}
