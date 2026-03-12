export interface DiscountNotificationEvent {
  userId: string;
  email: string;
  discountCode: string;
  percentage: number;
}
