import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  private isShuttingDown = false;
  constructor(private prisma: PrismaService) {}

  async onApplicationShutdown(signal?: string) {
    if (this.isShuttingDown) return;
    this.isShuttingDown = true;
    console.log('🔥 SHUTDOWN TRIGGERED USER', signal);

    try {
      await this.prisma.$disconnect();

      // await shutdownTracing();

      console.log('User Service shutdown complete');
    } catch (err) {
      console.error('Shutdown error:', err);
    }
  }
}
