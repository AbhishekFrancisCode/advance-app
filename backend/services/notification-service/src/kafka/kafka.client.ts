import { Kafka, KafkaConfig } from 'kafkajs';

const kafkaConfig: KafkaConfig = {
  clientId: 'auth-service',
  brokers: ['kafka:9092'],
};

export const kafka = new Kafka(kafkaConfig);
