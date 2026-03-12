import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AppModule);
  await app.listen();
}
bootstrap()
  .then(() => console.log('Notification Service started'))
  .catch((err) => {
    console.error('Bootstrap failed', err);
  });
