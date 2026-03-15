import { Kafka } from 'kafkajs';
import { logger } from 'src/common/logger/logger';
import { getRequestId } from 'src/common/request-context';

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
  const requestId = getRequestId();

  const event = {
    requestId,
    ...data,
  };
  await producer.send({
    topic: 'user_registered',
    messages: [
      {
        value: JSON.stringify(event),
      },
    ],
  });
  logger.info({
    msg: 'published user_registered event',
    requestId,
    userId: data.userId,
    email: data.email,
  });
}
