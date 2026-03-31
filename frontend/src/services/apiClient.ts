/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { baseURL } from "@/config/config";
import { logout } from "@/utils/sessions";

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (reason?: any) => void;
}[] = [];

let isLoggingOut = false;
let isLoggedOut = false;

export const setLoggingOut = (value: boolean) => {
  isLoggingOut = value;

  if (value) {
    isLoggedOut = true;
  }
};

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve();
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true, // ✅ cookies only
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !isRefreshCall) {
      if (isLoggedOut || isLoggingOut) {
        console.log("Blocked refresh (user logged out)");
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      /**
       * 🚨 If refresh already in progress → queue
       */
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(apiClient(originalRequest)),
            reject: (err: any) => reject(err),
          });
        });
      }

      isRefreshing = true;

      try {
        /**
         * 🔥 CALL REFRESH (cookie-based)
         */
        await apiClient.post("/auth/refresh");

        /**
         * 🔥 Process queue (no token needed)
         */
        processQueue(null);

        /**
         * 🔥 Retry original request (cookie will be auto-updated)
         */
        await new Promise((resolve) => setTimeout(resolve, 50));
        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);
        logout();
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;