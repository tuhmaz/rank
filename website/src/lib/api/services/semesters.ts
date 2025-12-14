import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { Semester, PaginatedResponse } from '@/types';

interface SemesterFilters {
  page?: number;
  per_page?: number;
  search?: string;
  subject_id?: number;
}

interface SemesterFormData {
  name: string;
  subject_id: number;
  description?: string;
}

export const semestersService = {
  // جلب قائمة الفصول الدراسية
  async getAll(filters?: SemesterFilters): Promise<PaginatedResponse<Semester>> {
    const response = await apiClient.get<PaginatedResponse<Semester>>(
      API_ENDPOINTS.DASHBOARD.SEMESTERS.LIST,
      filters
    );
    return response.data;
  },

  // جلب فصل دراسي واحد
  async getById(id: number | string): Promise<Semester> {
    const response = await apiClient.get<{ semester: Semester }>(
      API_ENDPOINTS.DASHBOARD.SEMESTERS.SHOW(id)
    );
    return response.data.semester;
  },

  // إنشاء فصل دراسي جديد
  async create(data: SemesterFormData): Promise<Semester> {
    const response = await apiClient.post<{ semester: Semester }>(
      API_ENDPOINTS.DASHBOARD.SEMESTERS.STORE,
      data
    );
    return response.data.semester;
  },

  // تحديث فصل دراسي
  async update(id: number | string, data: SemesterFormData): Promise<Semester> {
    const response = await apiClient.put<{ semester: Semester }>(
      API_ENDPOINTS.DASHBOARD.SEMESTERS.UPDATE(id),
      data
    );
    return response.data.semester;
  },

  // حذف فصل دراسي
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.SEMESTERS.DELETE(id));
  },
};

export default semestersService;
