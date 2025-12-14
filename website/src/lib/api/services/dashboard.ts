import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { DashboardStats } from '@/types';

export const dashboardService = {
  // جلب إحصائيات لوحة التحكم
  async getStats(): Promise<DashboardStats> {
    const response = await apiClient.get<DashboardStats>(
      API_ENDPOINTS.DASHBOARD.INDEX
    );
    return response.data;
  },
};

export default dashboardService;
