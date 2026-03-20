import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { shutdownTracing } from './observability/tracer';

@Injectable()
export class ShutdownService implements OnApplicationShutdown {
  constructor(private prisma: PrismaService) {}

  async onApplicationShutdown(signal?: string) {
    console.log('🔥🔥 SHUTDOWN TRIGGERED Notify🔥🔥', signal);

    await this.prisma.$disconnect();

    await shutdownTracing();

    console.log('Notification Service shutdown complete');
  }
}
