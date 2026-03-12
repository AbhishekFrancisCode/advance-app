import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventRouterService } from './kafka-router.service';
import { KafkaService } from '../kafka.service';
import { DlqProducer } from '../dlq/dlq.producer';
import { KafkaEvents } from '../kafka.events';
import { KafkaConfig } from '../kafka.config';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  constructor(
    private eventRouter: EventRouterService,
    private kafkaService: KafkaService,
    private dlqProducer: DlqProducer,
  ) {}

  private sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async onModuleInit() {
    const consumer = this.kafkaService.createConsumer(
      KafkaConfig.consumerGroups.NOTIFICATION,
    );

    await consumer.connect();

    await consumer.subscribe({
      topic: KafkaEvents.USER_REGISTERED,
    });

    await consumer.subscribe({
      topic: KafkaEvents.DISCOUNT_NOTIFICATION,
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
              await this.dlqProducer.publish(topic, payload);
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
