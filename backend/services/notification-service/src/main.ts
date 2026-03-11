import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule, {
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['kafka:9092'],
      },
      consumer: {
        groupId: 'notification-consumer',
      },
    },
  });

  await app.listen();
}
bootstrap();
