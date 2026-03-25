export interface Service {
  name: string;
  status: "UP" | "DOWN";
  responseTime: number;
}