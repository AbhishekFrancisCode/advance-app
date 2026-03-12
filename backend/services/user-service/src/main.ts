import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const protoPath = join(process.cwd(), '../../proto/user.proto');
  console.log('Proto path:', protoPath);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'user',
        protoPath: protoPath,
        url: '0.0.0.0:50052',
      },
    },
  );

  await app.listen();
}
bootstrap()
  .then(() => console.log('User Service started'))
  .catch((err) => {
    console.error('Bootstrap failed', err);
  });
