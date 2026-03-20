import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { disconnectProducer } from 'src/kafka/kafka.producer';
import { shutdownTracing } from './observability/tracer';
// import { RedisService } if you have one

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(
    private prisma: PrismaService,
    // private redis: RedisService, // optional
  ) {}

  private isShuttingDown = false;

  async onApplicationShutdown(signal?: string) {
    if (this.isShuttingDown) return;

    this.isShuttingDown = true;
    console.log('🔥🔥 SHUTDOWN TRIGGERED 🔥🔥', signal);

    try {
      await this.prisma.$disconnect(); //close db

      await disconnectProducer(); //close kafka producer

      await shutdownTracing(); //flush tracing

      console.log('Auth Service shutdown complete');
    } catch (err) {
      console.error('Shutdown error:', err);
    }
  }
}
