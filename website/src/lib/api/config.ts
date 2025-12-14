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
    LIST: '/dashboard/articles',
    CREATE: '/dashboard/articles/create',
    STORE: '/dashboard/articles',
    SHOW: (id: number | string) => `/dashboard/articles/${id}`,
    EDIT: (id: number | string) => `/dashboard/articles/${id}/edit`,
    UPDATE: (id: number | string) => `/dashboard/articles/${id}`,
    DELETE: (id: number | string) => `/dashboard/articles/${id}`,
    BY_CLASS: (gradeLevel: number | string) => `/dashboard/articles/by-class/${gradeLevel}`,
    BY_KEYWORD: (keyword: string) => `/dashboard/articles/by-keyword/${keyword}`,
    PUBLISH: (id: number | string) => `/dashboard/articles/${id}/publish`,
    UNPUBLISH: (id: number | string) => `/dashboard/articles/${id}/unpublish`,
  },

  // ========== USERS ==========
  USERS: {
    LIST: '/dashboard/users',
    STORE: '/dashboard/users',
    SHOW: (id: number | string) => `/dashboard/users/${id}`,
    UPDATE: (id: number | string) => `/dashboard/users/${id}`,
    DELETE: (id: number | string) => `/dashboard/users/${id}`,
    UPDATE_ROLES: (id: number | string) => `/dashboard/users/${id}/roles-permissions`,
    BULK_DELETE: '/dashboard/users/bulk-delete',
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

  // ========== PERMISSIONS ==========
  PERMISSIONS: {
    LIST: '/permissions',
    STORE: '/permissions',
    SHOW: (id: number | string) => `/permissions/${id}`,
    UPDATE: (id: number | string) => `/permissions/${id}`,
    DELETE: (id: number | string) => `/permissions/${id}`,
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
    LIST: '/dashboard/school-classes',
    STORE: '/dashboard/school-classes',
    SHOW: (id: number | string) => `/dashboard/school-classes/${id}`,
    UPDATE: (id: number | string) => `/dashboard/school-classes/${id}`,
    DELETE: (id: number | string) => `/dashboard/school-classes/${id}`,
  },

  // ========== SUBJECTS ==========
  SUBJECTS: {
    LIST: '/dashboard/subjects',
    STORE: '/dashboard/subjects',
    SHOW: (id: number | string) => `/dashboard/subjects/${id}`,
    UPDATE: (id: number | string) => `/dashboard/subjects/${id}`,
    DELETE: (id: number | string) => `/dashboard/subjects/${id}`,
  },

  // ========== SEMESTERS ==========
  SEMESTERS: {
    LIST: '/dashboard/semesters',
    STORE: '/dashboard/semesters',
    SHOW: (id: number | string) => `/dashboard/semesters/${id}`,
    UPDATE: (id: number | string) => `/dashboard/semesters/${id}`,
    DELETE: (id: number | string) => `/dashboard/semesters/${id}`,
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
    INBOX: '/dashboard/messages/inbox',
    SENT: '/dashboard/messages/sent',
    DRAFTS: '/dashboard/messages/drafts',
    SEND: '/dashboard/messages/send',
    SAVE_DRAFT: '/dashboard/messages/draft',
    SHOW: (id: number | string) => `/dashboard/messages/${id}`,
    MARK_READ: (id: number | string) => `/dashboard/messages/${id}/read`,
    TOGGLE_IMPORTANT: (id: number | string) => `/dashboard/messages/${id}/important`,
    DELETE: (id: number | string) => `/dashboard/messages/${id}`,
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
    OVERVIEW: '/dashboard/security/overview',
    LOGS: '/dashboard/security/logs',
    ANALYTICS: '/dashboard/security/analytics',
    RESOLVE: (id: number | string) => `/dashboard/security/logs/${id}/resolve`,
    DELETE_LOG: (id: number | string) => `/dashboard/security/logs/${id}`,
    DELETE_ALL: '/dashboard/security/logs',
    IP_DETAILS: (ip: string) => `/dashboard/security/ip/${ip}`,
    BLOCK_IP: '/dashboard/security/ip/block',
    UNBLOCK_IP: '/dashboard/security/ip/unblock',
    TRUST_IP: '/dashboard/security/ip/trust',
    UNTRUST_IP: '/dashboard/security/ip/untrust',
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
    INDEX: '/dashboard/filter',
    SUBJECTS_BY_CLASS: (classId: number | string) => `/dashboard/filter/subjects/${classId}`,
    SEMESTERS_BY_SUBJECT: (subjectId: number | string) => `/dashboard/filter/semesters/${subjectId}`,
    FILE_TYPES: (semesterId: number | string) => `/dashboard/filter/file-types/${semesterId}`,
  },

  // ========== UPLOAD ==========
  UPLOAD: {
    IMAGE: '/upload/image',
    FILE: '/upload/file',
  },
  
  // ========== SECURE (requires auth) ==========
  SECURE: {
    UPLOAD_IMAGE: '/dashboard/secure/upload-image',
    UPLOAD_DOCUMENT: '/dashboard/secure/upload-document',
  },
};
