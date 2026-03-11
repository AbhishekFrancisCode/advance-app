import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ['kafka:9092'],
});

export const producer = kafka.producer();

export async function connectProducer() {
  await producer.connect();
}

export async function publishUserRegisteredEvent(data: {
  userId: string;
  email: string;
  name: string;
}) {
  await producer.send({
    topic: 'user_registered',
    messages: [
      {
        value: JSON.stringify(data),
      },
    ],
  });
}
