export enum KafkaEvents {
  USER_REGISTERED = 'user_registered',
  DISCOUNT_NOTIFICATION = 'discount_notification',
}

export enum KafkaDLQEvents {
  USER_REGISTERED_DLQ = 'user_registered_dlq',
  DISCOUNT_NOTIFICATION_DLQ = 'discount_notification_dlq',
}
