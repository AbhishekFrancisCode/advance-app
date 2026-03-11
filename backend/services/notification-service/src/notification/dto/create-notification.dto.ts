export interface CreateNotificationDto {
  userId: string;
  type: string;
  message: string;
  status: 'SUCCESS' | 'FAILED';
}
