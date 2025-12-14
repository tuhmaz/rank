'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  Search,
  Filter,
  Eye,
  Ban,
  CheckCircle,
  AlertTriangle,
  Globe,
  Clock,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import type { SecurityLog, SecurityStats } from '@/types';

const mockStats: SecurityStats = {
  total_logs: 1250,
  unresolved_logs: 45,
  blocked_ips: 12,
  trusted_ips: 5,
  logs_today: 87,
  critical_alerts: 3,
};

const mockLogs: SecurityLog[] = [
  {
    id: 1,
    ip_address: '192.168.1.100',
    route: '/api/login',
    method: 'POST',
    event_type: 'failed_login',
    severity: 'medium',
    description: 'محاولة تسجيل دخول فاشلة متكررة',
    is_resolved: false,
    country: 'السعودية',
    city: 'الرياض',
    created_at: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    ip_address: '10.0.0.55',
    route: '/api/admin',
    method: 'GET',
    event_type: 'unauthorized_access',
    severity: 'high',
    description: 'محاولة وصول غير مصرح',
    is_resolved: false,
    country: 'مصر',
    city: 'القاهرة',
    created_at: '2024-01-15 09:45:00',
  },
  {
    id: 3,
    ip_address: '172.16.0.10',
    route: '/api/users',
    method: 'DELETE',
    event_type: 'suspicious_activity',
    severity: 'critical',
    description: 'نشاط مشبوه - محاولة حذف جماعي',
    is_resolved: true,
    country: 'الإمارات',
    city: 'دبي',
    created_at: '2024-01-15 08:20:00',
  },
  {
    id: 4,
    ip_address: '192.168.2.50',
    route: '/api/files',
    method: 'POST',
    event_type: 'rate_limit',
    severity: 'low',
    description: 'تجاوز حد الطلبات',
    is_resolved: true,
    country: 'الأردن',
    city: 'عمان',
    created_at: '2024-01-14 22:15:00',
  },
];

const severityColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  low: 'success',
  medium: 'warning',
  high: 'error',
  critical: 'error',
};

const severityLabels: Record<string, string> = {
  low: 'منخفض',
  medium: 'متوسط',
  high: 'عالي',
  critical: 'حرج',
};

export default function SecurityPage() {
  const [logs, setLogs] = useState<SecurityLog[]>(mockLogs);
  const [stats] = useState<SecurityStats>(mockStats);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);

  const columns = [
    {
      key: 'created_at',
      title: 'الوقت',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{value}</span>
        </div>
      ),
    },
    {
      key: 'ip_address',
      title: 'عنوان IP',
      render: (value: string, item: SecurityLog) => (
        <div>
          <p className="font-mono text-sm">{value}</p>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Globe className="w-3 h-3" />
            {item.country}, {item.city}
          </p>
        </div>
      ),
    },
    {
      key: 'event_type',
      title: 'نوع الحدث',
      render: (value: string) => (
        <span className="text-sm">{value.replace(/_/g, ' ')}</span>
      ),
    },
    {
      key: 'severity',
      title: 'الخطورة',
      render: (value: string) => (
        <Badge variant={severityColors[value]}>{severityLabels[value]}</Badge>
      ),
    },
    {
      key: 'is_resolved',
      title: 'الحالة',
      render: (value: boolean) => (
        value ? (
          <Badge variant="success">تم الحل</Badge>
        ) : (
          <Badge variant="warning">قيد المراجعة</Badge>
        )
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: SecurityLog) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSelectedLog(item)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          {!item.is_resolved && (
            <button
              onClick={() => resolveLog(item.id)}
              className="p-1.5 rounded-lg hover:bg-success/10 transition-colors"
            >
              <CheckCircle className="w-4 h-4 text-success" />
            </button>
          )}
          <button
            onClick={() => blockIp(item.ip_address)}
            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
          >
            <Ban className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  const resolveLog = (id: number) => {
    setLogs(logs.map((log) =>
      log.id === id ? { ...log, is_resolved: true } : log
    ));
  };

  const blockIp = (ip: string) => {
    if (confirm(`هل أنت متأكد من حظر عنوان IP: ${ip}؟`)) {
      alert(`تم حظر ${ip} بنجاح`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مركز الأمان</h1>
          <p className="text-muted-foreground">مراقبة وإدارة أمان النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" leftIcon={<Filter className="w-4 h-4" />}>
            فلترة
          </Button>
          <Button leftIcon={<Shield className="w-4 h-4" />}>
            فحص أمني
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">إجمالي السجلات</p>
                  <p className="text-2xl font-bold">{stats.total_logs.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                  <ShieldAlert className="w-6 h-6 text-warning" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">غير محلول</p>
                  <p className="text-2xl font-bold text-warning">{stats.unresolved_logs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                  <ShieldX className="w-6 h-6 text-error" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IPs محظورة</p>
                  <p className="text-2xl font-bold text-error">{stats.blocked_ips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6 text-success" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IPs موثوقة</p>
                  <p className="text-2xl font-bold text-success">{stats.trusted_ips}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Critical Alerts */}
      {stats.critical_alerts > 0 && (
        <Card className="border-error/50 bg-error/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-error" />
              <div>
                <p className="font-bold text-error">تنبيهات حرجة!</p>
                <p className="text-sm text-muted-foreground">
                  لديك {stats.critical_alerts} تنبيهات حرجة تحتاج إلى مراجعة فورية
                </p>
              </div>
              <Button variant="danger" size="sm" className="mr-auto">
                مراجعة الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Logs Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>سجلات الأمان</CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث بـ IP أو الحدث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={logs.filter((log) =>
              log.ip_address.includes(searchQuery) ||
              log.event_type.includes(searchQuery)
            )}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Log Details Modal */}
      <Modal
        isOpen={!!selectedLog}
        onClose={() => setSelectedLog(null)}
        title="تفاصيل السجل"
        size="lg"
      >
        {selectedLog && (
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">عنوان IP</p>
                <p className="font-mono">{selectedLog.ip_address}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الموقع</p>
                <p>{selectedLog.country}, {selectedLog.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">المسار</p>
                <p className="font-mono">{selectedLog.route}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الطريقة</p>
                <Badge>{selectedLog.method}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع الحدث</p>
                <p>{selectedLog.event_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الخطورة</p>
                <Badge variant={severityColors[selectedLog.severity]}>
                  {severityLabels[selectedLog.severity]}
                </Badge>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الوصف</p>
              <p>{selectedLog.description}</p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                إغلاق
              </Button>
              {!selectedLog.is_resolved && (
                <Button onClick={() => { resolveLog(selectedLog.id); setSelectedLog(null); }}>
                  تعليم كمحلول
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
