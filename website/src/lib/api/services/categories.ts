import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { Category, PaginatedResponse } from '@/types';

interface CategoryFilters {
  page?: number;
  per_page?: number;
  search?: string;
  is_active?: boolean;
}

interface CategoryFormData {
  name: string;
  description?: string;
  parent_id?: number;
  image?: File;
  is_active?: boolean;
}

export const categoriesService = {
  // جلب قائمة الفئات
  async getAll(filters?: CategoryFilters): Promise<PaginatedResponse<Category>> {
    const response = await apiClient.get<PaginatedResponse<Category>>(
      API_ENDPOINTS.DASHBOARD.CATEGORIES.LIST,
      filters
    );
    return response.data;
  },

  // جلب فئة واحدة
  async getById(id: number | string): Promise<Category> {
    const response = await apiClient.get<{ category: Category }>(
      API_ENDPOINTS.DASHBOARD.CATEGORIES.SHOW(id)
    );
    return response.data.category;
  },

  // إنشاء فئة جديدة
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

    const response = await apiClient.upload<{ category: Category }>(
      API_ENDPOINTS.DASHBOARD.CATEGORIES.STORE,
      formData
    );
    return response.data.category;
  },

  // تحديث فئة
  async update(id: number | string, data: CategoryFormData): Promise<Category> {
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

    const response = await apiClient.upload<{ category: Category }>(
      API_ENDPOINTS.DASHBOARD.CATEGORIES.UPDATE(id),
      formData
    );
    return response.data.category;
  },

  // حذف فئة
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.CATEGORIES.DELETE(id));
  },

  // تبديل حالة الفئة
  async toggleStatus(id: number | string): Promise<Category> {
    const response = await apiClient.post<{ category: Category }>(
      API_ENDPOINTS.DASHBOARD.CATEGORIES.TOGGLE(id)
    );
    return response.data.category;
  },
};

export default categoriesService;
