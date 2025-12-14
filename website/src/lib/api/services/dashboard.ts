import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { DashboardData, AnalyticsData } from '@/types';

export const dashboardService = {
  /**
   * Get main dashboard data (totals, trends, analytics, online users, recent activities)
   */
  async getIndex(): Promise<DashboardData> {
    const response = await apiClient.get<{ data: DashboardData }>(API_ENDPOINTS.DASHBOARD.INDEX);
    return response.data;
  },

  /**
   * Get analytics data for specific days range
   */
  async getAnalytics(days: number = 7): Promise<AnalyticsData> {
    const response = await apiClient.get<AnalyticsData>(
      API_ENDPOINTS.DASHBOARD.ANALYTICS,
      { days }
    );
    return response;
  },
};

export default dashboardService;
