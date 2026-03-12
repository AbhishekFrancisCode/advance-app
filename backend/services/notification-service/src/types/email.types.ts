export interface WelcomeEmailPayload {
  email: string;
  name: string;
}

export interface DiscountEmailPayload {
  email: string;
  code: string;
  percentage: number;
}
