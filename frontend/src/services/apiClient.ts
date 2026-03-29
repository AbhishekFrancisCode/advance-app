/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { baseURL } from "@/config/config";
import { logout } from "@/utils/sessions";
import { URL_PATHS } from "@/utils/constants";

let isRefreshing = false;

let failedQueue: {
  resolve: (value?: unknown) => void;
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
    else prom.resolve(null);
  });
  failedQueue = [];
};

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const isRefreshCall = originalRequest?.url?.includes("/auth/refresh");

    if (error.response?.status === 401 && !isRefreshCall) {
      if (isLoggedOut) {
        console.log("Blocked refresh (user logged out)");
        return Promise.reject(error);
      }
      if (isLoggingOut) {
        console.log("Blocked refresh (user logged out)");
        return Promise.reject(error);
      }

      if (originalRequest._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      isRefreshing = true;

      try {
        await axios.post(
          `${baseURL}auth/refresh`,
          {},
          { withCredentials: true },
        );
        processQueue(null);

        return apiClient(originalRequest);
      } catch (err) {
        processQueue(err);
        logout();
        window.location.href = URL_PATHS.LOGIN;
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }
    console.error(error?.response?.data || error.message);
    return Promise.reject(error);
  },
);

export default apiClient;
