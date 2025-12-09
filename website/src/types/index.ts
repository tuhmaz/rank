export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'user' | 'editor';
  createdAt: Date;
  status: 'active' | 'inactive' | 'pending';
}

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: NavItem[];
}

export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
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
