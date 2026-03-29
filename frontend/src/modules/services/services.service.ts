

import apiClient from "@/services/apiClient";
import { Service } from "./services.types";

export const getServices = async (): Promise<Service[]> => {
  const res = await apiClient.get("/services/health");
  return res.data;
};