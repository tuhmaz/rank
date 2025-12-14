'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderTree,
  ToggleLeft,
  ToggleRight,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import type { Category } from '@/types';

const mockCategories: Category[] = [
  { id: 1, name: 'التعليم', slug: 'education', description: 'مقالات تعليمية', is_active: true, articles_count: 45 },
  { id: 2, name: 'التقنية', slug: 'technology', description: 'مقالات تقنية', is_active: true, articles_count: 32 },
  { id: 3, name: 'الرياضة', slug: 'sports', description: 'مقالات رياضية', is_active: false, articles_count: 18 },
  { id: 4, name: 'الصحة', slug: 'health', description: 'مقالات صحية', is_active: true, articles_count: 27 },
  { id: 5, name: 'الثقافة', slug: 'culture', description: 'مقالات ثقافية', is_active: true, articles_count: 15 },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>(mockCategories);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; category: Category | null }>({
    open: false,
    mode: 'create',
    category: null,
  });
  const [formData, setFormData] = useState({ name: '', description: '' });

  const columns = [
    {
      key: 'name',
      title: 'الاسم',
      sortable: true,
      render: (value: string, item: Category) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FolderTree className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      title: 'الوصف',
      render: (value: string) => (
        <span className="text-muted-foreground">{value || '-'}</span>
      ),
    },
    {
      key: 'articles_count',
      title: 'المقالات',
      sortable: true,
      render: (value: number) => (
        <Badge variant="info">{value} مقال</Badge>
      ),
    },
    {
      key: 'is_active',
      title: 'الحالة',
      render: (value: boolean, item: Category) => (
        <button
          onClick={() => toggleStatus(item.id)}
          className="flex items-center gap-2"
        >
          {value ? (
            <>
              <ToggleRight className="w-6 h-6 text-success" />
              <span className="text-success text-sm">مفعل</span>
            </>
          ) : (
            <>
              <ToggleLeft className="w-6 h-6 text-muted-foreground" />
              <span className="text-muted-foreground text-sm">معطل</span>
            </>
          )}
        </button>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Category) => (
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

  const toggleStatus = (id: number) => {
    setCategories(categories.map((c) =>
      c.id === id ? { ...c, is_active: !c.is_active } : c
    ));
  };

  const openEditModal = (category: Category) => {
    setFormData({ name: category.name, description: category.description || '' });
    setModal({ open: true, mode: 'edit', category });
  };

  const openCreateModal = () => {
    setFormData({ name: '', description: '' });
    setModal({ open: true, mode: 'create', category: null });
  };

  const handleSubmit = () => {
    if (modal.mode === 'create') {
      const newCategory: Category = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description,
        is_active: true,
        articles_count: 0,
      };
      setCategories([...categories, newCategory]);
    } else if (modal.category) {
      setCategories(categories.map((c) =>
        c.id === modal.category?.id
          ? { ...c, name: formData.name, description: formData.description }
          : c
      ));
    }
    setModal({ open: false, mode: 'create', category: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الفئة؟')) {
      setCategories(categories.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الفئات</h1>
          <p className="text-muted-foreground">إدارة فئات المقالات والمحتوى</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة فئة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الفئات</p>
            <p className="text-2xl font-bold text-primary">{categories.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">الفئات المفعلة</p>
            <p className="text-2xl font-bold text-success">
              {categories.filter((c) => c.is_active).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي المقالات</p>
            <p className="text-2xl font-bold text-accent">
              {categories.reduce((sum, c) => sum + (c.articles_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة الفئات</CardTitle>
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
            data={categories.filter((c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', category: null })}
        title={modal.mode === 'create' ? 'إضافة فئة جديدة' : 'تعديل الفئة'}
      >
        <div className="space-y-4 mt-4">
          <Input
            label="اسم الفئة"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="أدخل اسم الفئة"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="وصف الفئة (اختياري)"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', category: null })}
            >
              إلغاء
            </Button>
            <Button onClick={handleSubmit}>
              {modal.mode === 'create' ? 'إضافة' : 'حفظ التغييرات'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
