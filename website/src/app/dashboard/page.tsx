'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Newspaper,
  Users,
  Activity,
  TrendingUp,
  TrendingDown,
  Clock,
  Eye,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { dashboardService } from '@/lib/api/services';
import type { DashboardData, OnlineUser, RecentActivity } from '@/types';

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await dashboardService.getIndex();
        setData(response);
      } catch (err: any) {
        setError(err.message || 'فشل في تحميل البيانات');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-destructive mb-2">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="text-primary hover:underline"
            >
              إعادة المحاولة
            </button>
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'إجمالي المقالات',
      value: data?.totals.articles ?? 0,
      change: data?.trends.articles.percentage ?? 0,
      trend: data?.trends.articles.trend ?? 'up',
      icon: FileText,
      color: 'bg-blue-500',
    },
    {
      title: 'إجمالي الأخبار',
      value: data?.totals.news ?? 0,
      change: data?.trends.news.percentage ?? 0,
      trend: data?.trends.news.trend ?? 'up',
      icon: Newspaper,
      color: 'bg-green-500',
    },
    {
      title: 'إجمالي المستخدمين',
      value: data?.totals.users ?? 0,
      change: data?.trends.users.percentage ?? 0,
      trend: data?.trends.users.trend ?? 'up',
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      title: 'المستخدمين المتصلين',
      value: data?.totals.online_users ?? 0,
      change: 0,
      trend: 'up' as const,
      icon: Activity,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">لوحة التحكم</h1>
          <p className="text-muted-foreground">مرحباً بك! إليك نظرة عامة على أداء منصتك</p>
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
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold mt-1">
                      {typeof stat.value === 'number' ? stat.value.toLocaleString('ar-SA') : stat.value}
                    </p>
                  </div>
                  <div className={`${stat.color} p-3 rounded-lg text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                {stat.change !== 0 && (
                  <div className="flex items-center mt-4 text-sm">
                    {stat.trend === 'up' ? (
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                    )}
                    <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-muted-foreground mr-2">مقارنة بالأسبوع الماضي</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Analytics Chart & Online Users */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Analytics Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>تحليلات الأسبوع</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.analytics && (
                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-4 text-center">
                    <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
                      <Eye className="h-5 w-5 text-blue-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">الزيارات</p>
                      <p className="text-lg font-bold text-blue-600">
                        {data.analytics.views?.reduce((a, b) => a + b, 0).toLocaleString('ar-SA') || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                      <FileText className="h-5 w-5 text-green-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">مقالات جديدة</p>
                      <p className="text-lg font-bold text-green-600">
                        {data.analytics.articles?.reduce((a, b) => a + b, 0) || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
                      <Newspaper className="h-5 w-5 text-purple-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">أخبار جديدة</p>
                      <p className="text-lg font-bold text-purple-600">
                        {data.analytics.news?.reduce((a, b) => a + b, 0) || 0}
                      </p>
                    </div>
                    <div className="p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
                      <Users className="h-5 w-5 text-orange-500 mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">كتّاب جدد</p>
                      <p className="text-lg font-bold text-orange-600">
                        {data.analytics.authors?.reduce((a, b) => a + b, 0) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Online Users */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-green-500" />
                المستخدمين المتصلين
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {data?.onlineUsers && data.onlineUsers.length > 0 ? (
                  data.onlineUsers.map((user: OnlineUser) => (
                    <div key={user.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-white font-medium">
                          {user.name.charAt(0)}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${
                          user.status === 'online' ? 'bg-green-500' :
                          user.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                        }`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.status === 'online' ? 'متصل الآن' :
                           user.status === 'away' ? 'بعيد' : 'غير متصل'}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">لا يوجد مستخدمين متصلين</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            النشاطات الأخيرة
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recentActivities && data.recentActivities.length > 0 ? (
              data.recentActivities.map((activity: RecentActivity, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-4 p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <div className={`p-2 rounded-lg ${
                    activity.type === 'article' ? 'bg-blue-100 text-blue-600 dark:bg-blue-950' :
                    activity.type === 'news' ? 'bg-green-100 text-green-600 dark:bg-green-950' :
                    'bg-purple-100 text-purple-600 dark:bg-purple-950'
                  }`}>
                    {activity.type === 'article' ? <FileText className="h-5 w-5" /> :
                     activity.type === 'news' ? <Newspaper className="h-5 w-5" /> :
                     <Activity className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium">
                      {activity.type === 'article' ? 'مقال جديد: ' :
                       activity.type === 'news' ? 'خبر جديد: ' :
                       'تعليق جديد: '}
                      <span className="text-primary">{activity.title || activity.body?.slice(0, 50)}</span>
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                      <span>بواسطة {activity.author?.name || activity.user?.name || 'مجهول'}</span>
                      <span>•</span>
                      <span>{new Date(activity.created_at).toLocaleDateString('ar-SA')}</span>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">لا توجد نشاطات حديثة</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
