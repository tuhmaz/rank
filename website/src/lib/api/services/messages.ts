import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { Message, PaginatedResponse } from '@/types';

interface MessageFilters {
  page?: number;
  per_page?: number;
  search?: string;
}

interface SendMessageData {
  recipient_id: number;
  subject: string;
  body: string;
}

export const messagesService = {
  // جلب البريد الوارد
  async getInbox(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.INBOX,
      filters
    );
    return response.data;
  },

  // جلب البريد المرسل
  async getSent(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.SENT,
      filters
    );
    return response.data;
  },

  // جلب المسودات
  async getDrafts(filters?: MessageFilters): Promise<PaginatedResponse<Message>> {
    const response = await apiClient.get<PaginatedResponse<Message>>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.DRAFTS,
      filters
    );
    return response.data;
  },

  // إرسال رسالة
  async send(data: SendMessageData): Promise<Message> {
    const response = await apiClient.post<{ message: Message }>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.SEND,
      data
    );
    return response.data.message;
  },

  // حفظ كمسودة
  async saveDraft(data: Partial<SendMessageData>): Promise<Message> {
    const response = await apiClient.post<{ message: Message }>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.DRAFT,
      data
    );
    return response.data.message;
  },

  // جلب رسالة واحدة
  async getById(id: number | string): Promise<Message> {
    const response = await apiClient.get<{ message: Message }>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.SHOW(id)
    );
    return response.data.message;
  },

  // وضع علامة مقروء
  async markAsRead(id: number | string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DASHBOARD.MESSAGES.READ(id));
  },

  // تبديل علامة مهم
  async toggleImportant(id: number | string): Promise<Message> {
    const response = await apiClient.post<{ message: Message }>(
      API_ENDPOINTS.DASHBOARD.MESSAGES.IMPORTANT(id)
    );
    return response.data.message;
  },

  // حذف رسالة
  async delete(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.MESSAGES.DELETE(id));
  },
};

export default messagesService;
