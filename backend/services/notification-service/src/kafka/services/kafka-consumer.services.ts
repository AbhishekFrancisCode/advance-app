import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventRouterService } from './kafka-router.service';
import { KafkaService } from '../kafka.service';
import { DlqProducer } from '../dlq/dlq.producer';
import { KafkaEvents } from '../kafka.events';
import { KafkaConfig } from '../kafka.config';
import { logger } from 'src/common/logger/logger';
import { UserRegisteredEvent } from 'src/types/types';

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
        const raw = message.value?.toString() ?? '{}';
        const parsed: unknown = JSON.parse(raw);
        const payload = parsed as UserRegisteredEvent;

        logger.info({
          requestId: payload.requestId,
          msg: 'received kafka event',
          topic,
          email: payload.email,
        });

        console.log('Kafka event received:', topic);

        for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
          try {
            console.log(`Processing event. Attempt: ${attempt + 1}`);
            logger.info({
              requestId: payload.requestId,
              topic,
              attempt: attempt + 1,
              msg: 'processing kafka event',
            });

            await this.eventRouter.route(topic, payload);

            console.log('Event processed successfully');
            return;
          } catch (error) {
            console.error(`Attempt ${attempt + 1} failed`, error);

            if (attempt === RETRY_DELAYS.length) {
              console.error('Retries exhausted. Sending to DLQ');

              await this.dlqProducer.publish(topic, payload);

              return;
            }

            const baseDelay = RETRY_DELAYS[attempt];
            const jitter = Math.random() * 1000;
            const delay = baseDelay + jitter;

            console.log(`Retrying in ${delay}ms`);

            await this.sleep(delay);
          }
        }
      },
    });
  }
}
