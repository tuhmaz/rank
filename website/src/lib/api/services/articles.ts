import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { Article, ArticleFormData, PaginatedResponse } from '@/types';

interface ArticleFilters {
  page?: number;
  per_page?: number;
  search?: string;
  category_id?: number;
  class_id?: number;
  subject_id?: number;
  semester_id?: number;
  status?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export const articlesService = {
  // جلب قائمة المقالات
  async getAll(filters?: ArticleFilters): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.LIST,
      filters
    );
    return response.data;
  },

  // جلب بيانات إنشاء مقال جديد (الفئات، الصفوف، إلخ)
  async getCreateData(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.ARTICLES.CREATE);
    return response.data;
  },

  // جلب مقال واحد
  async getById(id: number | string): Promise<Article> {
    const response = await apiClient.get<{ article: Article }>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.SHOW(id)
    );
    return response.data.article;
  },

  // جلب بيانات تعديل مقال
  async getEditData(id: number | string): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.ARTICLES.EDIT(id));
    return response.data;
  },

  // إنشاء مقال جديد
  async create(data: ArticleFormData): Promise<Article> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'keywords' && Array.isArray(value)) {
          value.forEach((keyword, index) => {
            formData.append(`keywords[${index}]`, keyword);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.upload<{ article: Article }>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.STORE,
      formData
    );
    return response.data.article;
  },

  // تحديث مقال
  async update(id: number | string, data: ArticleFormData): Promise<Article> {
    const formData = new FormData();
    formData.append('_method', 'PUT');
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'keywords' && Array.isArray(value)) {
          value.forEach((keyword, index) => {
            formData.append(`keywords[${index}]`, keyword);
          });
        } else if (value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.upload<{ article: Article }>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.UPDATE(id),
      formData
    );
    return response.data.article;
  },

  // حذف مقال
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.ARTICLES.DELETE(id));
  },

  // نشر مقال
  async publish(id: number | string): Promise<Article> {
    const response = await apiClient.post<{ article: Article }>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.PUBLISH(id)
    );
    return response.data.article;
  },

  // إلغاء نشر مقال
  async unpublish(id: number | string): Promise<Article> {
    const response = await apiClient.post<{ article: Article }>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.UNPUBLISH(id)
    );
    return response.data.article;
  },

  // جلب مقالات حسب الصف
  async getByClass(gradeLevel: string, filters?: ArticleFilters): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.BY_CLASS(gradeLevel),
      filters
    );
    return response.data;
  },

  // جلب مقالات حسب الكلمة المفتاحية
  async getByKeyword(keyword: string, filters?: ArticleFilters): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      API_ENDPOINTS.DASHBOARD.ARTICLES.BY_KEYWORD(keyword),
      filters
    );
    return response.data;
  },
};

export default articlesService;
