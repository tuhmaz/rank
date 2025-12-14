// ===== Base Types =====
export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
}

export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// ===== Auth Types =====
export interface User {
  id: number | string;
  name: string;
  email: string;
  avatar?: string;
  role?: string;
  roles?: Role[];
  permissions?: Permission[];
  email_verified_at?: string;
  created_at?: string;
  updated_at?: string;
  status?: 'active' | 'inactive' | 'pending';
}

export interface LoginCredentials {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message?: string;
}

// ===== Role & Permission Types =====
export interface Role {
  id: number;
  name: string;
  guard_name?: string;
  permissions?: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  guard_name?: string;
  created_at?: string;
  updated_at?: string;
}

// ===== Article Types =====
export interface Article {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: User;
  author_id?: number;
  category?: Category;
  category_id?: number;
  school_class?: SchoolClass;
  class_id?: number;
  subject?: Subject;
  subject_id?: number;
  semester?: Semester;
  semester_id?: number;
  keywords?: Keyword[];
  status: 'draft' | 'published' | 'archived';
  views?: number;
  meta_title?: string;
  meta_description?: string;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

export interface ArticleFormData {
  title: string;
  content: string;
  excerpt?: string;
  image?: File | string;
  category_id?: number;
  class_id?: number;
  subject_id?: number;
  semester_id?: number;
  keywords?: string[];
  status?: 'draft' | 'published';
  meta_title?: string;
  meta_description?: string;
}

// ===== Category Types =====
export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent_id?: number;
  parent?: Category;
  children?: Category[];
  articles_count?: number;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

// ===== School Class Types =====
export interface SchoolClass {
  id: number;
  name: string;
  slug: string;
  grade_level: string;
  description?: string;
  subjects?: Subject[];
  articles_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ===== Subject Types =====
export interface Subject {
  id: number;
  name: string;
  slug: string;
  description?: string;
  school_class?: SchoolClass;
  class_id?: number;
  semesters?: Semester[];
  articles_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ===== Semester Types =====
export interface Semester {
  id: number;
  name: string;
  slug: string;
  description?: string;
  subject?: Subject;
  subject_id?: number;
  articles_count?: number;
  created_at?: string;
  updated_at?: string;
}

// ===== Keyword Types =====
export interface Keyword {
  id: number;
  keyword: string;
  articles_count?: number;
}

// ===== Post Types =====
export interface Post {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: User;
  category?: Category;
  status: 'draft' | 'published';
  views?: number;
  created_at?: string;
  updated_at?: string;
}

// ===== File Types =====
export interface FileItem {
  id: number;
  name: string;
  original_name: string;
  path: string;
  url: string;
  size: number;
  mime_type: string;
  extension: string;
  downloads?: number;
  article_id?: number;
  created_at?: string;
  updated_at?: string;
}

// ===== Message Types =====
export interface Message {
  id: number;
  subject: string;
  body: string;
  sender: User;
  sender_id: number;
  recipient: User;
  recipient_id: number;
  is_read: boolean;
  is_important: boolean;
  is_draft: boolean;
  read_at?: string;
  created_at?: string;
  updated_at?: string;
}

// ===== Notification Types =====
export interface Notification {
  id: string;
  type: string;
  data: {
    title: string;
    message: string;
    url?: string;
    [key: string]: any;
  };
  read_at?: string;
  created_at: string;
}

// ===== Calendar Event Types =====
export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  start: string;
  end?: string;
  all_day?: boolean;
  color?: string;
  database?: string;
  created_at?: string;
  updated_at?: string;
}

// ===== Security Types =====
export interface SecurityLog {
  id: number;
  ip_address: string;
  user_agent?: string;
  route: string;
  method: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description?: string;
  is_resolved: boolean;
  resolved_at?: string;
  resolved_by?: User;
  country?: string;
  city?: string;
  created_at: string;
}

export interface SecurityAlert {
  id: number;
  type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  details?: any;
  status: 'new' | 'investigating' | 'resolved' | 'dismissed';
  created_at: string;
  updated_at?: string;
}

export interface SecurityStats {
  total_logs: number;
  unresolved_logs: number;
  blocked_ips: number;
  trusted_ips: number;
  logs_today: number;
  critical_alerts: number;
}

export interface BlockedIp {
  id: number;
  ip_address: string;
  reason?: string;
  blocked_at: string;
  blocked_by?: User;
  expires_at?: string;
}

export interface TrustedIp {
  id: number;
  ip_address: string;
  description?: string;
  created_at: string;
}

// ===== Dashboard Types =====
export interface DashboardStats {
  users_count: number;
  articles_count: number;
  categories_count: number;
  posts_count: number;
  views_today: number;
  views_this_month: number;
  recent_articles: Article[];
  recent_users: User[];
  chart_data?: ChartData[];
}

// ===== Settings Types =====
export interface Settings {
  site_name?: string;
  site_description?: string;
  site_logo?: string;
  site_favicon?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_address?: string;
  social_facebook?: string;
  social_twitter?: string;
  social_instagram?: string;
  social_linkedin?: string;
  smtp_host?: string;
  smtp_port?: number;
  smtp_username?: string;
  smtp_password?: string;
  smtp_encryption?: string;
  robots_txt?: string;
  [key: string]: any;
}

// ===== Sitemap Types =====
export interface SitemapStatus {
  database: string;
  type: string;
  exists: boolean;
  last_modified?: string;
  size?: number;
  url?: string;
}

// ===== Performance Types =====
export interface PerformanceSummary {
  cpu_usage: number;
  memory_usage: number;
  disk_usage: number;
  uptime: string;
  requests_per_minute: number;
  average_response_time: number;
}

// ===== Redis Types =====
export interface RedisKey {
  key: string;
  type: string;
  ttl: number;
  size?: number;
}

export interface RedisInfo {
  version: string;
  connected_clients: number;
  used_memory: string;
  used_memory_peak: string;
  uptime_in_days: number;
}

// ===== Filter Types =====
export interface FilterData {
  classes: SchoolClass[];
  subjects: Subject[];
  semesters: Semester[];
  file_types: string[];
}

// ===== UI Types =====
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  permission?: string;
}

export interface Stat {
  title: string;
  value: string | number;
  change?: number;
  changeType?: 'increase' | 'decrease';
  icon?: React.ReactNode;
}

export interface ChartData {
  name: string;
  value: number;
  [key: string]: string | number;
}

export interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
}

// ===== Table Types =====
export interface TableColumn<T> {
  key: keyof T | string;
  title: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
}

export interface TableProps<T> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  pagination?: PaginatedResponse<T>;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
}
