import { Injectable, Logger } from '@nestjs/common';
import { KafkaService } from './kafka.service';

@Injectable()
export class KafkaHealthService {
  private readonly logger = new Logger(KafkaHealthService.name);

  constructor(private readonly kafkaService: KafkaService) {}

  async isKafkaHealthy(): Promise<boolean> {
    try {
      const admin = this.kafkaService.getKafka().admin();

      await admin.connect();

      await admin.fetchTopicMetadata(); // 🔥 real check

      await admin.disconnect();

      return true;
    } catch (error) {
      this.logger.error('Kafka health check failed', error);
      return false;
    }
  }
}
