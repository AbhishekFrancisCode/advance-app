export interface UserRegisteredEvent {
  requestId?: string;
  userId: string;
  email: string;
  name: string;
}
