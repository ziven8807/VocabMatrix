// frontend/src/lib/axios.ts

import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { tokenManager } from "./tokenManager";

// 1. 定義型別:擴展請求配置,加入重試標記
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// 2. 定義型別:失敗隊列項目
interface RetryQueueItem {
  resolve: (token: string) => void;
  reject: (error: AxiosError) => void;
}

let isRefreshing = false;
let failedQueue: RetryQueueItem[] = [];

const processQueue = (
  error: AxiosError | null,
  token: string | null = null
) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else if (token) prom.resolve(token);
  });
  failedQueue = [];
};

// 建立 axios 實例
const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080"}/api`,
  withCredentials: true,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    const token = tokenManager.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    // 確保有 response 且 originalRequest 存在才繼續
    if (!error.response || !originalRequest) {
      return Promise.reject(error);
    }

    const status = error.response.status;
    const url = originalRequest.url || "";

    // 判斷是否為「認證相關」的 API
    const isCredentialsError =
      url.includes("/auth/") || url.includes("/user/password/change");

    // --- 無感刷新邏輯 ---
    // 只有在「401 錯誤」且「不是密碼錯誤等認證 API」且「尚未重試過」時執行
    if (status === 401 && !isCredentialsError && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      return new Promise((resolve, reject) => {
        api
          .post<{ accessToken: string }>("/auth/refresh", {})
          .then(({ data }) => {
            const newToken = data.accessToken;
            tokenManager.setToken(newToken);

            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            processQueue(null, newToken);
            resolve(api(originalRequest));
          })
          .catch((refreshError: AxiosError) => {
            processQueue(refreshError, null);
            tokenManager.clearToken();

            // 原本的登出邏輯
            window.dispatchEvent(
              new CustomEvent("showToast", {
                detail: {
                  message: "Session expired. Please login again.",
                  type: "warning",
                },
              })
            );

            setTimeout(() => {
              if (!window.location.pathname.includes("/auth/login")) {
                window.location.href = "/auth/login";
              }
            }, 1500);

            reject(refreshError);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

export default api;
