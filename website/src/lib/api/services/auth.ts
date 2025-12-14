import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { User, LoginCredentials, RegisterData, AuthResponse } from '@/types';

export const authService = {
  /**
   * Login user with credentials
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse | { data: AuthResponse }>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    const payload = 'data' in response.data ? (response.data as { data: AuthResponse }).data : (response.data as AuthResponse);
    if (payload.token) {
      apiClient.setToken(payload.token);
    }
    return payload;
  },

  /**
   * Register new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiClient.post<AuthResponse | { data: AuthResponse }>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    const payload = 'data' in response.data ? (response.data as { data: AuthResponse }).data : (response.data as AuthResponse);
    if (payload.token) {
      apiClient.setToken(payload.token);
    }
    return payload;
  },

  /**
   * Logout current user
   */
  async logout(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);
    apiClient.setToken(null);
  },

  /**
   * Get current authenticated user
   */
  async me(): Promise<User> {
    const response = await apiClient.get<{ data: { user: User } }>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.data.user;
  },

  /**
   * Send forgot password email
   */
  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ data: { message: string } }>(
      API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
      { email }
    );
    return response.data;
  },

  /**
   * Reset password with token
   */
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<{ message: string }> {
    const response = await apiClient.post<{ data: { message: string } }>(
      API_ENDPOINTS.AUTH.RESET_PASSWORD,
      data
    );
    return response.data;
  },

  /**
   * Verify email with link parameters
   */
  async verifyEmail(id: string, hash: string): Promise<{ message: string }> {
    const response = await apiClient.get<{ data: { message: string } }>(
      API_ENDPOINTS.AUTH.VERIFY_EMAIL(id, hash)
    );
    return response.data;
  },

  /**
   * Resend verification email
   */
  async resendVerifyEmail(): Promise<{ message: string }> {
    const response = await apiClient.post<{ data: { message: string } }>(
      API_ENDPOINTS.AUTH.RESEND_VERIFY
    );
    return response.data;
  },

  /**
   * Get Google OAuth redirect URL
   */
  getGoogleRedirectUrl(): string {
    return `${API_ENDPOINTS.AUTH.GOOGLE_REDIRECT}`;
  },

  /**
   * Handle Google OAuth callback
   */
  async handleGoogleCallback(code: string): Promise<AuthResponse> {
    const response = await apiClient.get<AuthResponse | { data: AuthResponse }>(
      API_ENDPOINTS.AUTH.GOOGLE_CALLBACK,
      { code }
    );
    const payload = 'data' in response.data ? (response.data as { data: AuthResponse }).data : (response.data as AuthResponse);
    if (payload.token) {
      apiClient.setToken(payload.token);
    }
    return payload;
  },
};

export default authService;
