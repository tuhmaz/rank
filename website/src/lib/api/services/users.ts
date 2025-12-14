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
  profile_photo?: File;
}

export const usersService = {
  /**
   * Get all users with optional filters
   */
  async getAll(filters?: UserFilters): Promise<User[]> {
    const response = await apiClient.get<{ data: User[] }>(
      API_ENDPOINTS.USERS.LIST,
      filters
    );
    return response.data;
  },

  /**
   * Get single user by ID
   */
  async getById(id: number | string): Promise<User> {
    const response = await apiClient.get<{ data: User }>(
      API_ENDPOINTS.USERS.SHOW(id)
    );
    return response.data;
  },

  /**
   * Create new user
   */
  async create(data: CreateUserData): Promise<User> {
    const response = await apiClient.post<{ data: User }>(
      API_ENDPOINTS.USERS.STORE,
      data
    );
    return response.data;
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
      return response.data;
    }

    const response = await apiClient.put<{ data: User }>(
      API_ENDPOINTS.USERS.UPDATE(id),
      data
    );
    return response.data;
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
    return response.data;
  },

  /**
   * Delete user
   */
  async delete(id: number | string): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.USERS.DELETE(id));
  },

  /**
   * Bulk delete users
   */
  async bulkDelete(userIds: number[]): Promise<{ deleted: number; errors: string[] }> {
    const response = await apiClient.post<{ data: { deleted: number; errors: string[] } }>(
      API_ENDPOINTS.USERS.BULK_DELETE,
      { user_ids: userIds }
    );
    return response.data;
  },
};

export default usersService;
