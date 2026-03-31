import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getUserSessions,
  login,
  logoutAllSessions,
  logoutCurrentSession,
  logoutSession,
  register,
} from "./auth.services";
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

export const useLogoutSession = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: logoutSession,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
    },
  });
};

export const useLogoutCurrentSession = () => {
  return useMutation({
    mutationFn: logoutCurrentSession,
    onSuccess: () => {},
  });
};

export const useLogoutAllSessions = () => {
  return useMutation({
    mutationFn: logoutAllSessions,
  });
};
