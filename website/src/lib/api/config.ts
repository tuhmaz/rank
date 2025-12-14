// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
};

// Available Countries (multi-database support)
export const COUNTRIES = [
  { id: '1', code: 'jo', name: 'الأردن' },
  { id: '2', code: 'sa', name: 'السعودية' },
  { id: '3', code: 'eg', name: 'مصر' },
  { id: '4', code: 'ps', name: 'فلسطين' },
] as const;

export type CountryId = '1' | '2' | '3' | '4';
export type CountryCode = 'jo' | 'sa' | 'eg' | 'ps';

// API Endpoints based on Laravel Controllers
export const API_ENDPOINTS = {
  // ========== AUTH ==========
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    VERIFY_EMAIL: (id: string, hash: string) => `/auth/email/verify/${id}/${hash}`,
    RESEND_VERIFY: '/auth/email/resend',
    GOOGLE_REDIRECT: '/auth/google/redirect',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },

  // ========== HOME (Frontend) ==========
  HOME: {
    INDEX: '/home',
    CALENDAR: '/home/calendar',
    EVENT: (id: number | string) => `/home/event/${id}`,
  },

  // ========== DASHBOARD ==========
  DASHBOARD: {
    INDEX: '/dashboard',
    ANALYTICS: '/dashboard/analytics',
  },

  // ========== ARTICLES ==========
  ARTICLES: {
    LIST: '/articles',
    CREATE: '/articles/create',
    STORE: '/articles',
    SHOW: (id: number | string) => `/articles/${id}`,
    EDIT: (id: number | string) => `/articles/${id}/edit`,
    UPDATE: (id: number | string) => `/articles/${id}`,
    DELETE: (id: number | string) => `/articles/${id}`,
    BY_CLASS: (gradeLevel: number | string) => `/articles/by-class/${gradeLevel}`,
    BY_KEYWORD: (keyword: string) => `/articles/by-keyword/${keyword}`,
    PUBLISH: (id: number | string) => `/articles/${id}/publish`,
    UNPUBLISH: (id: number | string) => `/articles/${id}/unpublish`,
  },

  // ========== USERS ==========
  USERS: {
    LIST: '/users',
    STORE: '/users',
    SHOW: (id: number | string) => `/users/${id}`,
    UPDATE: (id: number | string) => `/users/${id}`,
    DELETE: (id: number | string) => `/users/${id}`,
    UPDATE_ROLES: (id: number | string) => `/users/${id}/roles-permissions`,
    BULK_DELETE: '/users/bulk-delete',
  },

  // ========== ROLES ==========
  ROLES: {
    LIST: '/roles',
    STORE: '/roles',
    SHOW: (id: number | string) => `/roles/${id}`,
    UPDATE: (id: number | string) => `/roles/${id}`,
    DELETE: (id: number | string) => `/roles/${id}`,
    PERMISSIONS: '/permissions',
  },

  // ========== CATEGORIES ==========
  CATEGORIES: {
    LIST: '/categories',
    STORE: '/categories',
    SHOW: (id: number | string) => `/categories/${id}`,
    UPDATE: (id: number | string) => `/categories/${id}`,
    DELETE: (id: number | string) => `/categories/${id}`,
    TOGGLE: (id: number | string) => `/categories/${id}/toggle`,
  },

  // ========== POSTS ==========
  POSTS: {
    LIST: '/posts',
    STORE: '/posts',
    SHOW: (id: number | string) => `/posts/${id}`,
    UPDATE: (id: number | string) => `/posts/${id}`,
    DELETE: (id: number | string) => `/posts/${id}`,
  },

  // ========== SCHOOL CLASSES ==========
  SCHOOL_CLASSES: {
    LIST: '/school-classes',
    STORE: '/school-classes',
    SHOW: (id: number | string) => `/school-classes/${id}`,
    UPDATE: (id: number | string) => `/school-classes/${id}`,
    DELETE: (id: number | string) => `/school-classes/${id}`,
  },

  // ========== SUBJECTS ==========
  SUBJECTS: {
    LIST: '/subjects',
    STORE: '/subjects',
    SHOW: (id: number | string) => `/subjects/${id}`,
    UPDATE: (id: number | string) => `/subjects/${id}`,
    DELETE: (id: number | string) => `/subjects/${id}`,
  },

  // ========== SEMESTERS ==========
  SEMESTERS: {
    LIST: '/semesters',
    STORE: '/semesters',
    SHOW: (id: number | string) => `/semesters/${id}`,
    UPDATE: (id: number | string) => `/semesters/${id}`,
    DELETE: (id: number | string) => `/semesters/${id}`,
  },

  // ========== FILES ==========
  FILES: {
    LIST: '/files',
    STORE: '/files',
    SHOW: (id: number | string) => `/files/${id}`,
    DOWNLOAD: (id: number | string) => `/files/${id}/download`,
    UPDATE: (id: number | string) => `/files/${id}`,
    DELETE: (id: number | string) => `/files/${id}`,
  },

  // ========== MESSAGES ==========
  MESSAGES: {
    INBOX: '/messages/inbox',
    SENT: '/messages/sent',
    DRAFTS: '/messages/drafts',
    SEND: '/messages/send',
    SAVE_DRAFT: '/messages/draft',
    SHOW: (id: number | string) => `/messages/${id}`,
    MARK_READ: (id: number | string) => `/messages/${id}/read`,
    TOGGLE_IMPORTANT: (id: number | string) => `/messages/${id}/important`,
    DELETE: (id: number | string) => `/messages/${id}`,
  },

  // ========== NOTIFICATIONS ==========
  NOTIFICATIONS: {
    LIST: '/notifications',
    LATEST: '/notifications/latest',
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    MARK_ALL_READ: '/notifications/read-all',
    BULK_ACTION: '/notifications/bulk',
    DELETE: (id: string) => `/notifications/${id}`,
  },

  // ========== CALENDAR ==========
  CALENDAR: {
    DATABASES: '/calendar/databases',
    EVENTS: '/calendar/events',
    STORE: '/calendar/events',
    UPDATE: (id: number | string) => `/calendar/events/${id}`,
    DELETE: (id: number | string) => `/calendar/events/${id}`,
  },

  // ========== SECURITY LOGS ==========
  SECURITY: {
    OVERVIEW: '/security/overview',
    LOGS: '/security/logs',
    ANALYTICS: '/security/analytics',
    RESOLVE: (id: number | string) => `/security/logs/${id}/resolve`,
    DELETE_LOG: (id: number | string) => `/security/logs/${id}`,
    DELETE_ALL: '/security/logs',
    IP_DETAILS: (ip: string) => `/security/ip/${ip}`,
    BLOCK_IP: '/security/ip/block',
    UNBLOCK_IP: '/security/ip/unblock',
    TRUST_IP: '/security/ip/trust',
    UNTRUST_IP: '/security/ip/untrust',
  },

  // ========== SETTINGS ==========
  SETTINGS: {
    GET_ALL: '/settings',
    UPDATE: '/settings',
    TEST_SMTP: '/settings/smtp/test',
    SEND_TEST_EMAIL: '/settings/smtp/send-test',
    UPDATE_ROBOTS: '/settings/robots',
  },

  // ========== PERFORMANCE ==========
  PERFORMANCE: {
    SUMMARY: '/performance/summary',
    LIVE: '/performance/live',
    RAW: '/performance/raw',
    RESPONSE_TIME: '/performance/response-time',
    CACHE: '/performance/cache',
  },

  // ========== FILTER ==========
  FILTER: {
    INDEX: '/filter',
    SUBJECTS_BY_CLASS: (classId: number | string) => `/filter/subjects/${classId}`,
    SEMESTERS_BY_SUBJECT: (subjectId: number | string) => `/filter/semesters/${subjectId}`,
    FILE_TYPES: (semesterId: number | string) => `/filter/file-types/${semesterId}`,
  },
};
