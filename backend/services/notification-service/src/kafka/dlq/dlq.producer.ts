import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka.service';
import { Producer } from 'kafkajs';
import { getRequestId } from 'src/common/request-context';
import { logger } from 'src/common/logger/logger';
import { v4 as uuidv4 } from 'uuid';
import { EventEnvelope } from 'src/types/event-envelope';

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

    const requestId = getRequestId() ?? uuidv4();

    const envelope: EventEnvelope<unknown> = {
      eventId: uuidv4(),
      eventType: `${topic}_dlq`,
      requestId: requestId,
      timestamp: new Date().toISOString(),
      version: 1,
      payload,
    };

    logger.info({
      msg: 'publishing event',
      envelope,
    });

    await this.producer.send({
      topic: `${topic}_dlq`,
      messages: [
        {
          value: JSON.stringify(envelope),
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
