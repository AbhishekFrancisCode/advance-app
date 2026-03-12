import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaDLQEvents } from '../kafka.events';
import { KafkaConfig } from '../kafka.config';

@Injectable()
export class DlqConsumerService implements OnModuleInit {
  async onModuleInit() {
    const kafka = new Kafka({
      clientId: KafkaConfig.dlqClientid,
      brokers: KafkaConfig.brokers,
    });

    const consumer = kafka.consumer({
      groupId: KafkaConfig.consumerGroups.DLQ,
    });

    await consumer.connect();

    await consumer.subscribe({
      topic: KafkaDLQEvents.USER_REGISTERED_DLQ,
    });

    await consumer.subscribe({
      topic: KafkaDLQEvents.DISCOUNT_NOTIFICATION_DLQ,
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
