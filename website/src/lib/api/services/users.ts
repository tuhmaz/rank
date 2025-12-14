import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { User, PaginatedResponse, Role } from '@/types';

interface UserFilters {
  page?: number;
  per_page?: number;
  search?: string;
  role?: string;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  role?: string;
  roles?: number[];
}

interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
  password_confirmation?: string;
  role?: string;
  roles?: number[];
  status?: string;
}

export const usersService = {
  // جلب قائمة المستخدمين
  async getAll(filters?: UserFilters): Promise<PaginatedResponse<User>> {
    const response = await apiClient.get<PaginatedResponse<User>>(
      API_ENDPOINTS.DASHBOARD.USERS.LIST,
      filters
    );
    return response.data;
  },

  // جلب بيانات إنشاء مستخدم (الأدوار المتاحة)
  async getCreateData(): Promise<{ roles: Role[] }> {
    const response = await apiClient.get<{ roles: Role[] }>(
      API_ENDPOINTS.DASHBOARD.USERS.CREATE
    );
    return response.data;
  },

  // جلب مستخدم واحد
  async getById(id: number | string): Promise<User> {
    const response = await apiClient.get<{ user: User }>(
      API_ENDPOINTS.DASHBOARD.USERS.SHOW(id)
    );
    return response.data.user;
  },

  // جلب بيانات تعديل مستخدم
  async getEditData(id: number | string): Promise<{ user: User; roles: Role[] }> {
    const response = await apiClient.get<{ user: User; roles: Role[] }>(
      API_ENDPOINTS.DASHBOARD.USERS.EDIT(id)
    );
    return response.data;
  },

  // إنشاء مستخدم جديد
  async create(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<{ user: User }>(
      API_ENDPOINTS.DASHBOARD.USERS.STORE,
      data
    );
    return response.data.user;
  },

  // تحديث مستخدم
  async update(id: number | string, data: UpdateUserData): Promise<User> {
    const response = await apiClient.put<{ user: User }>(
      API_ENDPOINTS.DASHBOARD.USERS.UPDATE(id),
      data
    );
    return response.data.user;
  },

  // حذف مستخدم
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.USERS.DELETE(id));
  },
};

export default usersService;
