import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { Notification, PaginatedResponse } from '@/types';

interface NotificationFilters {
  page?: number;
  per_page?: number;
  unread_only?: boolean;
}

export const notificationsService = {
  // جلب قائمة الإشعارات
  async getAll(filters?: NotificationFilters): Promise<PaginatedResponse<Notification>> {
    const response = await apiClient.get<PaginatedResponse<Notification>>(
      API_ENDPOINTS.DASHBOARD.NOTIFICATIONS.LIST,
      filters
    );
    return response.data;
  },

  // جلب آخر الإشعارات
  async getLatest(): Promise<{ notifications: Notification[]; unread_count: number }> {
    const response = await apiClient.get<{ notifications: Notification[]; unread_count: number }>(
      API_ENDPOINTS.DASHBOARD.NOTIFICATIONS.LATEST
    );
    return response.data;
  },

  // وضع علامة مقروء
  async markAsRead(id: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS.READ(id));
  },

  // وضع علامة مقروء على الكل
  async markAllAsRead(): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS.READ_ALL);
  },

  // إجراء جماعي
  async bulkAction(ids: string[], action: 'read' | 'delete'): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS.BULK, { ids, action });
  },

  // حذف إشعار
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.NOTIFICATIONS.DELETE(id));
  },
};

export default notificationsService;
