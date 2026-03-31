import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserSessions, login, register } from "./auth.services";
import { Session } from "./auth.types";

export const useLogin = () => {
  return useMutation({
    mutationFn: login,
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: register,
  });
};

export const useSessions = () => {
  return useQuery<Session[]>({
    queryKey: ["sessions"],
    queryFn: getUserSessions,
  });
};
