import { Controller, Get } from '@nestjs/common';
import { KafkaHealthService } from '../kafka/kafka.health';

@Controller()
export class HealthController {
  constructor(private readonly kafkaHealth: KafkaHealthService) {}

  @Get('/health')
  health() {
    return {
      status: 'ok',
      service: 'notification-service',
    };
  }

  @Get('/ready')
  async readiness() {
    const kafkaHealthy = await this.kafkaHealth.isKafkaHealthy();

    return {
      status: kafkaHealthy ? 'ready' : 'not_ready',
      service: 'notification-service',
      checks: {
        kafka: kafkaHealthy ? 'up' : 'down',
      },
    };
  }
}
