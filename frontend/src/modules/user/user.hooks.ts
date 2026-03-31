import { useQuery } from "@tanstack/react-query";
import { getUserMe } from "./user.service";

export const useAuth = () => {
  return useQuery({
    queryKey: ["auth"], // 💀 shared cache
    queryFn: getUserMe,
    retry: false,
  });
};
