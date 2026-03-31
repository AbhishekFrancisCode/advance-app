import { setLoggingOut } from "@/services/apiClient";
import { URL_PATHS } from "./constants";
import { useAuthStore } from "@/store/auth.store";
import { logoutCurrentSession } from "@/modules/auth/auth.services";

export const logout = async () => {
  setLoggingOut(true);

  try {
     await logoutCurrentSession(); 
  } catch (e) {
    console.error("Logout failed (ignored)", e);
  } finally {
    // useAuthStore.getState().setAuthenticated(false);
    // setLoggingOut(false);
    window.location.href = URL_PATHS.LOGIN;
  }
};