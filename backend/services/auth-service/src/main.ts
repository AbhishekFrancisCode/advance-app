import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { connectProducer } from './kafka/kafka.producer';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';

async function bootstrap() {
  const protoPath = join(process.cwd(), '../../proto/auth.proto');
  console.log('Proto path:', protoPath);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath: protoPath,
        url: '0.0.0.0:50051',
      },
    },
  );

  // register interceptor
  app.useGlobalInterceptors(new RequestIdInterceptor());

  // connect kafka producer
  await connectProducer();

  await app.listen();
}
bootstrap()
  .then(() => console.log('Auth Service started'))
  .catch((err) => {
    console.error('Bootstrap failed', err);
  });
