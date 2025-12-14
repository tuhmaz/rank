import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Post, PaginatedResponse } from '@/types';

interface PostFilters {
  country?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

interface PostFormData {
  country: string;
  title: string;
  content: string;
  category_id: number;
  meta_description?: string;
  keywords?: string;
  is_active?: boolean;
  is_featured?: boolean;
  image?: File;
  attachments?: File[];
}

export const postsService = {
  /**
   * Get paginated posts list
   */
  async getAll(filters?: PostFilters): Promise<PaginatedResponse<Post>> {
    const response = await apiClient.get<PaginatedResponse<Post>>(
      API_ENDPOINTS.POSTS.LIST,
      filters
    );
    return response;
  },

  /**
   * Get single post by ID
   */
  async getById(id: number | string, country: string = '1'): Promise<Post> {
    const response = await apiClient.get<{ data: Post }>(
      API_ENDPOINTS.POSTS.SHOW(id),
      { country }
    );
    return response.data;
  },

  /**
   * Create new post with file upload
   */
  async create(data: PostFormData): Promise<Post> {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append('attachments[]', file);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.upload<{ data: Post }>(
      API_ENDPOINTS.POSTS.STORE,
      formData
    );
    return response.data;
  },

  /**
   * Update existing post
   */
  async update(id: number | string, data: Partial<PostFormData>): Promise<Post> {
    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'attachments' && Array.isArray(value)) {
          value.forEach((file: File) => {
            formData.append('attachments[]', file);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === 'boolean') {
          formData.append(key, value ? '1' : '0');
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.upload<{ data: Post }>(
      API_ENDPOINTS.POSTS.UPDATE(id),
      formData
    );
    return response.data;
  },

  /**
   * Delete post
   */
  async delete(id: number | string, country: string = '1'): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id), { country });
  },
};

export default postsService;
