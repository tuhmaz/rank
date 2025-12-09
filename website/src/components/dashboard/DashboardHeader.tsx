'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, Sun, Moon, Settings } from 'lucide-react';
import { useThemeStore, useSidebarStore, useAuthStore } from '@/store/useStore';
import Button from '@/components/ui/Button';

export default function DashboardHeader() {
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { toggleSidebar } = useSidebarStore();
  const { user } = useAuthStore();
  const [showNotifications, setShowNotifications] = useState(false);

  const notifications = [
    { id: 1, title: 'مستخدم جديد', message: 'انضم أحمد إلى المنصة', time: 'منذ 5 دقائق' },
    { id: 2, title: 'طلب جديد', message: 'لديك طلب خدمة جديد', time: 'منذ 30 دقيقة' },
    { id: 3, title: 'تحديث النظام', message: 'تم تحديث النظام بنجاح', time: 'منذ ساعة' },
  ];

  return (
    <header className="h-16 bg-card border-b border-border px-6 flex items-center justify-between sticky top-0 z-40">
      {/* Left Section */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="lg:hidden p-2 rounded-lg hover:bg-muted transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center gap-2 bg-muted rounded-lg px-3 py-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="بحث..."
            className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-muted transition-colors"
        >
          {isDarkMode ? (
            <Sun className="w-5 h-5 text-warning" />
          ) : (
            <Moon className="w-5 h-5 text-secondary" />
          )}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-lg hover:bg-muted transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full" />
          </button>

          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute left-0 top-full mt-2 w-80 bg-card border border-border rounded-xl shadow-xl overflow-hidden z-50"
            >
              <div className="p-4 border-b border-border">
                <h3 className="font-semibold">الإشعارات</h3>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-muted cursor-pointer border-b border-border last:border-0"
                  >
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                    <p className="text-sm text-muted-foreground">{notification.message}</p>
                    <span className="text-xs text-muted-foreground">{notification.time}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full">
                  عرض جميع الإشعارات
                </Button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Settings */}
        <button className="p-2 rounded-lg hover:bg-muted transition-colors">
          <Settings className="w-5 h-5" />
        </button>

        {/* User Avatar */}
        <div className="flex items-center gap-3 mr-2 pr-4 border-r border-border">
          <div className="text-left hidden sm:block">
            <p className="text-sm font-medium">{user?.name || 'المستخدم'}</p>
            <p className="text-xs text-muted-foreground">{user?.role || 'مدير'}</p>
          </div>
          <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold">
            {user?.name?.[0] || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
}
