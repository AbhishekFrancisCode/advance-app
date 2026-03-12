export interface KafkaEventHandler<T = any> {
  handle(data: T): Promise<void>;
}
