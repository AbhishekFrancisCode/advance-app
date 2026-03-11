import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { Transport } from '@nestjs/microservices';
import { startConsumer } from './kafka/kafka.consumer';
import { NotificationService } from './notification/notification.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule);
  const notificationService = app.get(NotificationService);
  await startConsumer(notificationService);

  await app.listen();
}
bootstrap();
