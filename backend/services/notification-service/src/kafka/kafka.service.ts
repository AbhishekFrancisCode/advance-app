import { Injectable } from '@nestjs/common';
import { Kafka } from 'kafkajs';
import { KafkaConfig } from './kafka.config';

@Injectable()
export class KafkaService {
  private kafka: Kafka;

  constructor() {
    this.kafka = new Kafka({
      clientId: KafkaConfig.clientId,
      brokers: KafkaConfig.brokers,
    });
  }

  getKafka(): Kafka {
    return this.kafka;
  }

  createConsumer(groupId: string) {
    return this.kafka.consumer({ groupId });
  }

  createProducer() {
    return this.kafka.producer();
  }
}
