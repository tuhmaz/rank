import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { SchoolClass } from '@/types';

interface SchoolClassFormData {
  country_id: string;
  grade_name: string;
  grade_level: number;
}

export const schoolClassesService = {
  /**
   * Get all school classes for a country
   */
  async getAll(country_id: string = '1'): Promise<SchoolClass[]> {
    const response = await apiClient.get<{ data: SchoolClass[] }>(
      API_ENDPOINTS.SCHOOL_CLASSES.LIST,
      { country_id }
    );
    return response.data;
  },

  /**
   * Get single school class by ID
   */
  async getById(id: number | string, country_id: string = '1'): Promise<SchoolClass> {
    const response = await apiClient.get<{ data: SchoolClass }>(
      API_ENDPOINTS.SCHOOL_CLASSES.SHOW(id),
      { country_id }
    );
    return response.data;
  },

  /**
   * Create new school class
   */
  async create(data: SchoolClassFormData): Promise<SchoolClass> {
    const response = await apiClient.post<{ data: SchoolClass }>(
      API_ENDPOINTS.SCHOOL_CLASSES.STORE,
      data
    );
    return response.data;
  },

  /**
   * Update school class
   */
  async update(id: number | string, data: SchoolClassFormData): Promise<SchoolClass> {
    const response = await apiClient.put<{ data: SchoolClass }>(
      API_ENDPOINTS.SCHOOL_CLASSES.UPDATE(id),
      data
    );
    return response.data;
  },

  /**
   * Delete school class
   */
  async delete(id: number | string, country_id: string = '1'): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.SCHOOL_CLASSES.DELETE(id), { country_id });
  },
};

export default schoolClassesService;
