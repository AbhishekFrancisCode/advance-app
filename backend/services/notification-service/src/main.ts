import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { RequestIdInterceptor } from './common/interceptors/request-id.interceptor';
import { initTracing } from './common/observability/tracer';

async function bootstrap() {
  const protoPath = join(process.cwd(), '../../proto/notification.proto');
  console.log('Proto path:', protoPath);

  // Start OpenTelemetry
  initTracing();

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.GRPC,
      options: {
        package: 'notification',
        protoPath: protoPath,
        url: '0.0.0.0:50053',
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
        await app.close(); // triggers OnApplicationShutdown
      } catch (err) {
        console.error('Shutdown error:', err);
      } finally {
        process.exit(0);
      }
    })();
  };
  process.on('SIGINT', shutdown);
}
bootstrap()
  .then(() => console.log('Notification Service started'))
  .catch((err) => {
    console.error('Bootstrap failed', err);
  });
