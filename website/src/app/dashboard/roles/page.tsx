'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Shield, Users, Check } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import type { Role, Permission } from '@/types';

const mockPermissions: Permission[] = [
  { id: 1, name: 'users.view', display_name: 'عرض المستخدمين', group: 'المستخدمون' },
  { id: 2, name: 'users.create', display_name: 'إضافة مستخدم', group: 'المستخدمون' },
  { id: 3, name: 'users.edit', display_name: 'تعديل مستخدم', group: 'المستخدمون' },
  { id: 4, name: 'users.delete', display_name: 'حذف مستخدم', group: 'المستخدمون' },
  { id: 5, name: 'articles.view', display_name: 'عرض المقالات', group: 'المقالات' },
  { id: 6, name: 'articles.create', display_name: 'إضافة مقال', group: 'المقالات' },
  { id: 7, name: 'articles.edit', display_name: 'تعديل مقال', group: 'المقالات' },
  { id: 8, name: 'articles.delete', display_name: 'حذف مقال', group: 'المقالات' },
  { id: 9, name: 'settings.view', display_name: 'عرض الإعدادات', group: 'الإعدادات' },
  { id: 10, name: 'settings.edit', display_name: 'تعديل الإعدادات', group: 'الإعدادات' },
];

const mockRoles: Role[] = [
  {
    id: 1,
    name: 'admin',
    display_name: 'مدير النظام',
    description: 'صلاحيات كاملة على النظام',
    permissions: mockPermissions,
    users_count: 2,
  },
  {
    id: 2,
    name: 'editor',
    display_name: 'محرر',
    description: 'إدارة المقالات والمحتوى',
    permissions: mockPermissions.filter(p => p.name.startsWith('articles')),
    users_count: 5,
  },
  {
    id: 3,
    name: 'viewer',
    display_name: 'مشاهد',
    description: 'عرض المحتوى فقط',
    permissions: mockPermissions.filter(p => p.name.includes('view')),
    users_count: 15,
  },
];

export default function RolesPage() {
  const [roles, setRoles] = useState<Role[]>(mockRoles);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; role: Role | null }>({
    open: false,
    mode: 'create',
    role: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    permissions: [] as number[],
  });

  const columns = [
    {
      key: 'display_name',
      title: 'الدور',
      sortable: true,
      render: (value: string, item: Role) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'الوصف',
      render: (value: string) => (
        <span className="text-sm text-muted-foreground">{value || '-'}</span>
      ),
    },
    {
      key: 'permissions',
      title: 'الصلاحيات',
      render: (value: Permission[]) => (
        <Badge variant="info">{value?.length || 0} صلاحية</Badge>
      ),
    },
    {
      key: 'users_count',
      title: 'المستخدمون',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Role) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => openEditModal(item)}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors"
          >
            <Edit className="w-4 h-4 text-muted-foreground" />
          </button>
          <button
            onClick={() => handleDelete(item.id)}
            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
            disabled={item.name === 'admin'}
          >
            <Trash2 className={`w-4 h-4 ${item.name === 'admin' ? 'text-muted' : 'text-error'}`} />
          </button>
        </div>
      ),
    },
  ];

  const openEditModal = (role: Role) => {
    setFormData({
      name: role.name,
      display_name: role.display_name,
      description: role.description || '',
      permissions: role.permissions?.map(p => p.id) || [],
    });
    setModal({ open: true, mode: 'edit', role });
  };

  const openCreateModal = () => {
    setFormData({ name: '', display_name: '', description: '', permissions: [] });
    setModal({ open: true, mode: 'create', role: null });
  };

  const togglePermission = (permissionId: number) => {
    setFormData(prev => ({
      ...prev,
      permissions: prev.permissions.includes(permissionId)
        ? prev.permissions.filter(id => id !== permissionId)
        : [...prev.permissions, permissionId],
    }));
  };

  const handleSubmit = () => {
    const selectedPermissions = mockPermissions.filter(p => formData.permissions.includes(p.id));

    if (modal.mode === 'create') {
      const newRole: Role = {
        id: Date.now(),
        name: formData.name,
        display_name: formData.display_name,
        description: formData.description,
        permissions: selectedPermissions,
        users_count: 0,
      };
      setRoles([...roles, newRole]);
    } else if (modal.role) {
      setRoles(roles.map(r =>
        r.id === modal.role?.id
          ? { ...r, ...formData, permissions: selectedPermissions }
          : r
      ));
    }
    setModal({ open: false, mode: 'create', role: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الدور؟')) {
      setRoles(roles.filter(r => r.id !== id));
    }
  };

  const permissionGroups = mockPermissions.reduce((acc, permission) => {
    const group = permission.group || 'أخرى';
    if (!acc[group]) acc[group] = [];
    acc[group].push(permission);
    return acc;
  }, {} as Record<string, Permission[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الأدوار</h1>
          <p className="text-muted-foreground">إدارة أدوار وصلاحيات المستخدمين</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة دور
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الأدوار</p>
            <p className="text-2xl font-bold text-primary">{roles.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الصلاحيات</p>
            <p className="text-2xl font-bold text-accent">{mockPermissions.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">المستخدمون المعينون</p>
            <p className="text-2xl font-bold text-success">
              {roles.reduce((sum, r) => sum + (r.users_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة الأدوار</CardTitle>
          <div className="relative">
            <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="بحث..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={roles.filter(r =>
              r.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              r.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', role: null })}
        title={modal.mode === 'create' ? 'إضافة دور جديد' : 'تعديل الدور'}
        size="lg"
      >
        <div className="space-y-4 mt-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="اسم الدور (بالإنجليزية)"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="مثال: editor"
            />
            <Input
              label="الاسم المعروض"
              value={formData.display_name}
              onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
              placeholder="مثال: محرر"
            />
          </div>
          <Input
            label="الوصف"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="وصف مختصر للدور"
          />

          <div>
            <label className="mb-3 block text-sm font-medium">الصلاحيات</label>
            <div className="space-y-4 max-h-64 overflow-y-auto">
              {Object.entries(permissionGroups).map(([group, permissions]) => (
                <div key={group} className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">{group}</h4>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {permissions.map(permission => (
                      <label
                        key={permission.id}
                        className="flex items-center gap-2 p-2 rounded-lg border border-border hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${
                            formData.permissions.includes(permission.id)
                              ? 'bg-primary border-primary'
                              : 'border-border'
                          }`}
                          onClick={() => togglePermission(permission.id)}
                        >
                          {formData.permissions.includes(permission.id) && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                        <span className="text-sm">{permission.display_name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', role: null })}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {modal.mode === 'create' ? 'إضافة' : 'حفظ'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
