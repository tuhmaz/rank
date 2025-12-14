import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Category, PaginatedResponse } from '@/types';

interface CategoryFilters {
  country?: string;
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}

interface CategoryFormData {
  country: string;
  name: string;
  description?: string;
  parent_id?: number;
  image?: File;
  is_active?: boolean;
}

export const categoriesService = {
  /**
   * Get all categories with optional filters
   */
  async getAll(filters?: CategoryFilters): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get<PaginatedResponse<Category>>(
      API_ENDPOINTS.CATEGORIES.LIST,
      filters
    );
    return response;
  },

  /**
   * Get single category by ID
   */
  async getById(id: number | string, country: string = '1'): Promise<Category> {
    const response = await apiClient.get<{ data: Category }>(
      API_ENDPOINTS.CATEGORIES.SHOW(id),
      { country }
    );
    return response.data;
  },

  /**
   * Create new category
   */
  async create(data: CategoryFormData): Promise<Category> {
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

    const response = await apiClient.upload<{ data: Category }>(
      API_ENDPOINTS.CATEGORIES.STORE,
      formData
    );
    return response.data;
  },

  /**
   * Update existing category
   */
  async update(id: number | string, data: Partial<CategoryFormData>): Promise<Category> {
    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.upload<{ data: Category }>(
      API_ENDPOINTS.CATEGORIES.UPDATE(id),
      formData
    );
    return response.data;
  },

  /**
   * Delete category
   */
  async delete(id: number | string, country: string = '1'): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.CATEGORIES.DELETE(id), { country });
  },

  /**
   * Toggle category active status
   */
  async toggle(id: number | string, country: string = '1'): Promise<Category> {
    const response = await apiClient.post<{ data: Category }>(
      API_ENDPOINTS.CATEGORIES.TOGGLE(id),
      { country }
    );
    return response.data;
  },
};

export default categoriesService;
