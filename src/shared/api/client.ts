import axios, { AxiosError } from 'axios';
import type {  InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000, // 15 saniyə timeout
  headers: {
    'Content-Type': 'application/json',
  },
});


apiClient.interceptors.request.use(
  (config) => {
    // 1. Token əlavə et (authentication)
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // 2. Business ID əlavə et (multi-tenant)
    const businessId = localStorage.getItem('active_business_id');
    if (businessId) {
      config.headers['X-Business-Id'] = businessId;
    }

    return config;
  },
  (error) => {
    // Request qurarkən xəta (nadir hal)
    return Promise.reject(error);
  }
);


let isRefreshing = false; 
let refreshSubscribers: Array<(token: string) => void> = [];

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}
function addRefreshSubscriber(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

apiClient.interceptors.response.use(
  // ✅ Success response (200-299)
  (response) => {
    return response;
  },

  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // ──────────────────────────────────────────────────────
    // 401 Unauthorized → Token expired, refresh lazımdır
    // ──────────────────────────────────────────────────────
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true; // Sonsuz loop qarşısını al

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          // Token refresh endpoint-inə sorğu göndər
          const refreshToken = localStorage.getItem('refreshToken');
          
          if (!refreshToken) {
            throw new Error('No refresh token available');
          }

          const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          // Yeni token-ləri saxla
          localStorage.setItem('accessToken', data.accessToken);
          localStorage.setItem('refreshToken', data.refreshToken);

          // Queue-dakı bütün sorğuları yeni token ilə retry et
          onRefreshed(data.accessToken);

          // Orijinal sorğunu yeni token ilə təkrarla
          originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Token refresh uğursuz (403, 401...) → logout
          localStorage.clear();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
      return new Promise((resolve, reject) => {
        addRefreshSubscriber((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    if (error.response?.status === 403) {
      localStorage.clear();
      window.location.href = '/login';
    }


    return Promise.reject(normalizeError(error));
  }
);


function normalizeError(error: AxiosError): AppError {
  // Network error (internet yoxdur)
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


export interface AppError {
  message: string;
  code: string;
  status: number;
  details?: Record<string, unknown>;
}
