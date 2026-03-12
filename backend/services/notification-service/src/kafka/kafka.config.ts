export const KafkaConfig = {
  clientId: 'notification-service',
  dlqClientid: 'notification-service-dlq',
  brokers: ['kafka:9092'],

  consumerGroups: {
    NOTIFICATION: 'notification-group',
    DLQ: 'notification-dlq-group',
  },
};
