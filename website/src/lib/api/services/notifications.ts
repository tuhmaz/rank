import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { Notification, PaginatedResponse } from '@/types';

interface NotificationFilters {
  page?: number;
  per_page?: number;
}

interface NotificationListResponse extends PaginatedResponse<Notification> {
  unread_count: number;
}

interface LatestNotificationsResponse {
  data: Notification[];
  unread_count: number;
}

export const notificationsService = {
  /**
   * Get paginated notifications list
   */
  async getAll(filters?: NotificationFilters): Promise<NotificationListResponse> {
    const response = await apiClient.get<NotificationListResponse>(
      API_ENDPOINTS.NOTIFICATIONS.LIST,
      filters
    );
    return response;
  },

  /**
   * Get latest notifications (for navbar bell)
   */
  async getLatest(limit: number = 10): Promise<LatestNotificationsResponse> {
    const response = await apiClient.get<LatestNotificationsResponse>(
      API_ENDPOINTS.NOTIFICATIONS.LATEST,
      { limit }
    );
    return response;
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id: string): Promise<{ message: string; unread_count: number }> {
    const response = await apiClient.post<{ data: { message: string; unread_count: number } }>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<{ message: string; unread_count: number }> {
    const response = await apiClient.post<{ data: { message: string; unread_count: number } }>(
      API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
    );
    return response.data;
  },

  /**
   * Bulk action on notifications (delete or mark-as-read)
   */
  async bulkAction(ids: string[], action: 'delete' | 'mark-as-read'): Promise<{
    message: string;
    deleted?: number;
    updated?: number;
    unread_count?: number;
  }> {
    const response = await apiClient.post<{ data: {
      message: string;
      deleted?: number;
      updated?: number;
      unread_count?: number;
    } }>(
      API_ENDPOINTS.NOTIFICATIONS.BULK_ACTION,
      { ids, action }
    );
    return response.data;
  },

  /**
   * Delete a single notification
   */
  async delete(id: string): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.NOTIFICATIONS.DELETE(id));
  },
};

export default notificationsService;
