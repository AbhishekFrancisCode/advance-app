import 'reflect-metadata';

export const KAFKA_EVENT = 'KAFKA_EVENT';

export function KafkaEvent(event: string) {
  return function (target: any) {
    Reflect.defineMetadata(KAFKA_EVENT, event, target);
  };
}
