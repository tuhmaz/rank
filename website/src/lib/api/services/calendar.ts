import { apiClient } from '../client';
import { API_ENDPOINTS } from '../config';
import type { CalendarEvent } from '@/types';

interface EventFormData {
  title: string;
  description?: string;
  event_date: string;
  eventDatabase: string;
}

interface EventResponse {
  id: number;
  title: string;
  start: string;
  allDay: boolean;
  extendedProps: {
    description: string;
    database: string;
  };
}

export const calendarService = {
  /**
   * Get available databases for calendar
   */
  async getDatabases(): Promise<string[]> {
    const response = await apiClient.get<{ data: { databases: string[] } }>(
      API_ENDPOINTS.CALENDAR.DATABASES
    );
    return response.data.databases;
  },

  /**
   * Get events for a date range
   */
  async getEvents(params: {
    database?: string;
    start?: string;
    end?: string;
  }): Promise<EventResponse[]> {
    const response = await apiClient.get<{ data: { data: EventResponse[] } }>(
      API_ENDPOINTS.CALENDAR.EVENTS,
      params
    );
    return response.data.data;
  },

  /**
   * Create new calendar event
   */
  async create(data: EventFormData): Promise<EventResponse> {
    const response = await apiClient.post<{ data: { data: EventResponse } }>(
      API_ENDPOINTS.CALENDAR.STORE,
      data
    );
    return response.data.data;
  },

  /**
   * Update calendar event
   */
  async update(id: number | string, data: EventFormData): Promise<EventResponse> {
    const response = await apiClient.put<{ data: { data: EventResponse } }>(
      API_ENDPOINTS.CALENDAR.UPDATE(id),
      data
    );
    return response.data.data;
  },

  /**
   * Delete calendar event
   */
  async delete(id: number | string, database: string): Promise<{ message: string }> {
    return apiClient.delete(API_ENDPOINTS.CALENDAR.DELETE(id), { database });
  },
};

export default calendarService;
