'use client';

import { motion } from 'framer-motion';
import {
  Users,
  DollarSign,
  ShoppingCart,
  TrendingUp,
  ArrowUp,
  ArrowDown,
  MoreHorizontal,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import StatsCard from '@/components/dashboard/StatsCard';
import RevenueChart from '@/components/dashboard/RevenueChart';
import RecentOrders from '@/components/dashboard/RecentOrders';
import TopProducts from '@/components/dashboard/TopProducts';

const stats = [
  {
    title: 'إجمالي المستخدمين',
    value: '12,543',
    change: 12.5,
    changeType: 'increase' as const,
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'الإيرادات',
    value: '45,230 ر.س',
    change: 8.2,
    changeType: 'increase' as const,
    icon: DollarSign,
    color: 'bg-green-500',
  },
  {
    title: 'الطلبات',
    value: '1,234',
    change: -2.4,
    changeType: 'decrease' as const,
    icon: ShoppingCart,
    color: 'bg-purple-500',
  },
  {
    title: 'معدل النمو',
    value: '23.5%',
    change: 4.1,
    changeType: 'increase' as const,
    icon: TrendingUp,
    color: 'bg-orange-500',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">مرحباً بك! إليك نظرة عامة على أداء منصتك</p>
        </div>
        <div className="flex items-center gap-2">
          <select className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
            <option>آخر 7 أيام</option>
            <option>آخر 30 يوم</option>
            <option>آخر 3 أشهر</option>
            <option>السنة الحالية</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StatsCard {...stat} />
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <TopProducts />
        </div>
      </div>

      {/* Recent Orders */}
      <RecentOrders />
    </div>
  );
}
