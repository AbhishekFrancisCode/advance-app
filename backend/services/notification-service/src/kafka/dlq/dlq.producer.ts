import { Kafka } from 'kafkajs';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092'],
});

const producer = kafka.producer();

export async function publishToDLQ(topic: string, payload: unknown) {
  await producer.connect();

  await producer.send({
    topic: `${topic}_dlq`,
    messages: [
      {
        value: JSON.stringify(payload),
      },
    ],
  });

  console.log(`Event moved to DLQ: ${topic}_dlq`);
}
