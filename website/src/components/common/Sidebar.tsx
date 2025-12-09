'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore, useAuthStore } from '@/store/useStore';

const menuItems = [
  {
    title: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'المستخدمين',
    icon: Users,
    href: '/dashboard/users',
  },
  {
    title: 'التحليلات',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    title: 'التقارير',
    icon: FileText,
    href: '/dashboard/reports',
  },
  {
    title: 'الإشعارات',
    icon: Bell,
    href: '/dashboard/notifications',
  },
  {
    title: 'الإعدادات',
    icon: Settings,
    href: '/dashboard/settings',
  },
];

const bottomItems = [
  {
    title: 'المساعدة',
    icon: HelpCircle,
    href: '/dashboard/help',
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { isOpen, toggleSidebar, setSidebar } = useSidebarStore();
  const { logout, user } = useAuthStore();

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebar(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        className={cn(
          'fixed top-0 right-0 h-full bg-card border-l border-border z-50 flex flex-col transition-all duration-300',
          'lg:relative lg:translate-x-0',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                  <span className="text-white font-bold">R</span>
                </div>
                <span className="font-bold gradient-text">Rank</span>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            {isOpen ? (
              <ChevronRight className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* User Info */}
        <div className={cn('p-4 border-b border-border', !isOpen && 'px-3')}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full gradient-bg flex items-center justify-center text-white font-bold shrink-0">
              {user?.name?.[0] || 'U'}
            </div>
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="font-medium text-sm truncate">{user?.name || 'المستخدم'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative',
                  isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                <item.icon className={cn('w-5 h-5 shrink-0', isActive && 'text-white')} />
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium truncate"
                    >
                      {item.title}
                    </motion.span>
                  )}
                </AnimatePresence>
                {!isOpen && (
                  <div className="absolute right-full mr-2 px-2 py-1 bg-foreground text-background text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {item.title}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-border space-y-2">
          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              <item.icon className="w-5 h-5 shrink-0" />
              <AnimatePresence mode="wait">
                {isOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="text-sm font-medium"
                  >
                    {item.title}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
          ))}
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-error hover:bg-error/10 transition-all duration-200"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  تسجيل الخروج
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>
    </>
  );
}
