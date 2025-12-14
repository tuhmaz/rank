import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Role, Permission } from '@/types';

interface RoleFormData {
  name: string;
  permissions?: number[];
}

export const rolesService = {
  /**
   * Get all roles with users count
   */
  async getAll(): Promise<Role[]> {
    const response = await apiClient.get<{ data: Role[] }>(
      API_ENDPOINTS.ROLES.LIST
    );
    return response.data;
  },

  /**
   * Get single role by ID with permissions
   */
  async getById(id: number | string): Promise<Role> {
    const response = await apiClient.get<{ data: Role }>(
      API_ENDPOINTS.ROLES.SHOW(id)
    );
    return response.data;
  },

  /**
   * Create new role with permissions
   */
  async create(data: RoleFormData): Promise<Role> {
    const response = await apiClient.post<{ data: Role }>(
      API_ENDPOINTS.ROLES.STORE,
      data
    );
    return response.data;
  },

  /**
   * Update role and sync permissions
   */
  async update(id: number | string, data: RoleFormData): Promise<Role> {
    const response = await apiClient.put<{ data: Role }>(
      API_ENDPOINTS.ROLES.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Delete role
   */
  async delete(id: number | string): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.ROLES.DELETE(id));
  },

  /**
   * Get all available permissions
   */
  async getPermissions(): Promise<Permission[]> {
    const response = await apiClient.get<{ data: Permission[] }>(
      API_ENDPOINTS.ROLES.PERMISSIONS
    );
    return response.data;
  },
};

export default rolesService;
