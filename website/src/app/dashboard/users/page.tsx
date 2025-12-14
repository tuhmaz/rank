'use client';

import { useEffect, useState } from 'react';
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
import Modal from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { User, Role, Permission } from '@/types';
import { usersService, messagesService, rolesService } from '@/lib/api/services';

const dicebear = (seed: string) => `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;

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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewModal, setViewModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [messageModal, setMessageModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({ open: false, user: null });
  const [editData, setEditData] = useState<{ name: string; email: string; phone: string; bio: string; profile_photo: File | null }>({
    name: '',
    email: '',
    phone: '',
    bio: '',
    profile_photo: null,
  });
  const [messageData, setMessageData] = useState<{ subject: string; body: string }>({
    subject: '',
    body: '',
  });
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [availableRoles, setAvailableRoles] = useState<Role[]>([]);
  const [availablePermissions, setAvailablePermissions] = useState<Permission[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  useEffect(() => {
    let timeout: any;
    const run = async () => {
      try {
        setLoading(true);
        const data = await usersService.getAll(
          searchQuery.trim() ? { search: searchQuery.trim() } : undefined
        );
        const list = Array.isArray((data as any).data) ? (data as any).data : (data as any);
        setUsers(list as User[]);
      } catch (e) {
        console.error(e);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };
    timeout = setTimeout(run, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  const totalUsers = users.length;
  const verifiedUsers = users.filter((u) => !!u.email_verified_at).length;
  const adminUsers = users.filter((u) =>
    (u.roles || []).some((r) => (r.name || '').toLowerCase() === 'admin')
  ).length;

  const getPrimaryRole = (user: User) => {
    const name = ((user.roles && user.roles[0]?.name) || 'user').toLowerCase();
    return name;
  };

  const getStatus = (user: User) => {
    return user.email_verified_at ? 'active' : 'pending';
  };

  const openView = (user: User) => {
    setViewModal({ open: true, user });
  };

  const openEdit = (user: User) => {
    setEditData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      bio: user.bio || '',
      profile_photo: null,
    });
    setSelectedRoles((user.roles || []).map(r => r.name));
    setSelectedPermissions((user.permissions || []).map(p => p.name));
    setEditModal({ open: true, user });
    setActionError(null);
    (async () => {
      try {
        const [roles, perms] = await Promise.all([
          rolesService.getAll(),
          rolesService.getPermissions(),
        ]);
        setAvailableRoles(roles);
        setAvailablePermissions(perms);
      } catch {}
    })();
  };

  const openMessage = (user: User) => {
    setMessageData({ subject: '', body: '' });
    setMessageModal({ open: true, user });
    setActionError(null);
  };

  const openDelete = (user: User) => {
    setDeleteModal({ open: true, user });
    setActionError(null);
  };

  const handleUpdate = async () => {
    if (!editModal.user) return;
    try {
      setActionLoading(true);
      setActionError(null);
      const updated = await usersService.update(editModal.user.id, {
        name: editData.name,
        email: editData.email,
        phone: editData.phone,
        bio: editData.bio,
        profile_photo: editData.profile_photo || undefined,
      });
      let nextUser = updated;
      if (selectedRoles.length || selectedPermissions.length) {
        nextUser = await usersService.updateRolesPermissions(editModal.user.id, {
          roles: selectedRoles,
          permissions: selectedPermissions,
        });
      }
      setUsers(prev => prev.map(u => (u.id === nextUser.id ? { ...u, ...nextUser } : u)));
      setEditModal({ open: false, user: null });
    } catch (e: any) {
      const msg = (e && e.message) || 'فشل حفظ التعديلات';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!messageModal.user) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await messagesService.send({
        recipient_id: messageModal.user.id,
        subject: messageData.subject,
        body: messageData.body,
      });
      setMessageModal({ open: false, user: null });
    } catch (e: any) {
      const msg = (e && e.message) || 'فشل إرسال الرسالة';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.user) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await usersService.delete(deleteModal.user.id);
      setUsers(prev => prev.filter(u => u.id !== deleteModal.user!.id));
      setDeleteModal({ open: false, user: null });
    } catch (e: any) {
      const msg = (e && e.message) || 'فشل حذف المستخدم';
      setActionError(msg);
    } finally {
      setActionLoading(false);
    }
  };

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
        <Card>
          <CardContent className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المستخدمين</p>
              <p className={cn('text-2xl font-bold text-primary')}>{totalUsers.toLocaleString('ar-SA')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">المستخدمون الموثَّقون</p>
              <p className={cn('text-2xl font-bold text-success')}>{verifiedUsers.toLocaleString('ar-SA')}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4">
            <div>
              <p className="text-sm text-muted-foreground">المدراء (Admin)</p>
              <p className={cn('text-2xl font-bold text-warning')}>{adminUsers.toLocaleString('ar-SA')}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Users Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة المستخدمين</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="users-search" className="sr-only">بحث عن مستخدم</label>
              <input
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="users-search"
                name="search"
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
                          src={user.profile_photo_path || dicebear(user.name || String(user.id))}
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
                          roleStyles[getPrimaryRole(user) as keyof typeof roleStyles]
                        )}
                      >
                        {roleLabels[getPrimaryRole(user) as keyof typeof roleLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={cn(
                          'px-2.5 py-1 rounded-full text-xs font-medium',
                          statusStyles[getStatus(user) as keyof typeof statusStyles]
                        )}
                      >
                        {statusLabels[getStatus(user) as keyof typeof statusLabels]}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-sm text-muted-foreground">
                      {user.created_at || ''}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-1">
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" onClick={() => openView(user)}>
                          <Eye className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" onClick={() => openEdit(user)}>
                          <Edit className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-muted transition-colors" onClick={() => openMessage(user)}>
                          <Mail className="w-4 h-4 text-muted-foreground" />
                        </button>
                        <button className="p-1.5 rounded-lg hover:bg-error/10 transition-colors" onClick={() => openDelete(user)}>
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
              إجمالي المستخدمين: {totalUsers.toLocaleString('ar-SA')}
            </p>
            <div className="flex items-center gap-2">
              {loading ? <span className="text-xs text-muted-foreground">جاري الجلب...</span> : null}
            </div>
          </div>
        </CardContent>
      </Card>
      <Modal
        isOpen={viewModal.open}
        onClose={() => setViewModal({ open: false, user: null })}
        title="تفاصيل المستخدم"
        size="md"
      >
        {viewModal.user && (
          <div className="space-y-4 mt-2">
            <div className="flex items-center gap-3">
              <img
                src={viewModal.user.profile_photo_path || dicebear(viewModal.user.name || String(viewModal.user.id))}
                alt={viewModal.user.name}
                className="w-14 h-14 rounded-full bg-muted"
              />
              <div>
                <p className="font-bold">{viewModal.user.name}</p>
                <p className="text-sm text-muted-foreground">{viewModal.user.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground">الدور</p>
                <p className="text-sm">
                  {roleLabels[getPrimaryRole(viewModal.user) as keyof typeof roleLabels]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الحالة</p>
                <p className="text-sm">
                  {statusLabels[getStatus(viewModal.user) as keyof typeof statusLabels]}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">تاريخ الإنشاء</p>
                <p className="text-sm">{viewModal.user.created_at || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">آخر نشاط</p>
                <p className="text-sm">{viewModal.user.last_activity || viewModal.user.last_seen || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">الهاتف</p>
                <p className="text-sm">{viewModal.user.phone || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">المسمى الوظيفي</p>
                <p className="text-sm">{(viewModal.user as any).job_title || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">البلد</p>
                <p className="text-sm">{(viewModal.user as any).country || '-'}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">موثّق البريد</p>
                <p className="text-sm">{viewModal.user.email_verified_at ? 'نعم' : 'لا'}</p>
              </div>
            </div>
            {Array.isArray(viewModal.user.roles) && viewModal.user.roles.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">الأدوار</p>
                <div className="flex flex-wrap gap-2">
                  {viewModal.user.roles.map((r, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">
                      {r.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(viewModal.user.permissions) && viewModal.user.permissions.length > 0 && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">الصلاحيات</p>
                <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                  {viewModal.user.permissions.map((p, i) => (
                    <span key={i} className="px-2 py-1 rounded-full text-xs bg-muted text-muted-foreground">
                      {p.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {viewModal.user.bio && (
              <div>
                <p className="text-xs text-muted-foreground mb-1">النبذة</p>
                <p className="text-sm">{viewModal.user.bio}</p>
              </div>
            )}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="outline" onClick={() => setViewModal({ open: false, user: null })}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Modal
        isOpen={editModal.open}
        onClose={() => setEditModal({ open: false, user: null })}
        title="تعديل المستخدم"
        size="md"
      >
        <div className="space-y-4 mt-2">
          <Input
            label="الاسم"
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            placeholder="اسم المستخدم"
          />
          <Input
            label="البريد الإلكتروني"
            type="email"
            value={editData.email}
            onChange={(e) => setEditData({ ...editData, email: e.target.value })}
            placeholder="email@example.com"
          />
          <Input
            label="الهاتف"
            type="tel"
            value={editData.phone}
            onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
            placeholder="05xxxxxxxx"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">النبذة</label>
            <textarea
              value={editData.bio}
              onChange={(e) => setEditData({ ...editData, bio: e.target.value })}
              rows={4}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="نبذة قصيرة عن المستخدم"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">الصورة الشخصية</label>
            <input
              type="file"
              onChange={(e) => setEditData({ ...editData, profile_photo: e.target.files?.[0] || null })}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground"
            />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <p className="mb-2 text-sm font-medium">الأدوار</p>
              <div className="flex flex-wrap gap-2">
                {availableRoles.map((r) => {
                  const checked = selectedRoles.includes(r.name);
                  return (
                    <label key={r.id} className="flex items-center gap-2 text-sm border rounded-lg px-3 py-1 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedRoles((prev) =>
                            checked ? prev.filter(n => n !== r.name) : [...prev, r.name]
                          );
                        }}
                      />
                      <span>{r.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium">الصلاحيات</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-40 overflow-y-auto border rounded-lg p-2">
                {availablePermissions.map((p) => {
                  const checked = selectedPermissions.includes(p.name);
                  return (
                    <label key={p.id} className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => {
                          setSelectedPermissions((prev) =>
                            checked ? prev.filter(n => n !== p.name) : [...prev, p.name]
                          );
                        }}
                      />
                      <span>{p.name}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
          {actionError ? <p className="text-error text-sm">{actionError}</p> : null}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setEditModal({ open: false, user: null })}>
              إلغاء
            </Button>
            <Button onClick={handleUpdate} isLoading={actionLoading}>
              حفظ
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={messageModal.open}
        onClose={() => setMessageModal({ open: false, user: null })}
        title="مراسلة المستخدم"
        size="md"
      >
        <div className="space-y-4 mt-2">
          <Input
            label="الموضوع"
            value={messageData.subject}
            onChange={(e) => setMessageData({ ...messageData, subject: e.target.value })}
            placeholder="موضوع الرسالة"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">المحتوى</label>
            <textarea
              value={messageData.body}
              onChange={(e) => setMessageData({ ...messageData, body: e.target.value })}
              rows={6}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
          {actionError ? <p className="text-error text-sm">{actionError}</p> : null}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setMessageModal({ open: false, user: null })}>
              إلغاء
            </Button>
            <Button onClick={handleSendMessage} isLoading={actionLoading}>
              إرسال
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, user: null })}
        title="حذف المستخدم"
        size="sm"
      >
        <div className="space-y-4 mt-2">
          <p className="text-sm text-muted-foreground">
            هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء.
          </p>
          {actionError ? <p className="text-error text-sm">{actionError}</p> : null}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={() => setDeleteModal({ open: false, user: null })}>
              إلغاء
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={actionLoading}>
              حذف
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
