import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka.service';
import { Producer } from 'kafkajs';
import { getRequestId } from 'src/common/request-context';
import { logger } from 'src/common/logger/logger';

@Injectable()
export class DlqProducer {
  private producer: Producer;
  private isConnected = false;

  constructor(private kafkaService: KafkaService) {
    this.producer = this.kafkaService.createProducer();
  }

  async publish(topic: string, payload: unknown) {
    console.error('dlqProducer', topic, payload);
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
    }

    const requestId = getRequestId();

    const event = {
      requestId,
      payload,
    };

    await this.producer.send({
      topic: `${topic}_dlq`,
      messages: [
        {
          value: JSON.stringify(event),
        },
      ],
    });
    logger.error({
      requestId,
      msg: 'event moved to DLQ',
      topic: `${topic}_dlq`,
    });
    console.log(`Event moved to DLQ: ${topic}_dlq`);
  }
}
