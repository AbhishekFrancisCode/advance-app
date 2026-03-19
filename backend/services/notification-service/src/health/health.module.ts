import { Module } from '@nestjs/common';
import { KafkaModule } from 'src/kafka/kafka.module';
import { HealthController } from './health.controller';
import { KafkaHealthService } from 'src/kafka/kafka.health';

@Module({
  imports: [KafkaModule],
  controllers: [HealthController],
  providers: [KafkaHealthService],
})
export class HealthModule {}
