import apiClient from "@/services/apiClient";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  return apiClient.post("/auth/login", data);
};

export const register = async (data: {
  email: string;
  password: string;
}) => {
  return apiClient.post("/auth/register", data);
};