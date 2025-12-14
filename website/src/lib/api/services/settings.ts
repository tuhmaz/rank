import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';

interface Settings {
  [key: string]: string;
}

interface SmtpTestResult {
  success: boolean;
  message?: string;
  error?: string;
}

export const settingsService = {
  /**
   * Get all settings
   */
  async getAll(): Promise<Settings> {
    const response = await apiClient.get<{ data: { data: Settings } }>(
      API_ENDPOINTS.SETTINGS.GET_ALL
    );
    return response.data.data;
  },

  /**
   * Update settings (supports file uploads for logo/favicon)
   */
  async update(data: Record<string, string | File>): Promise<{ message: string }> {
    const hasFiles = Object.values(data).some(v => v instanceof File);

    if (hasFiles) {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      const response = await apiClient.upload<{ data: { message: string } }>(
        API_ENDPOINTS.SETTINGS.UPDATE,
        formData
      );
      return response.data;
    }

    const response = await apiClient.post<{ data: { message: string } }>(
      API_ENDPOINTS.SETTINGS.UPDATE,
      data
    );
    return response.data;
  },

  /**
   * Test SMTP connection
   */
  async testSmtp(): Promise<SmtpTestResult> {
    const response = await apiClient.post<{ data: { result: SmtpTestResult } }>(
      API_ENDPOINTS.SETTINGS.TEST_SMTP
    );
    return response.data.result;
  },

  /**
   * Send test email via SMTP
   */
  async sendTestEmail(email: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ data: { message: string } }>(
      API_ENDPOINTS.SETTINGS.SEND_TEST_EMAIL,
      { email }
    );
    return response.data;
  },

  /**
   * Update robots.txt content
   */
  async updateRobots(content: string): Promise<{ message: string }> {
    const response = await apiClient.post<{ data: { message: string } }>(
      API_ENDPOINTS.SETTINGS.UPDATE_ROBOTS,
      { content }
    );
    return response.data;
  },
};

export default settingsService;
