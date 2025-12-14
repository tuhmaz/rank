'use client';

import { useState, useEffect, useCallback } from 'react';
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
  RefreshCw,
  Trash2,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { securityService } from '@/lib/api/services';
import type { SecurityLog } from '@/types';

const severityColors: Record<string, 'success' | 'warning' | 'error' | 'info'> = {
  info: 'info',
  warning: 'warning',
  danger: 'error',
  critical: 'error',
};

const severityLabels: Record<string, string> = {
  info: 'معلومات',
  warning: 'تحذير',
  danger: 'خطر',
  critical: 'حرج',
};

const eventTypeLabels: Record<string, string> = {
  login_failed: 'فشل تسجيل الدخول',
  suspicious_activity: 'نشاط مشبوه',
  blocked_access: 'وصول محظور',
  unauthorized_access: 'وصول غير مصرح',
  password_reset: 'إعادة تعيين كلمة المرور',
  account_locked: 'حساب مقفل',
  permission_change: 'تغيير الصلاحيات',
};

interface SecurityOverviewData {
  stats: {
    total_events: number;
    unresolved_events: number;
    high_risk_events: number;
    blocked_ips: number;
  };
  recent_logs: SecurityLog[];
}

export default function SecurityPage() {
  const [overview, setOverview] = useState<SecurityOverviewData | null>(null);
  const [logs, setLogs] = useState<SecurityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<SecurityLog | null>(null);
  const [resolveModal, setResolveModal] = useState<{ open: boolean; log: SecurityLog | null }>({
    open: false,
    log: null,
  });
  const [resolveNotes, setResolveNotes] = useState('');
  const [blockModal, setBlockModal] = useState<{ open: boolean; ip: string; reason: string }>({
    open: false,
    ip: '',
    reason: '',
  });
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [filters, setFilters] = useState({
    event_type: '',
    severity: '',
    is_resolved: '',
  });

  const fetchOverview = async () => {
    try {
      const data = await securityService.getOverview();
      setOverview(data);
    } catch (err) {
      console.error('Failed to fetch overview:', err);
    }
  };

  const fetchLogs = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await securityService.getLogs({
        page,
        per_page: 20,
        ip: searchQuery || undefined,
        event_type: filters.event_type || undefined,
        severity: filters.severity || undefined,
        is_resolved: filters.is_resolved || undefined,
      });
      setLogs(response.data);
      setPagination(response.pagination);
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filters]);

  useEffect(() => {
    fetchOverview();
    fetchLogs(1);
  }, []);

  useEffect(() => {
    const debounce = setTimeout(() => {
      fetchLogs(1);
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery, filters]);

  const handleResolve = async () => {
    if (!resolveModal.log || !resolveNotes.trim()) return;
    try {
      setActionLoading(resolveModal.log.id);
      await securityService.resolveLog(resolveModal.log.id, resolveNotes);
      setResolveModal({ open: false, log: null });
      setResolveNotes('');
      fetchLogs(pagination?.current_page ?? 1);
      fetchOverview();
    } catch (err) {
      console.error('Failed to resolve log:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleBlockIp = async () => {
    if (!blockModal.ip || !blockModal.reason.trim()) return;
    try {
      await securityService.blockIp(blockModal.ip, blockModal.reason);
      setBlockModal({ open: false, ip: '', reason: '' });
      fetchOverview();
    } catch (err) {
      console.error('Failed to block IP:', err);
    }
  };

  const handleDeleteLog = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا السجل؟')) return;
    try {
      setActionLoading(id);
      await securityService.deleteLog(id);
      fetchLogs(pagination?.current_page ?? 1);
      fetchOverview();
    } catch (err) {
      console.error('Failed to delete log:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'created_at',
      title: 'الوقت',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{new Date(value).toLocaleString('ar-SA')}</span>
        </div>
      ),
    },
    {
      key: 'ip_address',
      title: 'عنوان IP',
      render: (value: string, item: SecurityLog) => (
        <div>
          <p className="font-mono text-sm">{value}</p>
          {item.risk_score !== undefined && (
            <p className={`text-xs ${item.risk_score > 50 ? 'text-error' : 'text-muted-foreground'}`}>
              مستوى الخطر: {item.risk_score}%
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'event_type',
      title: 'نوع الحدث',
      render: (value: string, item: SecurityLog) => (
        <div>
          <Badge
            variant={item.event_type_color === 'danger' ? 'error' :
                    item.event_type_color === 'warning' ? 'warning' :
                    item.event_type_color === 'info' ? 'info' : 'default'}
          >
            {eventTypeLabels[value] || value.replace(/_/g, ' ')}
          </Badge>
        </div>
      ),
    },
    {
      key: 'severity',
      title: 'الخطورة',
      render: (value: string) => (
        <Badge variant={severityColors[value]}>{severityLabels[value] || value}</Badge>
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
            title="عرض التفاصيل"
          >
            <Eye className="w-4 h-4 text-muted-foreground" />
          </button>
          {!item.is_resolved && (
            <button
              onClick={() => setResolveModal({ open: true, log: item })}
              disabled={actionLoading === item.id}
              className="p-1.5 rounded-lg hover:bg-success/10 transition-colors disabled:opacity-50"
              title="تعليم كمحلول"
            >
              <CheckCircle className="w-4 h-4 text-success" />
            </button>
          )}
          <button
            onClick={() => setBlockModal({ open: true, ip: item.ip_address, reason: '' })}
            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
            title="حظر IP"
          >
            <Ban className="w-4 h-4 text-error" />
          </button>
          <button
            onClick={() => handleDeleteLog(item.id)}
            disabled={actionLoading === item.id}
            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
            title="حذف"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  const unresolvedCount = overview?.stats?.unresolved_events ?? 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">مركز الأمان</h1>
          <p className="text-muted-foreground">مراقبة وإدارة أمان النظام</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            onClick={() => { fetchOverview(); fetchLogs(1); }}
            disabled={loading}
          >
            تحديث
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
                  <p className="text-2xl font-bold">
                    {(overview?.stats?.total_events ?? 0).toLocaleString('ar-SA')}
                  </p>
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
                  <p className="text-2xl font-bold text-warning">{unresolvedCount}</p>
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
                  <p className="text-sm text-muted-foreground">عالي الخطورة</p>
                  <p className="text-2xl font-bold text-error">
                    {overview?.stats?.high_risk_events ?? 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardContent className="py-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-error/10 flex items-center justify-center">
                  <Ban className="w-6 h-6 text-error" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">IPs محظورة</p>
                  <p className="text-2xl font-bold">{overview?.stats?.blocked_ips ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Critical Alerts */}
      {unresolvedCount > 10 && (
        <Card className="border-error/50 bg-error/5">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <AlertTriangle className="w-8 h-8 text-error" />
              <div>
                <p className="font-bold text-error">تنبيه أمني!</p>
                <p className="text-sm text-muted-foreground">
                  لديك {unresolvedCount} سجل غير محلول يحتاج إلى مراجعة
                </p>
              </div>
              <Button
                variant="danger"
                size="sm"
                className="mr-auto"
                onClick={() => setFilters({ ...filters, is_resolved: 'false' })}
              >
                مراجعة الآن
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={filters.event_type}
              onChange={(e) => setFilters({ ...filters, event_type: e.target.value })}
              className="bg-muted border-none rounded-lg px-3 py-2 text-sm"
            >
              <option value="">جميع الأحداث</option>
              <option value="login_failed">فشل تسجيل الدخول</option>
              <option value="suspicious_activity">نشاط مشبوه</option>
              <option value="blocked_access">وصول محظور</option>
              <option value="unauthorized_access">وصول غير مصرح</option>
              <option value="account_locked">حساب مقفل</option>
            </select>
            <select
              value={filters.severity}
              onChange={(e) => setFilters({ ...filters, severity: e.target.value })}
              className="bg-muted border-none rounded-lg px-3 py-2 text-sm"
            >
              <option value="">جميع المستويات</option>
              <option value="info">معلومات</option>
              <option value="warning">تحذير</option>
              <option value="danger">خطر</option>
              <option value="critical">حرج</option>
            </select>
            <select
              value={filters.is_resolved}
              onChange={(e) => setFilters({ ...filters, is_resolved: e.target.value })}
              className="bg-muted border-none rounded-lg px-3 py-2 text-sm"
            >
              <option value="">الكل</option>
              <option value="true">محلول</option>
              <option value="false">غير محلول</option>
            </select>
            {(filters.event_type || filters.severity || filters.is_resolved) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ event_type: '', severity: '', is_resolved: '' })}
              >
                مسح الفلاتر
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>سجلات الأمان</CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث بـ IP..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={logs}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchLogs(page)}
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
                <p className="text-sm text-muted-foreground">مستوى الخطر</p>
                <p className={selectedLog.risk_score && selectedLog.risk_score > 50 ? 'text-error font-bold' : ''}>
                  {selectedLog.risk_score}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">نوع الحدث</p>
                <p>{eventTypeLabels[selectedLog.event_type] || selectedLog.event_type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الخطورة</p>
                <Badge variant={severityColors[selectedLog.severity]}>
                  {severityLabels[selectedLog.severity]}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">التاريخ</p>
                <p>{new Date(selectedLog.created_at).toLocaleString('ar-SA')}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الحالة</p>
                <Badge variant={selectedLog.is_resolved ? 'success' : 'warning'}>
                  {selectedLog.is_resolved ? 'محلول' : 'قيد المراجعة'}
                </Badge>
              </div>
            </div>
            {selectedLog.description && (
              <div>
                <p className="text-sm text-muted-foreground">الوصف</p>
                <p>{selectedLog.description}</p>
              </div>
            )}
            {selectedLog.resolution_notes && (
              <div>
                <p className="text-sm text-muted-foreground">ملاحظات الحل</p>
                <p className="bg-muted p-3 rounded-lg">{selectedLog.resolution_notes}</p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setSelectedLog(null)}>
                إغلاق
              </Button>
              {!selectedLog.is_resolved && (
                <Button onClick={() => {
                  setSelectedLog(null);
                  setResolveModal({ open: true, log: selectedLog });
                }}>
                  تعليم كمحلول
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Resolve Modal */}
      <Modal
        isOpen={resolveModal.open}
        onClose={() => { setResolveModal({ open: false, log: null }); setResolveNotes(''); }}
        title="تعليم كمحلول"
      >
        <div className="space-y-4 mt-4">
          <div>
            <label className="text-sm text-muted-foreground">ملاحظات الحل *</label>
            <textarea
              value={resolveNotes}
              onChange={(e) => setResolveNotes(e.target.value)}
              placeholder="أدخل ملاحظات عن كيفية حل المشكلة..."
              className="w-full bg-muted border-none rounded-lg p-3 text-sm mt-1 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => { setResolveModal({ open: false, log: null }); setResolveNotes(''); }}
            >
              إلغاء
            </Button>
            <Button
              onClick={handleResolve}
              disabled={!resolveNotes.trim()}
              loading={actionLoading === resolveModal.log?.id}
            >
              تأكيد
            </Button>
          </div>
        </div>
      </Modal>

      {/* Block IP Modal */}
      <Modal
        isOpen={blockModal.open}
        onClose={() => setBlockModal({ open: false, ip: '', reason: '' })}
        title="حظر عنوان IP"
      >
        <div className="space-y-4 mt-4">
          <div>
            <p className="text-sm text-muted-foreground">عنوان IP</p>
            <p className="font-mono text-lg">{blockModal.ip}</p>
          </div>
          <div>
            <label className="text-sm text-muted-foreground">سبب الحظر *</label>
            <textarea
              value={blockModal.reason}
              onChange={(e) => setBlockModal({ ...blockModal, reason: e.target.value })}
              placeholder="أدخل سبب حظر هذا العنوان..."
              className="w-full bg-muted border-none rounded-lg p-3 text-sm mt-1 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setBlockModal({ open: false, ip: '', reason: '' })}
            >
              إلغاء
            </Button>
            <Button
              variant="danger"
              onClick={handleBlockIp}
              disabled={!blockModal.reason.trim()}
            >
              حظر
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
