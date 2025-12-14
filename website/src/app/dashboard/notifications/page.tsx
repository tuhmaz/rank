'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  Trash2,
  Filter,
  Mail,
  ShoppingCart,
  AlertCircle,
  Info,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import type { Notification } from '@/types';

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    data: {
      title: 'طلب جديد',
      message: 'لديك طلب خدمة جديد من أحمد محمد',
      url: '/dashboard/orders/123',
    },
    read_at: null,
    created_at: '2024-01-15T10:30:00',
  },
  {
    id: '2',
    type: 'user',
    data: {
      title: 'مستخدم جديد',
      message: 'انضم سارة علي إلى المنصة',
      url: '/dashboard/users/456',
    },
    read_at: null,
    created_at: '2024-01-15T09:15:00',
  },
  {
    id: '3',
    type: 'alert',
    data: {
      title: 'تنبيه أمني',
      message: 'تم رصد نشاط مشبوه من IP غير معروف',
      url: '/dashboard/security',
    },
    read_at: null,
    created_at: '2024-01-15T08:00:00',
  },
  {
    id: '4',
    type: 'info',
    data: {
      title: 'تحديث النظام',
      message: 'تم تحديث النظام إلى الإصدار 2.0',
    },
    read_at: '2024-01-14T22:00:00',
    created_at: '2024-01-14T20:00:00',
  },
  {
    id: '5',
    type: 'message',
    data: {
      title: 'رسالة جديدة',
      message: 'لديك رسالة جديدة من الدعم الفني',
      url: '/dashboard/messages/789',
    },
    read_at: '2024-01-14T18:30:00',
    created_at: '2024-01-14T18:00:00',
  },
];

const typeIcons: Record<string, React.ReactNode> = {
  order: <ShoppingCart className="w-5 h-5" />,
  user: <Mail className="w-5 h-5" />,
  alert: <AlertCircle className="w-5 h-5" />,
  info: <Info className="w-5 h-5" />,
  message: <Mail className="w-5 h-5" />,
};

const typeColors: Record<string, string> = {
  order: 'bg-green-500',
  user: 'bg-blue-500',
  alert: 'bg-red-500',
  info: 'bg-purple-500',
  message: 'bg-orange-500',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const unreadCount = notifications.filter((n) => !n.read_at).length;

  const filteredNotifications = filter === 'unread'
    ? notifications.filter((n) => !n.read_at)
    : notifications;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) =>
      n.id === id ? { ...n, read_at: new Date().toISOString() } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({
      ...n,
      read_at: n.read_at || new Date().toISOString(),
    })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    setSelectedIds(selectedIds.filter((i) => i !== id));
  };

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    setNotifications(notifications.filter((n) => !selectedIds.includes(n.id)));
    setSelectedIds([]);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map((n) => n.id));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'منذ قليل';
    if (hours < 24) return `منذ ${hours} ساعة`;
    if (days < 7) return `منذ ${days} يوم`;
    return date.toLocaleDateString('ar-SA');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">الإشعارات</h1>
            <p className="text-muted-foreground">
              {unreadCount > 0 ? `لديك ${unreadCount} إشعارات غير مقروءة` : 'جميع الإشعارات مقروءة'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <Button variant="danger" size="sm" onClick={deleteSelected}>
              <Trash2 className="w-4 h-4 ml-2" />
              حذف المحدد ({selectedIds.length})
            </Button>
          )}
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              <CheckCheck className="w-4 h-4 ml-2" />
              قراءة الكل
            </Button>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الإشعارات</p>
              <p className="text-xl font-bold">{notifications.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-warning/10 flex items-center justify-center">
              <BellRing className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">غير مقروء</p>
              <p className="text-xl font-bold text-warning">{unreadCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
              <Check className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مقروء</p>
              <p className="text-xl font-bold text-success">{notifications.length - unreadCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>قائمة الإشعارات</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={filter === 'all' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              الكل
            </Button>
            <Button
              variant={filter === 'unread' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              غير مقروء
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Select All */}
          <div className="flex items-center gap-3 pb-4 border-b border-border mb-4">
            <input
              type="checkbox"
              checked={selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0}
              onChange={selectAll}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm text-muted-foreground">تحديد الكل</span>
          </div>

          {/* Notifications List */}
          <div className="space-y-3">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>لا توجد إشعارات</p>
              </div>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-start gap-4 p-4 rounded-xl transition-colors ${
                    !notification.read_at ? 'bg-primary/5' : 'hover:bg-muted'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(notification.id)}
                    onChange={() => toggleSelect(notification.id)}
                    className="w-4 h-4 rounded border-border mt-1"
                  />
                  <div className={`w-10 h-10 rounded-full ${typeColors[notification.type]} flex items-center justify-center text-white shrink-0`}>
                    {typeIcons[notification.type]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium">{notification.data.title}</p>
                        <p className="text-sm text-muted-foreground">{notification.data.message}</p>
                      </div>
                      {!notification.read_at && (
                        <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(notification.created_at)}
                      </span>
                      {!notification.read_at && (
                        <button
                          onClick={() => markAsRead(notification.id)}
                          className="text-xs text-primary hover:underline"
                        >
                          تعليم كمقروء
                        </button>
                      )}
                      <button
                        onClick={() => deleteNotification(notification.id)}
                        className="text-xs text-error hover:underline"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
