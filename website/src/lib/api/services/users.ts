import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { User, Role, Permission } from '@/types';

interface UserFilters {
  role?: string;
  search?: string;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role: string;
}

interface UpdateUserData {
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  profile_photo?: File;
}

export const usersService = {
  /**
   * Get all users with optional filters
   */
  async getAll(filters?: UserFilters): Promise<User[]> {
    try {
      const response = await apiClient.get<{ data: User[] }>(
        API_ENDPOINTS.USERS.LIST,
        filters as Record<string, string | number | boolean | undefined> | undefined
      );
      return (response.data as any).data ?? (response.data as any);
    } catch (e: any) {
      if (e && e.status === 404) {
        const response2 = await apiClient.get<{ data: User[] }>(
          '/dashboard/users',
          filters as Record<string, string | number | boolean | undefined> | undefined
        );
        return (response2.data as any).data ?? (response2.data as any);
      }
      throw e;
    }
  },

  /**
   * Get single user by ID
   */
  async getById(id: number | string): Promise<User> {
    try {
      const response = await apiClient.get<{ data: User }>(
        API_ENDPOINTS.USERS.SHOW(id)
      );
      return (response.data as any).data ?? (response.data as any);
    } catch (e: any) {
      if (e && e.status === 404) {
        const response2 = await apiClient.get<{ data: User }>(
          `/dashboard/users/${id}`
        );
        return (response2.data as any).data ?? (response2.data as any);
      }
      throw e;
    }
  },

  /**
   * Create new user
   */
  async create(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<{ data: User }>(
      API_ENDPOINTS.USERS.STORE,
      data
    );
    return (response.data as any).data ?? (response.data as any);
  },

  /**
   * Update user (with optional profile photo upload)
   */
  async update(id: number | string, data: UpdateUserData): Promise<User> {
    if (data.profile_photo) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          if (value instanceof File) {
            formData.append(key, value);
          } else {
            formData.append(key, String(value));
          }
        }
      });
      const response = await apiClient.upload<{ data: User }>(
        API_ENDPOINTS.USERS.UPDATE(id),
        formData
      );
      return (response.data as any).data ?? (response.data as any);
    }

    const response = await apiClient.put<{ data: User }>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return (response.data as any).data ?? (response.data as any);
  },

  /**
   * Update user roles and permissions
   */
  async updateRolesPermissions(
    id: number | string,
    data: { roles?: string[]; permissions?: string[] }
  ): Promise<User> {
    const response = await apiClient.put<{ data: User }>(
      API_ENDPOINTS.USERS.UPDATE_ROLES(id),
      data
    );
    return (response.data as any).data ?? (response.data as any);
  },

  /**
   * Delete user
   */
  async delete(id: number | string): Promise<{ message: string }> {
    const resp = await apiClient.delete<{ message: string }>(API_ENDPOINTS.USERS.DELETE(id));
    return (resp.data as any).data ?? (resp.data as any);
  },

  /**
   * Bulk delete users
   */
  async bulkDelete(userIds: number[]): Promise<{ deleted: number; errors: string[] }> {
    const response = await apiClient.post<{ data: { deleted: number; errors: string[] } }>(
      API_ENDPOINTS.USERS.BULK_DELETE,
      { user_ids: userIds }
    );
    return (response.data as any).data ?? (response.data as any);
  },
};

export default usersService;
