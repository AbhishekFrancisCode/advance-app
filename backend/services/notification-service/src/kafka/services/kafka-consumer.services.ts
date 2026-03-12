import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { EventRouterService } from './kafka-router.service';
import { publishToDLQ } from '../dlq/dlq.producer';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(private eventRouter: EventRouterService) {}

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

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

    const RETRY_DELAYS = [1000, 5000, 15000];

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const payload: unknown = JSON.parse(message.value!.toString());

        console.log('Kafka event received:', topic);

        for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
          try {
            await this.eventRouter.route(topic, payload);
            return;
          } catch (error) {
            if (attempt === RETRY_DELAYS.length) {
              console.error('Retries exhausted. Sending to DLQ');
              await publishToDLQ(topic, payload);
              return;
            }

            const delay = RETRY_DELAYS[attempt];

            console.error(
              `Retry ${attempt + 1} failed. Retrying in ${delay}ms`,
              error,
            );

            await this.sleep(delay);
          }
        }
      },
    });
  }
}
