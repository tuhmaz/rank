import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';

export const authService = {
  // تسجيل الدخول
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response.data;
  },

  // إنشاء حساب جديد
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    if (response.data.token) {
      apiClient.setToken(response.data.token);
    }
    return response.data;
  },

  // تسجيل الخروج
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    apiClient.setToken(null);
  },

  // جلب بيانات المستخدم الحالي
  async me(): Promise<User> {
    const response = await apiClient.get<{ user: User }>(API_ENDPOINTS.AUTH.ME);
    return response.data.user;
  },

  // نسيت كلمة المرور
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  // إعادة تعيين كلمة المرور
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  // إعادة إرسال رابط التحقق
  async resendVerifyEmail(): Promise<{ message: string }> {
    const response = await apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.RESEND_VERIFY
    );
    return response.data;
  },

  // الحصول على رابط تسجيل الدخول بجوجل
  async getGoogleRedirectUrl(): Promise<{ url: string }> {
    const response = await apiClient.get<{ url: string }>(
      API_ENDPOINTS.AUTH.GOOGLE_REDIRECT
    );
    return response.data;
  },
};

export default authService;
