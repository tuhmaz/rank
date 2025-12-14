// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
};

// API Endpoints
export const API_ENDPOINTS = {
  // Home
  HOME: {
    INDEX: '/home',
    CALENDAR: '/home/calendar',
    EVENT: (id: string | number) => `/home/event/${id}`,
  },

  // Language
  LANG: {
    CHANGE: '/lang/change',
    CURRENT: '/lang/current',
  },

  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/user',
    FORGOT_PASSWORD: '/auth/password/forgot',
    RESET_PASSWORD: '/auth/password/reset',
    VERIFY_EMAIL: (id: string, hash: string) => `/auth/email/verify/${id}/${hash}`,
    RESEND_VERIFY: '/auth/email/resend',
    GOOGLE_REDIRECT: '/auth/google/redirect',
    GOOGLE_CALLBACK: '/auth/google/callback',
  },

  // Dashboard
  DASHBOARD: {
    INDEX: '/dashboard',

    // Articles
    ARTICLES: {
      LIST: '/dashboard/articles',
      CREATE: '/dashboard/articles/create',
      STORE: '/dashboard/articles',
      SHOW: (id: string | number) => `/dashboard/articles/${id}`,
      EDIT: (id: string | number) => `/dashboard/articles/${id}/edit`,
      UPDATE: (id: string | number) => `/dashboard/articles/${id}`,
      DELETE: (id: string | number) => `/dashboard/articles/${id}`,
      BY_CLASS: (gradeLevel: string) => `/dashboard/articles/by-class/${gradeLevel}`,
      BY_KEYWORD: (keyword: string) => `/dashboard/articles/by-keyword/${keyword}`,
      PUBLISH: (id: string | number) => `/dashboard/articles/${id}/publish`,
      UNPUBLISH: (id: string | number) => `/dashboard/articles/${id}/unpublish`,
    },

    // School Classes
    SCHOOL_CLASSES: {
      LIST: '/dashboard/school-classes',
      SHOW: (id: string | number) => `/dashboard/school-classes/${id}`,
      STORE: '/dashboard/school-classes',
      UPDATE: (id: string | number) => `/dashboard/school-classes/${id}`,
      DELETE: (id: string | number) => `/dashboard/school-classes/${id}`,
    },

    // Semesters
    SEMESTERS: {
      LIST: '/dashboard/semesters',
      SHOW: (id: string | number) => `/dashboard/semesters/${id}`,
      STORE: '/dashboard/semesters',
      UPDATE: (id: string | number) => `/dashboard/semesters/${id}`,
      DELETE: (id: string | number) => `/dashboard/semesters/${id}`,
    },

    // Subjects
    SUBJECTS: {
      LIST: '/dashboard/subjects',
      SHOW: (id: string | number) => `/dashboard/subjects/${id}`,
      STORE: '/dashboard/subjects',
      UPDATE: (id: string | number) => `/dashboard/subjects/${id}`,
      DELETE: (id: string | number) => `/dashboard/subjects/${id}`,
    },

    // Sitemap
    SITEMAP: {
      STATUS: '/dashboard/sitemap/status',
      GENERATE: '/dashboard/sitemap/generate',
      DELETE: (type: string, database: string) => `/dashboard/sitemap/delete/${type}/${database}`,
    },

    // Users
    USERS: {
      LIST: '/dashboard/users',
      CREATE: '/dashboard/users/create',
      SHOW: (id: string | number) => `/dashboard/users/${id}`,
      EDIT: (id: string | number) => `/dashboard/users/${id}/edit`,
      STORE: '/dashboard/users',
      UPDATE: (id: string | number) => `/dashboard/users/${id}`,
      DELETE: (id: string | number) => `/dashboard/users/${id}`,
    },

    // Roles
    ROLES: {
      LIST: '/dashboard/roles',
      SHOW: (id: string | number) => `/dashboard/roles/${id}`,
      STORE: '/dashboard/roles',
      UPDATE: (id: string | number) => `/dashboard/roles/${id}`,
      DELETE: (id: string | number) => `/dashboard/roles/${id}`,
    },

    // Permissions
    PERMISSIONS: {
      LIST: '/dashboard/permissions',
      CREATE: '/dashboard/permissions/create',
      SHOW: (id: string | number) => `/dashboard/permissions/${id}`,
      EDIT: (id: string | number) => `/dashboard/permissions/${id}/edit`,
      STORE: '/dashboard/permissions',
      UPDATE: (id: string | number) => `/dashboard/permissions/${id}`,
      DELETE: (id: string | number) => `/dashboard/permissions/${id}`,
    },

    // Settings
    SETTINGS: {
      GET_ALL: '/dashboard/settings',
      UPDATE: '/dashboard/settings/update',
      TEST_SMTP: '/dashboard/settings/smtp/test',
      SEND_TEST_EMAIL: '/dashboard/settings/smtp/send-test',
      UPDATE_ROBOTS: '/dashboard/settings/robots',
    },

    // Security
    SECURITY: {
      STATS: '/dashboard/security/stats',
      LOGS: '/dashboard/security/logs',
      LOG: (id: string | number) => `/dashboard/security/logs/${id}`,
      RESOLVE_LOG: (id: string | number) => `/dashboard/security/logs/${id}/resolve`,
      DELETE_LOG: (id: string | number) => `/dashboard/security/logs/${id}`,
      DELETE_ALL_LOGS: '/dashboard/security/logs',
      ANALYTICS: '/dashboard/security/analytics',
      TOP_ROUTES: '/dashboard/security/analytics/routes',
      GEO: '/dashboard/security/analytics/geo',
      RESOLUTION: '/dashboard/security/analytics/resolution',
      IP_DETAILS: (ip: string) => `/dashboard/security/ip/${ip}`,
      BLOCK_IP: '/dashboard/security/ip/block',
      UNBLOCK_IP: '/dashboard/security/ip/unblock',
      TRUST_IP: '/dashboard/security/ip/trust',
      UNTRUST_IP: '/dashboard/security/ip/untrust',
      BLOCKED_IPS: '/dashboard/security/blocked-ips',
      TRUSTED_IPS: '/dashboard/security/trusted-ips',
    },

    // Security Monitor
    SECURITY_MONITOR: {
      DASHBOARD: '/dashboard/security/monitor/dashboard',
      ALERTS: '/dashboard/security/monitor/alerts',
      ALERT: (id: string | number) => `/dashboard/security/monitor/alerts/${id}`,
      RUN_SCAN: '/dashboard/security/monitor/run-scan',
      EXPORT_REPORT: '/dashboard/security/monitor/export-report',
    },

    // Calendar
    CALENDAR: {
      DATABASES: '/dashboard/calendar/databases',
      EVENTS: '/dashboard/calendar/events',
      EVENT: (id: string | number) => `/dashboard/calendar/events/${id}`,
    },

    // Messages
    MESSAGES: {
      INBOX: '/dashboard/messages/inbox',
      SENT: '/dashboard/messages/sent',
      DRAFTS: '/dashboard/messages/drafts',
      SEND: '/dashboard/messages/send',
      DRAFT: '/dashboard/messages/draft',
      SHOW: (id: string | number) => `/dashboard/messages/${id}`,
      READ: (id: string | number) => `/dashboard/messages/${id}/read`,
      IMPORTANT: (id: string | number) => `/dashboard/messages/${id}/important`,
      DELETE: (id: string | number) => `/dashboard/messages/${id}`,
    },

    // Notifications
    NOTIFICATIONS: {
      LIST: '/dashboard/notifications',
      LATEST: '/dashboard/notifications/latest',
      READ: (id: string | number) => `/dashboard/notifications/${id}/read`,
      READ_ALL: '/dashboard/notifications/read-all',
      BULK: '/dashboard/notifications/bulk',
      DELETE: (id: string | number) => `/dashboard/notifications/${id}`,
    },

    // Categories
    CATEGORIES: {
      LIST: '/dashboard/categories',
      SHOW: (id: string | number) => `/dashboard/categories/${id}`,
      STORE: '/dashboard/categories',
      UPDATE: (id: string | number) => `/dashboard/categories/${id}/update`,
      DELETE: (id: string | number) => `/dashboard/categories/${id}`,
      TOGGLE: (id: string | number) => `/dashboard/categories/${id}/toggle`,
    },

    // Posts
    POSTS: {
      LIST: '/dashboard/posts',
      SHOW: (id: string | number) => `/dashboard/posts/${id}`,
      STORE: '/dashboard/posts',
      UPDATE: (id: string | number) => `/dashboard/posts/${id}`,
      DELETE: (id: string | number) => `/dashboard/posts/${id}`,
    },

    // Files
    FILES: {
      LIST: '/dashboard/files',
      SHOW: (id: string | number) => `/dashboard/files/${id}`,
      DOWNLOAD: (id: string | number) => `/dashboard/files/${id}/download`,
      STORE: '/dashboard/files',
      UPDATE: (id: string | number) => `/dashboard/files/${id}`,
      DELETE: (id: string | number) => `/dashboard/files/${id}`,
    },

    // Secure Files
    SECURE: {
      UPLOAD_IMAGE: '/dashboard/secure/upload-image',
      UPLOAD_DOCUMENT: '/dashboard/secure/upload-document',
    },

    // Redis
    REDIS: {
      KEYS: '/dashboard/redis/keys',
      STORE: '/dashboard/redis',
      DELETE: (key: string) => `/dashboard/redis/${key}`,
      CLEAN_EXPIRED: '/dashboard/redis/expired/clean',
      TEST: '/dashboard/redis/test',
      INFO: '/dashboard/redis/info',
      ENV: '/dashboard/redis/env',
      UPDATE_ENV: '/dashboard/redis/env',
    },

    // Performance
    PERFORMANCE: {
      SUMMARY: '/dashboard/performance/summary',
      LIVE: '/dashboard/performance/live',
      RAW: '/dashboard/performance/raw',
      RESPONSE_TIME: '/dashboard/performance/response-time',
      CACHE: '/dashboard/performance/cache',
    },

    // Filter
    FILTER: {
      INDEX: '/dashboard/filter',
      SUBJECTS_BY_CLASS: (classId: string | number) => `/dashboard/filter/subjects/${classId}`,
      SEMESTERS_BY_SUBJECT: (subjectId: string | number) => `/dashboard/filter/semesters/${subjectId}`,
      FILE_TYPES_BY_SEMESTER: (semesterId: string | number) => `/dashboard/filter/file-types/${semesterId}`,
    },
  },

  // Image Proxy
  IMAGE: {
    FIT: (size: string, path: string) => `/img/fit/${size}/${path}`,
  },

  // Public Filter
  FILTER: {
    INDEX: '/filter',
    SUBJECTS_BY_CLASS: (classId: string | number) => `/filter/subjects/${classId}`,
    SEMESTERS_BY_SUBJECT: (subjectId: string | number) => `/filter/semesters/${subjectId}`,
    FILE_TYPES_BY_SEMESTER: (semesterId: string | number) => `/filter/file-types/${semesterId}`,
  },
};
