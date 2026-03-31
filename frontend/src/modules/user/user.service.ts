import apiClient from "@/services/apiClient";

export const getUserMe = async () => {
  const res = await apiClient.get("/users/me");
  return res.data;
};
