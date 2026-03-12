import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class DlqConsumerService implements OnModuleInit {
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: 'notification-service-dlq',
      brokers: ['kafka:9092'],
    });

    const consumer = kafka.consumer({
      groupId: 'notification-dlq-group',
    });

    await consumer.connect();

    await consumer.subscribe({
      topic: 'user_registered_dlq',
    });

    await consumer.subscribe({
      topic: 'discount_notification_dlq',
    });

    await consumer.run({
      eachMessage: async ({ topic, message }) => {
        const payload: unknown = JSON.parse(message.value!.toString());

        console.error('DLQ EVENT RECEIVED:', topic);
        console.error(await payload);

        // future options:
        // save to DB
        // send alert
        // retry event
      },
    });
  }
}
