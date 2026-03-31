import apiClient from "@/services/apiClient";
import { Session } from "./auth.types";

export const login = async (data: { email: string; password: string }) => {
  return apiClient.post("/auth/login", data);
};

export const register = async (data: { email: string; password: string }) => {
  return apiClient.post("/auth/register", data);
};

export const getUserSessions = async (): Promise<Session[]> => {
  const res = await apiClient.get("/auth/sessions");
  return res.data.sessions;
};
