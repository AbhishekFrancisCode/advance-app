import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { initTracing } from './common/observability/tracer';

async function bootstrap() {
  const protoPath = join(process.cwd(), '../../proto/user.proto');
  console.log('Proto path:', protoPath);
  initTracing();
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
  app.enableShutdownHooks();
  // register interceptor
  app.useGlobalInterceptors(new RequestIdInterceptor());

  await app.listen();

  const shutdown = (signal: string) => {
    console.log(`🛑 ${signal} received`);

    void (async () => {
      try {
        await app.close();
      } finally {
        process.exit(0);
      }
    })();
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}
bootstrap()
  .then(() => console.log('User Service started'))
  .catch((err) => {
    console.error('Bootstrap failed', err);
  });
