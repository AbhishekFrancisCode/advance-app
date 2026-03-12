import { Injectable } from '@nestjs/common';
import { KafkaService } from '../kafka.service';
import { Producer } from 'kafkajs';

@Injectable()
export class DlqProducer {
  private producer: Producer;
  private isConnected = false;

  constructor(private kafkaService: KafkaService) {
    this.producer = this.kafkaService.createProducer();
  }

  async publish(topic: string, payload: unknown) {
    if (!this.isConnected) {
      await this.producer.connect();
      this.isConnected = true;
    }

    await this.producer.send({
      topic: `${topic}_dlq`,
      messages: [
        {
          value: JSON.stringify(payload),
        },
      ],
    });

    console.log(`Event moved to DLQ: ${topic}_dlq`);
  }
}
