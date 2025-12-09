'use client';

import { motion } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Eye,
  Clock,
  Globe,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

const visitorData = [
  { name: 'يناير', visitors: 4000, pageViews: 2400 },
  { name: 'فبراير', visitors: 3000, pageViews: 1398 },
  { name: 'مارس', visitors: 2000, pageViews: 9800 },
  { name: 'أبريل', visitors: 2780, pageViews: 3908 },
  { name: 'مايو', visitors: 1890, pageViews: 4800 },
  { name: 'يونيو', visitors: 2390, pageViews: 3800 },
  { name: 'يوليو', visitors: 3490, pageViews: 4300 },
];

const deviceData = [
  { name: 'الهاتف', value: 55, color: '#3b82f6' },
  { name: 'الكمبيوتر', value: 35, color: '#8b5cf6' },
  { name: 'التابلت', value: 10, color: '#22c55e' },
];

const countryData = [
  { country: 'السعودية', visitors: 4500, percentage: 45 },
  { country: 'الإمارات', visitors: 2300, percentage: 23 },
  { country: 'مصر', visitors: 1500, percentage: 15 },
  { country: 'الأردن', visitors: 800, percentage: 8 },
  { country: 'الكويت', visitors: 500, percentage: 5 },
  { country: 'أخرى', visitors: 400, percentage: 4 },
];

const trafficSources = [
  { source: 'البحث المجاني', visits: 5420, change: 12.5 },
  { source: 'مباشر', visits: 3210, change: 8.2 },
  { source: 'وسائل التواصل', visits: 2100, change: -3.4 },
  { source: 'الإحالة', visits: 1800, change: 5.1 },
  { source: 'البريد الإلكتروني', visits: 900, change: 15.3 },
];

const stats = [
  {
    title: 'الزوار',
    value: '24,532',
    change: 12.5,
    changeType: 'increase',
    icon: Users,
    color: 'bg-blue-500',
  },
  {
    title: 'مشاهدات الصفحة',
    value: '89,432',
    change: 8.2,
    changeType: 'increase',
    icon: Eye,
    color: 'bg-purple-500',
  },
  {
    title: 'متوسط وقت الجلسة',
    value: '3:45',
    change: -2.4,
    changeType: 'decrease',
    icon: Clock,
    color: 'bg-orange-500',
  },
  {
    title: 'معدل الارتداد',
    value: '42.3%',
    change: -5.1,
    changeType: 'decrease',
    icon: TrendingDown,
    color: 'bg-green-500',
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">التحليلات</h1>
          <p className="text-muted-foreground">تتبع أداء موقعك وتحليل سلوك الزوار</p>
        </div>
        <select className="bg-card border border-border rounded-lg px-3 py-2 text-sm">
          <option>آخر 7 أيام</option>
          <option>آخر 30 يوم</option>
          <option>آخر 3 أشهر</option>
          <option>السنة الحالية</option>
        </select>
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
              <CardContent>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <div className={cn(
                      'flex items-center gap-1 text-sm',
                      stat.changeType === 'increase' ? 'text-success' : 'text-error'
                    )}>
                      {stat.changeType === 'increase' ? (
                        <ArrowUp className="w-4 h-4" />
                      ) : (
                        <ArrowDown className="w-4 h-4" />
                      )}
                      <span>{Math.abs(stat.change)}%</span>
                    </div>
                  </div>
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', stat.color)}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Visitors Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>الزوار ومشاهدات الصفحة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitorData}>
                  <defs>
                    <linearGradient id="colorVisitors" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorPageViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="visitors"
                    name="الزوار"
                    stroke="#3b82f6"
                    fill="url(#colorVisitors)"
                  />
                  <Area
                    type="monotone"
                    dataKey="pageViews"
                    name="المشاهدات"
                    stroke="#8b5cf6"
                    fill="url(#colorPageViews)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Device Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>توزيع الأجهزة</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={deviceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {deviceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-4 mt-4">
              {deviceData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">
                    {item.name} ({item.value}%)
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>مصادر الزيارات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trafficSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="font-medium">{source.source}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-muted-foreground">{source.visits.toLocaleString()}</span>
                    <span className={cn(
                      'flex items-center gap-1 text-sm',
                      source.change > 0 ? 'text-success' : 'text-error'
                    )}>
                      {source.change > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(source.change)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Countries */}
        <Card>
          <CardHeader>
            <CardTitle>أعلى الدول</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {countryData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      <span className="font-medium">{item.country}</span>
                    </div>
                    <span className="text-muted-foreground">
                      {item.visitors.toLocaleString()} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      className="h-full bg-primary rounded-full"
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
