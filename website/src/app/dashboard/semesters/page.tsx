'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, Calendar, BookOpen } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Semester } from '@/types';

const mockSemesters: Semester[] = [
  { id: 1, name: 'الفصل الدراسي الأول', slug: 'semester-1', class_id: 1, school_class: { id: 1, name: 'الصف الأول', slug: 'grade-1', grade_level: 'primary' }, articles_count: 45 },
  { id: 2, name: 'الفصل الدراسي الثاني', slug: 'semester-2', class_id: 1, school_class: { id: 1, name: 'الصف الأول', slug: 'grade-1', grade_level: 'primary' }, articles_count: 38 },
  { id: 3, name: 'الفصل الدراسي الأول', slug: 'semester-1-g2', class_id: 2, school_class: { id: 2, name: 'الصف الثاني', slug: 'grade-2', grade_level: 'primary' }, articles_count: 52 },
  { id: 4, name: 'الفصل الدراسي الثاني', slug: 'semester-2-g2', class_id: 2, school_class: { id: 2, name: 'الصف الثاني', slug: 'grade-2', grade_level: 'primary' }, articles_count: 41 },
  { id: 5, name: 'الفصل الدراسي الأول', slug: 'semester-1-m1', class_id: 3, school_class: { id: 3, name: 'الصف الأول المتوسط', slug: 'middle-1', grade_level: 'middle' }, articles_count: 35 },
];

const classOptions = [
  { value: '1', label: 'الصف الأول الابتدائي' },
  { value: '2', label: 'الصف الثاني الابتدائي' },
  { value: '3', label: 'الصف الأول المتوسط' },
  { value: '4', label: 'الصف الأول الثانوي' },
];

export default function SemestersPage() {
  const [semesters, setSemesters] = useState<Semester[]>(mockSemesters);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; semester: Semester | null }>({
    open: false,
    mode: 'create',
    semester: null,
  });
  const [formData, setFormData] = useState({ name: '', class_id: '' });

  const columns = [
    {
      key: 'name',
      title: 'اسم الفصل',
      sortable: true,
      render: (value: string, item: Semester) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'school_class.name',
      title: 'الصف الدراسي',
      render: (value: string, item: Semester) => (
        <Badge variant="info">{item.school_class?.name || '-'}</Badge>
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
      render: (_: any, item: Semester) => (
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

  const openEditModal = (semester: Semester) => {
    setFormData({
      name: semester.name,
      class_id: String(semester.class_id),
    });
    setModal({ open: true, mode: 'edit', semester });
  };

  const openCreateModal = () => {
    setFormData({ name: '', class_id: '' });
    setModal({ open: true, mode: 'create', semester: null });
  };

  const handleSubmit = () => {
    if (modal.mode === 'create') {
      const newSemester: Semester = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        class_id: Number(formData.class_id),
        articles_count: 0,
      };
      setSemesters([...semesters, newSemester]);
    } else if (modal.semester) {
      setSemesters(semesters.map((s) =>
        s.id === modal.semester?.id
          ? { ...s, name: formData.name, class_id: Number(formData.class_id) }
          : s
      ));
    }
    setModal({ open: false, mode: 'create', semester: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا الفصل؟')) {
      setSemesters(semesters.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الفصول الدراسية</h1>
          <p className="text-muted-foreground">إدارة فصول العام الدراسي</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة فصل
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الفصول</p>
            <p className="text-2xl font-bold text-primary">{semesters.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي المقالات</p>
            <p className="text-2xl font-bold text-accent">
              {semesters.reduce((sum, s) => sum + (s.articles_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">الصفوف المرتبطة</p>
            <p className="text-2xl font-bold text-success">
              {new Set(semesters.map((s) => s.class_id)).size}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة الفصول</CardTitle>
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
            data={semesters.filter((s) =>
              s.name.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', semester: null })}
        title={modal.mode === 'create' ? 'إضافة فصل جديد' : 'تعديل الفصل'}
      >
        <div className="space-y-4 mt-4">
          <Input
            label="اسم الفصل"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: الفصل الدراسي الأول"
          />
          <Select
            label="الصف الدراسي"
            value={formData.class_id}
            onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
            options={classOptions}
            placeholder="اختر الصف"
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', semester: null })}
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
