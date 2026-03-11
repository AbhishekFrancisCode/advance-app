import { Kafka } from 'kafkajs';
import { sendWelcomeEmail } from 'src/email/email.service';
import { NotificationService } from 'src/notification/notification.service';
import { UserRegisteredEvent } from 'src/types/types';

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: ['kafka:9092'],
});

const consumer = kafka.consumer({
  groupId: 'notification-group',
});

export async function startConsumer(notificationService: NotificationService) {
  await consumer.connect();

  await consumer.subscribe({
    topic: 'user_registered',
  });

  await consumer.run({
    eachMessage: async ({ topic, message }) => {
      const data = JSON.parse(message.value!.toString()) as UserRegisteredEvent;

      console.log('User Registered Event Received:', data, topic);

      /**
       * Send welcome email
       */
      await sendWelcomeEmail({
        email: data.email,
        name: data.name,
      });

      /**
       * Save notification log
       */
      try {
        await notificationService.handleUserRegistered(
          data.userId,
          data.email,
          data.name,
        );
      } catch (err) {
        console.error('Notification failed', err);
      }
    },
  });
}
