import axios, { AxiosError } from 'axios';
import type { InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ─────────────────────────────────────────────
// Request interceptor: yalnız Bearer token
// ─────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─────────────────────────────────────────────
// Refresh token queue məntiqi
// ─────────────────────────────────────────────
let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

function addRefreshSubscriber(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

// ─────────────────────────────────────────────
// Response interceptor: 401 → refresh → retry
// ─────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && original && !original._retry) {
      original._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const storedRefreshToken = localStorage.getItem('refreshToken');
          if (!storedRefreshToken) throw new Error('Refresh token yoxdur');

          // ✅ Swagger: POST /auth/refresh → { refresh_token: string }
          const { data } = await axios.post(
            `${API_BASE_URL}/auth/refresh`,
            { refresh_token: storedRefreshToken },
            { headers: { 'Content-Type': 'application/json' } }
          );          
          const newAccessToken: string = data.data.access_token;

          localStorage.setItem('accessToken', newAccessToken);

          onRefreshed(newAccessToken);

          original.headers.Authorization = `Bearer ${newAccessToken}`;
          return apiClient(original);
        } catch {
          // Refresh uğursuz → logout
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login';
          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Başqa sorğular refresh bitənə qədər gözləyir
      return new Promise((resolve) => {
        addRefreshSubscriber((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(original));
        });
      });
    }

    return Promise.reject(normalizeError(error));
  }
);

// ─────────────────────────────────────────────
// Error normallaşdırma
// ─────────────────────────────────────────────
export interface AppError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}

function normalizeError(error: AxiosError): AppError {
  if (!error.response) {
    return {
      message: 'İnternet bağlantısı yoxdur',
      code: 'NETWORK_ERROR',
      status: 0,
    };
  }
  const { data, status } = error.response;
  return {
    message: (data as any)?.message || 'Xəta baş verdi',
    code: (data as any)?.code || 'UNKNOWN_ERROR',
    status,
    details: (data as any)?.details,
  };
}
