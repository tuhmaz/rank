'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Users,
  Settings,
  BarChart3,
  Bell,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  GraduationCap,
  Calendar,
  Shield,
  Mail,
  Newspaper,
  Moon,
  Sun,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSidebarStore, useAuthStore } from '@/store/useStore';

interface MenuItem {
  title: string;
  icon: any;
  href?: string;
  badge?: string | number;
  children?: { title: string; href: string; badge?: string | number }[];
}

const menuItems: MenuItem[] = [
  {
    title: 'لوحة التحكم',
    icon: LayoutDashboard,
    href: '/dashboard',
  },
  {
    title: 'المحتوى',
    icon: Newspaper,
    children: [
      { title: 'المقالات', href: '/dashboard/articles' },
      { title: 'الفئات', href: '/dashboard/categories' },
      { title: 'المنشورات', href: '/dashboard/posts' },
      { title: 'الملفات', href: '/dashboard/files' },
    ],
  },
  {
    title: 'التعليم',
    icon: GraduationCap,
    children: [
      { title: 'الصفوف الدراسية', href: '/dashboard/school-classes' },
      { title: 'المواد', href: '/dashboard/subjects' },
      { title: 'الفصول', href: '/dashboard/semesters' },
    ],
  },
  {
    title: 'المستخدمين',
    icon: Users,
    href: '/dashboard/users',
  },
  {
    title: 'الصلاحيات',
    icon: Lock,
    children: [
      { title: 'الأدوار', href: '/dashboard/roles' },
      { title: 'الصلاحيات', href: '/dashboard/permissions' },
    ],
  },
  {
    title: 'الأمان',
    icon: Shield,
    href: '/dashboard/security',
  },
  {
    title: 'التحليلات',
    icon: BarChart3,
    href: '/dashboard/analytics',
  },
  {
    title: 'الرسائل',
    icon: Mail,
    href: '/dashboard/messages',
  },
  {
    title: 'الإشعارات',
    icon: Bell,
    href: '/dashboard/notifications',
  },
  {
    title: 'التقويم',
    icon: Calendar,
    href: '/dashboard/calendar',
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
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Auto-expand parent menu when child is active
  useEffect(() => {
    menuItems.forEach((item) => {
      if (item.children?.some((child) => pathname === child.href)) {
        if (!expandedItems.includes(item.title)) {
          setExpandedItems((prev) => [...prev, item.title]);
        }
      }
    });
  }, [pathname]);

  const toggleExpand = (title: string) => {
    setExpandedItems((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const isItemActive = (item: MenuItem): boolean => {
    if (item.href) {
      return pathname === item.href;
    }
    if (item.children) {
      return item.children.some((child) => pathname === child.href);
    }
    return false;
  };

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isOpen ? 280 : 80 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'fixed top-0 right-0 h-full z-50 flex flex-col',
          'bg-card/95 backdrop-blur-xl border-l border-border/50',
          'shadow-xl shadow-black/5',
          'lg:relative lg:translate-x-0',
          !isOpen && '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border/50">
          <AnimatePresence mode="wait">
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-3"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/25">
                  <span className="text-white font-bold text-lg">R</span>
                </div>
                <div>
                  <span className="font-bold text-lg bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    Rank
                  </span>
                  <p className="text-[10px] text-muted-foreground -mt-1">لوحة التحكم</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-muted/80 transition-colors"
          >
            {isOpen ? (
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-muted-foreground" />
            )}
          </motion.button>
        </div>

        {/* User Info */}
        <div className={cn('p-4 border-b border-border/50', !isOpen && 'px-3')}>
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold shadow-lg shadow-primary/20">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-success rounded-full border-2 border-card" />
            </div>
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="overflow-hidden flex-1"
                >
                  <p className="font-semibold text-sm truncate">{user?.name || 'المستخدم'}</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email || 'user@example.com'}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          {menuItems.map((item) => {
            const isActive = isItemActive(item);
            const isExpanded = expandedItems.includes(item.title);
            const hasChildren = item.children && item.children.length > 0;

            if (hasChildren) {
              return (
                <div key={item.title}>
                  <button
                    onClick={() => toggleExpand(item.title)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                    )}
                  >
                    <div className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                      isActive ? 'bg-primary/10' : 'bg-muted/50 group-hover:bg-muted'
                    )}>
                      <item.icon className={cn('w-5 h-5', isActive && 'text-primary')} />
                    </div>
                    <AnimatePresence mode="wait">
                      {isOpen && (
                        <motion.span
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="text-sm font-medium flex-1 text-right"
                        >
                          {item.title}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    {isOpen && (
                      <ChevronDown
                        className={cn(
                          'w-4 h-4 transition-transform duration-200',
                          isExpanded && 'rotate-180'
                        )}
                      />
                    )}
                  </button>

                  <AnimatePresence>
                    {isOpen && isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="pr-12 mt-1 space-y-1">
                          {item.children?.map((child) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className={cn(
                                'flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all duration-200',
                                pathname === child.href
                                  ? 'bg-primary text-white shadow-md shadow-primary/25'
                                  : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                              )}
                            >
                              <span>{child.title}</span>
                              {child.badge && (
                                <span className="px-1.5 py-0.5 text-[10px] font-bold bg-secondary text-white rounded-full">
                                  {child.badge}
                                </span>
                              )}
                            </Link>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href!}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative',
                  isActive
                    ? 'bg-gradient-to-l from-primary to-primary/80 text-white shadow-lg shadow-primary/25'
                    : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground'
                )}
              >
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                  isActive ? 'bg-white/20' : 'bg-muted/50 group-hover:bg-muted'
                )}>
                  <item.icon className={cn('w-5 h-5', isActive && 'text-white')} />
                </div>
                <AnimatePresence mode="wait">
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex-1 flex items-center justify-between"
                    >
                      <span className="text-sm font-medium">{item.title}</span>
                      {item.badge && (
                        <span className={cn(
                          'px-1.5 py-0.5 text-[10px] font-bold rounded-full',
                          isActive ? 'bg-white/20 text-white' : 'bg-secondary text-white'
                        )}>
                          {item.badge}
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
                {!isOpen && (
                  <div className="absolute right-full mr-3 px-3 py-1.5 bg-foreground text-background text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg z-50">
                    {item.title}
                    <div className="absolute top-1/2 -translate-y-1/2 left-full w-0 h-0 border-t-4 border-b-4 border-l-4 border-transparent border-l-foreground" />
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 border-t border-border/50 space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
          >
            <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
              {isDarkMode ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </div>
            <AnimatePresence mode="wait">
              {isOpen && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  {isDarkMode ? 'الوضع الفاتح' : 'الوضع المظلم'}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          {bottomItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-muted/50 hover:text-foreground transition-all duration-200"
            >
              <div className="w-9 h-9 rounded-lg bg-muted/50 flex items-center justify-center">
                <item.icon className="w-5 h-5" />
              </div>
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-error hover:bg-error/10 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-lg bg-error/10 flex items-center justify-center group-hover:bg-error/20 transition-colors">
              <LogOut className="w-5 h-5" />
            </div>
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
