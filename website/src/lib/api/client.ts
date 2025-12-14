'use client';

import { API_CONFIG } from './config';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
  success: boolean;
}

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    if (!/^https?:\/\//i.test(this.baseUrl)) {
      this.baseUrl = 'http://localhost:8000/api';
    }
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && !this.token) {
      this.token = localStorage.getItem('token');
    }
    return this.token;
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean | undefined>): string {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          url.searchParams.append(key, String(value));
        }
      });
    }
    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const { params, ...fetchOptions } = options;
    const url = this.buildUrl(endpoint, params);

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers || {}),
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers,
      });

      let data: any;
      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        if (response.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            const ret = window.location.pathname + window.location.search;
            window.location.href = `/login?return=${encodeURIComponent(ret)}`;
          }
        }
        const err = new Error((data && data.message) || 'حدث خطأ ما');
        (err as any).status = response.status;
        (err as any).errors = data ? data.errors : null;
        throw err;
      }

      return {
        data,
        status: response.status,
        success: true,
      };
    } catch (error: any) {
      if (error && (error as any).status) {
        throw error as any;
      }
      const err = new Error('خطأ في الاتصال بالخادم');
      (err as any).status = 500;
      (err as any).errors = null;
      throw err;
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>) {
    return this.request<T>(endpoint, { method: 'GET', params });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestOptions) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // Upload file with FormData
  async upload<T>(endpoint: string, formData: FormData) {
    const url = this.buildUrl(endpoint);
    const headers: HeadersInit = {
      Accept: 'application/json',
    };

    const token = this.getToken();
    if (token) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }

    let response = await fetch(url, {
      method: 'POST',
      headers,
      body: formData,
    });

    let data: any = null;
    try {
      data = await response.json();
    } catch {}

    if (!response.ok) {
      if (response.status === 401) {
        this.setToken(null);
        if (typeof window !== 'undefined') {
          const ret = window.location.pathname + window.location.search;
          window.location.href = `/login?return=${encodeURIComponent(ret)}`;
        }
      }
      if (response.status === 404 && this.baseUrl.endsWith('/api')) {
        const altBase = this.baseUrl.slice(0, -4);
        const altUrl = new URL(`${altBase}${endpoint}`).toString();
        response = await fetch(altUrl, {
          method: 'POST',
          headers,
          body: formData,
        });
        try {
          data = await response.json();
        } catch {
          data = null;
        }
        if (!response.ok) {
          if (response.status === 401) {
            this.setToken(null);
            if (typeof window !== 'undefined') {
              const ret = window.location.pathname + window.location.search;
              window.location.href = `/login?return=${encodeURIComponent(ret)}`;
            }
          }
          const err = new Error((data && data.message) || 'حدث خطأ ما');
          (err as any).status = response.status;
          (err as any).errors = data ? data.errors : null;
          throw err;
        }
      } else {
        if (response.status === 401) {
          this.setToken(null);
          if (typeof window !== 'undefined') {
            const ret = window.location.pathname + window.location.search;
            window.location.href = `/login?return=${encodeURIComponent(ret)}`;
          }
        }
        const err = new Error((data && data.message) || 'حدث خطأ ما');
        (err as any).status = response.status;
        (err as any).errors = data ? data.errors : null;
        throw err;
      }
    }

    return {
      data,
      status: response.status,
      success: true,
    } as ApiResponse<T>;
  }
}

export const apiClient = new ApiClient();
export default apiClient;
