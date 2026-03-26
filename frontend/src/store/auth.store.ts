import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,

  setAuthenticated: (value) => set({ isAuthenticated: value }),

  logout: () => {
    fetch("/auth/logout", {
      method: "POST",
      credentials: "include",
    }).finally(() => {
      set({ isAuthenticated: false });
      window.location.href = "/login";
    });
  },
}));