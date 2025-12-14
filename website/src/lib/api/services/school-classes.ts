import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { SchoolClass, PaginatedResponse } from '@/types';

interface SchoolClassFilters {
  page?: number;
  per_page?: number;
  search?: string;
}

interface SchoolClassFormData {
  name: string;
  grade_level: string;
  description?: string;
}

export const schoolClassesService = {
  // جلب قائمة الصفوف
  async getAll(filters?: SchoolClassFilters): Promise<PaginatedResponse<SchoolClass>> {
    const response = await apiClient.get<PaginatedResponse<SchoolClass>>(
      API_ENDPOINTS.DASHBOARD.SCHOOL_CLASSES.LIST,
      filters
    );
    return response.data;
  },

  // جلب صف واحد
  async getById(id: number | string): Promise<SchoolClass> {
    const response = await apiClient.get<{ school_class: SchoolClass }>(
      API_ENDPOINTS.DASHBOARD.SCHOOL_CLASSES.SHOW(id)
    );
    return response.data.school_class;
  },

  // إنشاء صف جديد
  async create(data: SchoolClassFormData): Promise<SchoolClass> {
    const response = await apiClient.post<{ school_class: SchoolClass }>(
      API_ENDPOINTS.DASHBOARD.SCHOOL_CLASSES.STORE,
      data
    );
    return response.data.school_class;
  },

  // تحديث صف
  async update(id: number | string, data: SchoolClassFormData): Promise<SchoolClass> {
    const response = await apiClient.put<{ school_class: SchoolClass }>(
      API_ENDPOINTS.DASHBOARD.SCHOOL_CLASSES.UPDATE(id),
      data
    );
    return response.data.school_class;
  },

  // حذف صف
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.SCHOOL_CLASSES.DELETE(id));
  },
};

export default schoolClassesService;
