/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Kafka } from 'kafkajs';
import { logger } from 'src/common/logger/logger';
import { getRequestId } from 'src/common/request-context';
import { context, propagation } from '@opentelemetry/api';
import { EventEnvelope } from 'src/types/event-envelope';
import { v4 as uuidv4 } from 'uuid';
import { UserRegisteredEvent } from 'src/types/events';

const kafka = new Kafka({
  clientId: 'auth-service',
  brokers: ['kafka:9092'],
});
export const producer = kafka.producer();
let isConnected: boolean = false;

export async function connectProducer() {
  await producer.connect();
  isConnected = true;
}

export async function disconnectProducer(): Promise<void> {
  try {
    await producer.disconnect();
    console.log('Kafka producer disconnected');
  } catch (err) {
    console.error('Error disconnecting Kafka producer:', err);
  }
}

export async function publishUserRegisteredEvent(data: {
  userId: string;
  email: string;
  name: string;
}) {
  if (!isConnected) {
    throw new Error('Kafka producer not connected');
  }
  const headers: Record<string, string> = {};
  const requestId = getRequestId() ?? uuidv4();

  const payload: UserRegisteredEvent = {
    userId: data.userId,
    email: data.email,
    name: data.name,
  };
  const envelope: EventEnvelope<UserRegisteredEvent> = {
    eventId: uuidv4(),
    eventType: 'USER_REGISTERED',
    requestId: requestId,
    timestamp: new Date().toISOString(),
    version: 1,
    payload,
  };
  // inject trace context
  propagation.inject(context.active(), headers);

  await producer.send({
    topic: 'user_registered',
    messages: [
      {
        value: JSON.stringify(envelope),
        headers,
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
