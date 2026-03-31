import apiClient from "@/services/apiClient";
import { Session } from "./auth.types";
import { useAuth } from "../user/user.hooks";

export const login = async (data: { email: string; password: string }) => {
  return apiClient.post("/auth/login", data);
};

export const register = async (data: { email: string; password: string }) => {
  return apiClient.post("/auth/register", data);
};

export const getUserSessions = async (): Promise<Session[]> => {
  const res = await apiClient.get("/auth/sessions");
  return res.data?.sessions ?? [];
};

export const useCurrentSession = () => {
  const { data } = useAuth();
  return {
    data: data?.currentSessionId,
  };
};

export const logoutSession = async (sessionId: string) => {
  await apiClient.delete(`/auth/sessions/${sessionId}`);
};

export const logoutCurrentSession = async () => {
  await apiClient.delete(`/auth/sessions/current`);
};

export const logoutAllSessions = async () => {
  await apiClient.delete("/auth/sessions");
};
