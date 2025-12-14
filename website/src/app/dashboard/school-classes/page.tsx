'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, GraduationCap, BookOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { SchoolClass } from '@/types';

const mockClasses: SchoolClass[] = [
  { id: 1, name: 'الصف الأول الابتدائي', slug: 'grade-1', grade_level: 'primary', description: 'الصف الأول من المرحلة الابتدائية', articles_count: 45 },
  { id: 2, name: 'الصف الثاني الابتدائي', slug: 'grade-2', grade_level: 'primary', description: 'الصف الثاني من المرحلة الابتدائية', articles_count: 38 },
  { id: 3, name: 'الصف الثالث الابتدائي', slug: 'grade-3', grade_level: 'primary', description: 'الصف الثالث من المرحلة الابتدائية', articles_count: 42 },
  { id: 4, name: 'الصف الأول المتوسط', slug: 'middle-1', grade_level: 'middle', description: 'الصف الأول من المرحلة المتوسطة', articles_count: 56 },
  { id: 5, name: 'الصف الأول الثانوي', slug: 'high-1', grade_level: 'high', description: 'الصف الأول من المرحلة الثانوية', articles_count: 72 },
];

const gradeLevelOptions = [
  { value: 'primary', label: 'ابتدائي' },
  { value: 'middle', label: 'متوسط' },
  { value: 'high', label: 'ثانوي' },
];

const gradeLevelLabels: Record<string, string> = {
  primary: 'ابتدائي',
  middle: 'متوسط',
  high: 'ثانوي',
};

const gradeLevelColors: Record<string, 'success' | 'warning' | 'info'> = {
  primary: 'success',
  middle: 'warning',
  high: 'info',
};

export default function SchoolClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>(mockClasses);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; classItem: SchoolClass | null }>({
    open: false,
    mode: 'create',
    classItem: null,
  });
  const [formData, setFormData] = useState({ name: '', grade_level: '', description: '' });

  const columns = [
    {
      key: 'name',
      title: 'اسم الصف',
      sortable: true,
      render: (value: string, item: SchoolClass) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'grade_level',
      title: 'المرحلة',
      render: (value: string) => (
        <Badge variant={gradeLevelColors[value] || 'default'}>
          {gradeLevelLabels[value] || value}
        </Badge>
      ),
    },
    {
      key: 'description',
      title: 'الوصف',
      render: (value: string) => (
        <span className="text-muted-foreground text-sm">{value || '-'}</span>
      ),
    },
    {
      key: 'articles_count',
      title: 'المقالات',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: SchoolClass) => (
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

  const openEditModal = (classItem: SchoolClass) => {
    setFormData({
      name: classItem.name,
      grade_level: classItem.grade_level,
      description: classItem.description || '',
    });
    setModal({ open: true, mode: 'edit', classItem });
  };

  const openCreateModal = () => {
    setFormData({ name: '', grade_level: '', description: '' });
    setModal({ open: true, mode: 'create', classItem: null });
  };

  const handleSubmit = () => {
    if (modal.mode === 'create') {
      const newClass: SchoolClass = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        grade_level: formData.grade_level,
        description: formData.description,
        articles_count: 0,
      };
      setClasses([...classes, newClass]);
    } else if (modal.classItem) {
      setClasses(classes.map((c) =>
        c.id === modal.classItem?.id
          ? { ...c, name: formData.name, grade_level: formData.grade_level, description: formData.description }
          : c
      ));
    }
    setModal({ open: false, mode: 'create', classItem: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الصف؟')) {
      setClasses(classes.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الصفوف الدراسية</h1>
          <p className="text-muted-foreground">إدارة الصفوف والمراحل الدراسية</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة صف
        </Button>
      </div>

      {/* Stats by grade level */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الصفوف</p>
            <p className="text-2xl font-bold text-primary">{classes.length}</p>
          </CardContent>
        </Card>
        {Object.entries(gradeLevelLabels).map(([key, label]) => (
          <Card key={key}>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className={`text-2xl font-bold text-${gradeLevelColors[key]}`}>
                {classes.filter((c) => c.grade_level === key).length}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة الصفوف</CardTitle>
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
            data={classes.filter((c) =>
              c.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', classItem: null })}
        title={modal.mode === 'create' ? 'إضافة صف جديد' : 'تعديل الصف'}
      >
        <div className="space-y-4 mt-4">
          <Input
            label="اسم الصف"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: الصف الأول الابتدائي"
          />
          <Select
            label="المرحلة الدراسية"
            value={formData.grade_level}
            onChange={(e) => setFormData({ ...formData, grade_level: e.target.value })}
            options={gradeLevelOptions}
            placeholder="اختر المرحلة"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="وصف الصف (اختياري)"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', classItem: null })}
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
