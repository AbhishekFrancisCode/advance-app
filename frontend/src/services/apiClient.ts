/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosRequestConfig } from "axios";
import { baseURL } from "@/config/config";
import { logout } from "@/utils/sessions";
import { URL_PATHS } from "@/utils/constants";

const apiClient = (() => {
  const api = axios.create({
    baseURL: baseURL,
    withCredentials: true,
    timeout: 10000,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  //request interceptor (no token needed for cookie auth)
  api.interceptors.request.use(
    (config) => {
      return config;
    },
    (error) => Promise.reject(error)
  );

  //response interceptor (refresh token logic)
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest: AxiosRequestConfig & { _retry?: boolean } =
        error.config || {};

      if (
        error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes("/auth/refresh-token")
      ) {
        originalRequest._retry = true;

        try {
          //call refresh endpoint (cookies sent automatically)
          await axios.post(
            `${baseURL}auth/refresh-token`,
            {},
            { withCredentials: true }
          );

          //retry original request
          return api(originalRequest);
        } catch (err) {
          logout();
          window.location.href = URL_PATHS.LOGIN;
          return Promise.reject(err);
        }
      }

      console.error(error?.response?.data || error.message);
      return Promise.reject(error);
    }
  );

  //API methods
  const get = async (path: string) => {
    const res = await api.get(path);
    return res.data;
  };

  const post = async (path: string, data: any) => {
    const res = await api.post(path, data);
    return res.data;
  };

  const patch = async (path: string, data: any) => {
    const res = await api.patch(path, data);
    return res.data;
  };

  const put = async (path: string, data: any) => {
    const res = await api.put(path, data);
    return res.data;
  };

  const del = async (path: string) => {
    const res = await api.delete(path);
    return res.data;
  };

  return { get, post, patch, put, del };
})();

export default apiClient;