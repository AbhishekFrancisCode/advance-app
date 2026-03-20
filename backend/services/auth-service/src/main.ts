import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { join } from 'path';
import { connectProducer } from './kafka/kafka.producer';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { initTracing } from './common/observability/tracer';

async function bootstrap() {
  const protoPath = join(process.cwd(), '../../proto/auth.proto');

  initTracing();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'auth',
        protoPath,
        url: '0.0.0.0:50051',
      },
    },
  );

  app.enableShutdownHooks();

  app.useGlobalInterceptors(new RequestIdInterceptor());

  await connectProducer().catch((err) => {
    console.error('Kafka connection failed:', err);
  });

  await app.listen();

  // 🔥 CRITICAL ADDITION
  const shutdown = (signal: string) => {
    console.log(`🛑 ${signal} received`);

    void (async () => {
      try {
        await app.close(); // triggers OnApplicationShutdown
      } catch (err) {
        console.error('Shutdown error:', err);
      } finally {
        process.exit(0);
      }
    })();
  };

  process.once('SIGTERM', shutdown);
  process.once('SIGINT', shutdown);
}
bootstrap()
  .then(() => console.log('Auth Service started'))
  .catch((err) => {
    console.error('Bootstrap failed', err);
  });
