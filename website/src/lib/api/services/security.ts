import apiClient from '../client';
import { API_ENDPOINTS } from '../config';
import type { SecurityLog, SecurityStats, SecurityAlert, BlockedIp, TrustedIp, PaginatedResponse } from '@/types';

interface SecurityLogFilters {
  page?: number;
  per_page?: number;
  severity?: string;
  event_type?: string;
  ip_address?: string;
  is_resolved?: boolean;
  date_from?: string;
  date_to?: string;
}

export const securityService = {
  // ===== Security Logs =====

  // جلب الإحصائيات السريعة
  async getStats(): Promise<SecurityStats> {
    const response = await apiClient.get<SecurityStats>(
      API_ENDPOINTS.DASHBOARD.SECURITY.STATS
    );
    return response.data;
  },

  // جلب قائمة السجلات
  async getLogs(filters?: SecurityLogFilters): Promise<PaginatedResponse<SecurityLog>> {
    const response = await apiClient.get<PaginatedResponse<SecurityLog>>(
      API_ENDPOINTS.DASHBOARD.SECURITY.LOGS,
      filters
    );
    return response.data;
  },

  // جلب سجل واحد
  async getLog(id: number | string): Promise<SecurityLog> {
    const response = await apiClient.get<{ log: SecurityLog }>(
      API_ENDPOINTS.DASHBOARD.SECURITY.LOG(id)
    );
    return response.data.log;
  },

  // وضع علامة محلول
  async resolveLog(id: number | string): Promise<SecurityLog> {
    const response = await apiClient.post<{ log: SecurityLog }>(
      API_ENDPOINTS.DASHBOARD.SECURITY.RESOLVE_LOG(id)
    );
    return response.data.log;
  },

  // حذف سجل
  async deleteLog(id: number | string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.SECURITY.DELETE_LOG(id));
  },

  // حذف جميع السجلات
  async deleteAllLogs(): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.DASHBOARD.SECURITY.DELETE_ALL_LOGS);
  },

  // ===== Analytics =====

  async getAnalytics(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SECURITY.ANALYTICS);
    return response.data;
  },

  async getTopRoutes(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SECURITY.TOP_ROUTES);
    return response.data;
  },

  async getGeoData(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SECURITY.GEO);
    return response.data;
  },

  async getResolutionStats(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SECURITY.RESOLUTION);
    return response.data;
  },

  // ===== IP Management =====

  // تفاصيل IP
  async getIpDetails(ip: string): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SECURITY.IP_DETAILS(ip));
    return response.data;
  },

  // حظر IP
  async blockIp(ip: string, reason?: string): Promise<BlockedIp> {
    const response = await apiClient.post<{ blocked_ip: BlockedIp }>(
      API_ENDPOINTS.DASHBOARD.SECURITY.BLOCK_IP,
      { ip_address: ip, reason }
    );
    return response.data.blocked_ip;
  },

  // إلغاء حظر IP
  async unblockIp(ip: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DASHBOARD.SECURITY.UNBLOCK_IP, { ip_address: ip });
  },

  // إضافة IP موثوق
  async trustIp(ip: string, description?: string): Promise<TrustedIp> {
    const response = await apiClient.post<{ trusted_ip: TrustedIp }>(
      API_ENDPOINTS.DASHBOARD.SECURITY.TRUST_IP,
      { ip_address: ip, description }
    );
    return response.data.trusted_ip;
  },

  // إزالة IP من القائمة الموثوقة
  async untrustIp(ip: string): Promise<void> {
    await apiClient.post(API_ENDPOINTS.DASHBOARD.SECURITY.UNTRUST_IP, { ip_address: ip });
  },

  // جلب قائمة IPs المحظورة
  async getBlockedIps(): Promise<BlockedIp[]> {
    const response = await apiClient.get<{ blocked_ips: BlockedIp[] }>(
      API_ENDPOINTS.DASHBOARD.SECURITY.BLOCKED_IPS
    );
    return response.data.blocked_ips;
  },

  // جلب قائمة IPs الموثوقة
  async getTrustedIps(): Promise<TrustedIp[]> {
    const response = await apiClient.get<{ trusted_ips: TrustedIp[] }>(
      API_ENDPOINTS.DASHBOARD.SECURITY.TRUSTED_IPS
    );
    return response.data.trusted_ips;
  },

  // ===== Security Monitor =====

  async getMonitorDashboard(): Promise<any> {
    const response = await apiClient.get(API_ENDPOINTS.DASHBOARD.SECURITY_MONITOR.DASHBOARD);
    return response.data;
  },

  async getAlerts(filters?: { status?: string; severity?: string }): Promise<SecurityAlert[]> {
    const response = await apiClient.get<{ alerts: SecurityAlert[] }>(
      API_ENDPOINTS.DASHBOARD.SECURITY_MONITOR.ALERTS,
      filters
    );
    return response.data.alerts;
  },

  async getAlert(id: number | string): Promise<SecurityAlert> {
    const response = await apiClient.get<{ alert: SecurityAlert }>(
      API_ENDPOINTS.DASHBOARD.SECURITY_MONITOR.ALERT(id)
    );
    return response.data.alert;
  },

  async updateAlert(id: number | string, status: string): Promise<SecurityAlert> {
    const response = await apiClient.patch<{ alert: SecurityAlert }>(
      API_ENDPOINTS.DASHBOARD.SECURITY_MONITOR.ALERT(id),
      { status }
    );
    return response.data.alert;
  },

  async runScan(): Promise<any> {
    const response = await apiClient.post(API_ENDPOINTS.DASHBOARD.SECURITY_MONITOR.RUN_SCAN);
    return response.data;
  },

  async exportReport(params: { from?: string; to?: string; type?: string }): Promise<any> {
    const response = await apiClient.post(
      API_ENDPOINTS.DASHBOARD.SECURITY_MONITOR.EXPORT_REPORT,
      params
    );
    return response.data;
  },
};

export default securityService;
