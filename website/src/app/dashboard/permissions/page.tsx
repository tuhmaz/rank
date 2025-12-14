'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Key, Shield } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Permission } from '@/types';

const mockPermissions: Permission[] = [
  { id: 1, name: 'users.view', display_name: 'عرض المستخدمين', group: 'المستخدمون' },
  { id: 2, name: 'users.create', display_name: 'إضافة مستخدم', group: 'المستخدمون' },
  { id: 3, name: 'users.edit', display_name: 'تعديل مستخدم', group: 'المستخدمون' },
  { id: 4, name: 'users.delete', display_name: 'حذف مستخدم', group: 'المستخدمون' },
  { id: 5, name: 'articles.view', display_name: 'عرض المقالات', group: 'المقالات' },
  { id: 6, name: 'articles.create', display_name: 'إضافة مقال', group: 'المقالات' },
  { id: 7, name: 'articles.edit', display_name: 'تعديل مقال', group: 'المقالات' },
  { id: 8, name: 'articles.delete', display_name: 'حذف مقال', group: 'المقالات' },
  { id: 9, name: 'articles.publish', display_name: 'نشر مقال', group: 'المقالات' },
  { id: 10, name: 'categories.view', display_name: 'عرض الفئات', group: 'الفئات' },
  { id: 11, name: 'categories.create', display_name: 'إضافة فئة', group: 'الفئات' },
  { id: 12, name: 'categories.edit', display_name: 'تعديل فئة', group: 'الفئات' },
  { id: 13, name: 'categories.delete', display_name: 'حذف فئة', group: 'الفئات' },
  { id: 14, name: 'settings.view', display_name: 'عرض الإعدادات', group: 'الإعدادات' },
  { id: 15, name: 'settings.edit', display_name: 'تعديل الإعدادات', group: 'الإعدادات' },
  { id: 16, name: 'roles.view', display_name: 'عرض الأدوار', group: 'الصلاحيات' },
  { id: 17, name: 'roles.create', display_name: 'إضافة دور', group: 'الصلاحيات' },
  { id: 18, name: 'roles.edit', display_name: 'تعديل دور', group: 'الصلاحيات' },
  { id: 19, name: 'roles.delete', display_name: 'حذف دور', group: 'الصلاحيات' },
];

const groupOptions = [
  { value: 'المستخدمون', label: 'المستخدمون' },
  { value: 'المقالات', label: 'المقالات' },
  { value: 'الفئات', label: 'الفئات' },
  { value: 'الإعدادات', label: 'الإعدادات' },
  { value: 'الصلاحيات', label: 'الصلاحيات' },
  { value: 'أخرى', label: 'أخرى' },
];

const groupColors: Record<string, 'info' | 'success' | 'warning' | 'error'> = {
  'المستخدمون': 'info',
  'المقالات': 'success',
  'الفئات': 'warning',
  'الإعدادات': 'error',
  'الصلاحيات': 'info',
};

export default function PermissionsPage() {
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGroup, setFilterGroup] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; permission: Permission | null }>({
    open: false,
    mode: 'create',
    permission: null,
  });
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    group: '',
  });

  const columns = [
    {
      key: 'display_name',
      title: 'الصلاحية',
      sortable: true,
      render: (value: string, item: Permission) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <Key className="w-5 h-5 text-accent" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground font-mono">{item.name}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'group',
      title: 'المجموعة',
      sortable: true,
      render: (value: string) => (
        <Badge variant={groupColors[value] || 'info'}>{value}</Badge>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Permission) => (
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
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  const openEditModal = (permission: Permission) => {
    setFormData({
      name: permission.name,
      display_name: permission.display_name,
      group: permission.group || '',
    });
    setModal({ open: true, mode: 'edit', permission });
  };

  const openCreateModal = () => {
    setFormData({ name: '', display_name: '', group: '' });
    setModal({ open: true, mode: 'create', permission: null });
  };

  const handleSubmit = () => {
    if (modal.mode === 'create') {
      const newPermission: Permission = {
        id: Date.now(),
        name: formData.name,
        display_name: formData.display_name,
        group: formData.group,
      };
      setPermissions([...permissions, newPermission]);
    } else if (modal.permission) {
      setPermissions(permissions.map(p =>
        p.id === modal.permission?.id ? { ...p, ...formData } : p
      ));
    }
    setModal({ open: false, mode: 'create', permission: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الصلاحية؟')) {
      setPermissions(permissions.filter(p => p.id !== id));
    }
  };

  const filteredPermissions = permissions.filter(p => {
    const matchesSearch =
      p.display_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = !filterGroup || p.group === filterGroup;
    return matchesSearch && matchesGroup;
  });

  const permissionsByGroup = permissions.reduce((acc, p) => {
    const group = p.group || 'أخرى';
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الصلاحيات</h1>
          <p className="text-muted-foreground">إدارة صلاحيات النظام</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة صلاحية
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الصلاحيات</p>
            <p className="text-2xl font-bold text-primary">{permissions.length}</p>
          </CardContent>
        </Card>
        {Object.entries(permissionsByGroup).slice(0, 3).map(([group, count]) => (
          <Card key={group}>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">{group}</p>
              <p className="text-2xl font-bold" style={{ color: `var(--${groupColors[group] || 'primary'})` }}>
                {count}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Permissions by Group */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(permissionsByGroup).map(([group, count]) => (
          <Card
            key={group}
            className="cursor-pointer hover:border-primary/50 transition-colors"
            onClick={() => setFilterGroup(filterGroup === group ? '' : group)}
          >
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{group}</p>
                    <p className="text-sm text-muted-foreground">{count} صلاحية</p>
                  </div>
                </div>
                {filterGroup === group && (
                  <Badge variant="success">محدد</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة الصلاحيات</CardTitle>
          <div className="flex items-center gap-3">
            {filterGroup && (
              <Button variant="outline" size="sm" onClick={() => setFilterGroup('')}>
                إلغاء الفلتر
              </Button>
            )}
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
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredPermissions}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', permission: null })}
        title={modal.mode === 'create' ? 'إضافة صلاحية جديدة' : 'تعديل الصلاحية'}
      >
        <div className="space-y-4 mt-4">
          <Input
            label="اسم الصلاحية (بالإنجليزية)"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: articles.create"
          />
          <Input
            label="الاسم المعروض"
            value={formData.display_name}
            onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
            placeholder="مثال: إضافة مقال"
          />
          <Select
            label="المجموعة"
            value={formData.group}
            onChange={(e) => setFormData({ ...formData, group: e.target.value })}
            options={groupOptions}
            placeholder="اختر المجموعة"
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', permission: null })}
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
