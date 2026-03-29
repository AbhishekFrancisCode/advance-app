import apiClient, { setLoggingOut } from "@/services/apiClient";
import { URL_PATHS } from "./constants";
import { useAuthStore } from "@/store/auth.store";

export const logout = async () => {
  setLoggingOut(true);

  try {
    await apiClient.post("/auth/logout");
  } catch (e) {
    console.error("Logout failed (ignored)", e);
  } finally {
    useAuthStore.getState().setAuthenticated(false);
    setLoggingOut(false);
    window.location.href = URL_PATHS.LOGIN;
  }
};