import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Article, ArticleFormData, PaginatedResponse, SchoolClass, Subject, Semester } from '@/types';

interface ArticleFilters {
  country?: string;
  page?: number;
  per_page?: number;
  q?: string;
  subject_id?: number;
  semester_id?: number;
  status?: boolean;
}

interface ArticleCreateData {
  country: string;
  classes: SchoolClass[];
  subjects: Subject[];
  semesters: Semester[];
}

export const articlesService = {
  /**
   * Get paginated list of articles
   */
  async getAll(filters?: ArticleFilters): Promise<PaginatedResponse<Article>> {
    const response = await apiClient.get<PaginatedResponse<Article>>(
      API_ENDPOINTS.ARTICLES.LIST,
      filters
    );
    return response;
  },

  /**
   * Get data needed for creating an article (classes, subjects, semesters)
   */
  async getCreateData(country: string = '1'): Promise<ArticleCreateData> {
    const response = await apiClient.get<{ data: ArticleCreateData }>(
      API_ENDPOINTS.ARTICLES.CREATE,
      { country }
    );
    return response.data;
  },

  /**
   * Get single article by ID
   */
  async getById(id: number | string, country: string = '1'): Promise<Article> {
    const response = await apiClient.get<{ data: Article }>(
      API_ENDPOINTS.ARTICLES.SHOW(id),
      { country }
    );
    return response.data;
  },

  /**
   * Get article edit data (article + classes, subjects, semesters)
   */
  async getEditData(id: number | string, country: string = '1'): Promise<{
    data: Article;
    classes: SchoolClass[];
    subjects: Subject[];
    semesters: Semester[];
  }> {
    const response = await apiClient.get<{
      data: Article;
      classes: SchoolClass[];
      subjects: Subject[];
      semesters: Semester[];
    }>(
      API_ENDPOINTS.ARTICLES.EDIT(id),
      { country }
    );
    return response;
  },

  /**
   * Create new article with file upload support
   */
  async create(data: ArticleFormData): Promise<Article> {
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

    const response = await apiClient.upload<{ data: Article }>(
      API_ENDPOINTS.ARTICLES.STORE,
      formData
    );
    return response.data;
  },

  /**
   * Update existing article
   */
  async update(id: number | string, data: Partial<ArticleFormData>): Promise<Article> {
    const formData = new FormData();
    formData.append('_method', 'PUT');

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (value instanceof File) {
          // new_file for updating the attachment
          formData.append(key === 'file' ? 'new_file' : key, value);
        } else {
          formData.append(key, String(value));
        }
      }
    });

    const response = await apiClient.upload<{ data: Article }>(
      API_ENDPOINTS.ARTICLES.UPDATE(id),
      formData
    );
    return response.data;
  },

  /**
   * Delete article
   */
  async delete(id: number | string, country: string = '1'): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.ARTICLES.DELETE(id), { country });
  },

  /**
   * Get articles by class/grade level
   */
  async getByClass(gradeLevel: number | string, country: string = '1'): Promise<Article[]> {
    const response = await apiClient.get<{ data: Article[] }>(
      API_ENDPOINTS.ARTICLES.BY_CLASS(gradeLevel),
      { country }
    );
    return response.data;
  },

  /**
   * Get articles by keyword
   */
  async getByKeyword(keyword: string, country: string = '1'): Promise<Article[]> {
    const response = await apiClient.get<{ data: Article[] }>(
      API_ENDPOINTS.ARTICLES.BY_KEYWORD(keyword),
      { country }
    );
    return response.data;
  },

  /**
   * Publish article
   */
  async publish(id: number | string, country: string = '1'): Promise<Article> {
    const response = await apiClient.post<{ data: Article }>(
      API_ENDPOINTS.ARTICLES.PUBLISH(id),
      { country }
    );
    return response.data;
  },

  /**
   * Unpublish article
   */
  async unpublish(id: number | string, country: string = '1'): Promise<Article> {
    const response = await apiClient.post<{ data: Article }>(
      API_ENDPOINTS.ARTICLES.UNPUBLISH(id),
      { country }
    );
    return response.data;
  },
};

export default articlesService;
