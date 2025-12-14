import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { Subject, PaginatedResponse } from '@/types';

interface SubjectFilters {
  page?: number;
  per_page?: number;
  search?: string;
  class_id?: number;
}

interface SubjectFormData {
  name: string;
  class_id: number;
  description?: string;
}

export const subjectsService = {
  // جلب قائمة المواد
  async getAll(filters?: SubjectFilters): Promise<PaginatedResponse<Subject>> {
    const response = await apiClient.get<PaginatedResponse<Subject>>(
      API_ENDPOINTS.DASHBOARD.SUBJECTS.LIST,
      filters
    );
    return response.data;
  },

  // جلب مادة واحدة
  async getById(id: number | string): Promise<Subject> {
    const response = await apiClient.get<{ subject: Subject }>(
      API_ENDPOINTS.DASHBOARD.SUBJECTS.SHOW(id)
    );
    return response.data.subject;
  },

  // إنشاء مادة جديدة
  async create(data: SubjectFormData): Promise<Subject> {
    const response = await apiClient.post<{ subject: Subject }>(
      API_ENDPOINTS.DASHBOARD.SUBJECTS.STORE,
      data
    );
    return response.data.subject;
  },

  // تحديث مادة
  async update(id: number | string, data: SubjectFormData): Promise<Subject> {
    const response = await apiClient.put<{ subject: Subject }>(
      API_ENDPOINTS.DASHBOARD.SUBJECTS.UPDATE(id),
      data
    );
    return response.data.subject;
  },

  // حذف مادة
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.SUBJECTS.DELETE(id));
  },
};

export default subjectsService;
