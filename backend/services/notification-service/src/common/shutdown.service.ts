import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { shutdownTracing } from './observability/tracer';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(private prisma: PrismaService) {}
  private isShuttingDown = false;

  async onApplicationShutdown(signal?: string) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    console.log('🔥🔥 SHUTDOWN TRIGGERED Notify🔥🔥', signal);
    try {
      await this.prisma.$disconnect();

      await shutdownTracing();

      console.log('Notification Service shutdown complete');
    } catch (err) {
      console.error('Shutdown error:', err);
    }
  }
}
