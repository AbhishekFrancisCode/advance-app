export interface EventEnvelope<T> {
  eventId: string;
  eventType: string;
  requestId: string;
  timestamp: string;
  version: number;
  payload: T;
}
