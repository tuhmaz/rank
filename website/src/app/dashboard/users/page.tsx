'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  Plus,
  Filter,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Mail,
  Shield,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const users = [
  {
    id: 1,
    name: 'أحمد محمد',
    email: 'ahmed@email.com',
    role: 'admin',
    status: 'active',
    joinDate: '2024-01-15',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
  },
  {
    id: 2,
    name: 'سارة علي',
    email: 'sara@email.com',
    role: 'editor',
    status: 'active',
    joinDate: '2024-01-10',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
  },
  {
    id: 3,
    name: 'محمد خالد',
    email: 'mohammed@email.com',
    role: 'user',
    status: 'inactive',
    joinDate: '2024-01-08',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed',
  },
  {
    id: 4,
    name: 'نورة سعد',
    email: 'noura@email.com',
    role: 'user',
    status: 'active',
    joinDate: '2024-01-05',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noura',
  },
  {
    id: 5,
    name: 'فهد عبدالله',
    email: 'fahad@email.com',
    role: 'editor',
    status: 'pending',
    joinDate: '2024-01-03',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=fahad',
  },
];

const roleStyles = {
  admin: 'bg-purple-500/10 text-purple-500',
  editor: 'bg-blue-500/10 text-blue-500',
  user: 'bg-gray-500/10 text-gray-500',
};

const roleLabels = {
  admin: 'مدير',
  editor: 'محرر',
  user: 'مستخدم',
};

const statusStyles = {
  active: 'bg-success/10 text-success',
  inactive: 'bg-error/10 text-error',
  pending: 'bg-warning/10 text-warning',
};

const statusLabels = {
  active: 'نشط',
  inactive: 'غير نشط',
  pending: 'قيد الانتظار',
};

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المستخدمين</h1>
          <p className="text-muted-foreground">إدارة جميع المستخدمين والصلاحيات</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />}>
          إضافة مستخدم
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'إجمالي المستخدمين', value: '1,234', color: 'text-primary' },
          { label: 'المستخدمين النشطين', value: '1,100', color: 'text-success' },
          { label: 'قيد الانتظار', value: '34', color: 'text-warning' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="flex items-center gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={cn('text-2xl font-bold', stat.color)}>{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة المستخدمين</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              فلترة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    المستخدم
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    الدور
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    الحالة
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    تاريخ الانضمام
                  </th>
                  <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">
                    الإجراءات
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-10 h-10 rounded-full bg-muted"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          roleStyles[user.role as keyof typeof roleStyles]
                        )}
                      >
                        {roleLabels[user.role as keyof typeof roleLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          statusStyles[user.status as keyof typeof statusStyles]
                        )}
                      >
                        {statusLabels[user.status as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {user.joinDate}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-error/10 transition-colors">
                          <Trash2 className="w-4 h-4 text-error" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              عرض 1 إلى 5 من 1,234 مستخدم
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled>
                السابق
              </Button>
              <Button variant="outline" size="sm">
                التالي
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
