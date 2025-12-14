import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { FileAttachment, PaginatedResponse } from '@/types';

interface FileFilters {
  country?: string;
  category?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

interface FileFormData {
  country: string;
  article_id: number;
  file_category: string;
  file: File;
}

export const filesService = {
  /**
   * Get files list with filters
   */
  async getAll(filters?: FileFilters): Promise<PaginatedResponse<FileAttachment>> {
    const response = await apiClient.get<PaginatedResponse<FileAttachment>>(
      API_ENDPOINTS.FILES.LIST,
      filters
    );
    return response;
  },

  /**
   * Get single file by ID
   */
  async getById(id: number | string, country: string = '1'): Promise<FileAttachment> {
    const response = await apiClient.get<{ data: FileAttachment }>(
      API_ENDPOINTS.FILES.SHOW(id),
      { country }
    );
    return response.data;
  },

  /**
   * Upload new file
   */
  async upload(data: FileFormData): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('country', data.country);
    formData.append('article_id', String(data.article_id));
    formData.append('file_category', data.file_category);
    formData.append('file', data.file);

    const response = await apiClient.upload<{ data: FileAttachment }>(
      API_ENDPOINTS.FILES.STORE,
      formData
    );
    return response.data;
  },

  /**
   * Update file
   */
  async update(id: number | string, data: {
    country: string;
    article_id: number;
    file_category: string;
    file?: File;
  }): Promise<FileAttachment> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('country', data.country);
    formData.append('article_id', String(data.article_id));
    formData.append('file_category', data.file_category);
    if (data.file) {
      formData.append('file', data.file);
    }

    const response = await apiClient.upload<{ data: FileAttachment }>(
      API_ENDPOINTS.FILES.UPDATE(id),
      formData
    );
    return response.data;
  },

  /**
   * Delete file
   */
  async delete(id: number | string, country: string = '1'): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.FILES.DELETE(id), { country });
  },

  /**
   * Get file download URL
   */
  getDownloadUrl(id: number | string): string {
    return `${API_ENDPOINTS.FILES.DOWNLOAD(id)}`;
  },
};

export default filesService;
