'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, BookMarked, Layers } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Subject } from '@/types';

const mockSubjects: Subject[] = [
  { id: 1, name: 'الرياضيات', slug: 'math', description: 'مادة الرياضيات', class_id: 1, school_class: { id: 1, name: 'الصف الأول', slug: 'grade-1', grade_level: 'primary' }, articles_count: 25 },
  { id: 2, name: 'اللغة العربية', slug: 'arabic', description: 'مادة اللغة العربية', class_id: 1, school_class: { id: 1, name: 'الصف الأول', slug: 'grade-1', grade_level: 'primary' }, articles_count: 32 },
  { id: 3, name: 'العلوم', slug: 'science', description: 'مادة العلوم', class_id: 2, school_class: { id: 2, name: 'الصف الثاني', slug: 'grade-2', grade_level: 'primary' }, articles_count: 18 },
  { id: 4, name: 'اللغة الإنجليزية', slug: 'english', description: 'مادة اللغة الإنجليزية', class_id: 3, school_class: { id: 3, name: 'الصف الأول المتوسط', slug: 'middle-1', grade_level: 'middle' }, articles_count: 22 },
  { id: 5, name: 'التاريخ', slug: 'history', description: 'مادة التاريخ', class_id: 4, school_class: { id: 4, name: 'الصف الأول الثانوي', slug: 'high-1', grade_level: 'high' }, articles_count: 15 },
];

const classOptions = [
  { value: '1', label: 'الصف الأول الابتدائي' },
  { value: '2', label: 'الصف الثاني الابتدائي' },
  { value: '3', label: 'الصف الأول المتوسط' },
  { value: '4', label: 'الصف الأول الثانوي' },
];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>(mockSubjects);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; subject: Subject | null }>({
    open: false,
    mode: 'create',
    subject: null,
  });
  const [formData, setFormData] = useState({ name: '', class_id: '', description: '' });

  const columns = [
    {
      key: 'name',
      title: 'اسم المادة',
      sortable: true,
      render: (value: string, item: Subject) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
            <BookMarked className="w-5 h-5 text-accent" />
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
      title: 'الصف',
      render: (value: string) => (
        <Badge variant="info">{value || '-'}</Badge>
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
          <Layers className="w-4 h-4 text-muted-foreground" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Subject) => (
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

  const openEditModal = (subject: Subject) => {
    setFormData({
      name: subject.name,
      class_id: String(subject.class_id),
      description: subject.description || '',
    });
    setModal({ open: true, mode: 'edit', subject });
  };

  const openCreateModal = () => {
    setFormData({ name: '', class_id: '', description: '' });
    setModal({ open: true, mode: 'create', subject: null });
  };

  const handleSubmit = () => {
    if (modal.mode === 'create') {
      const newSubject: Subject = {
        id: Date.now(),
        name: formData.name,
        slug: formData.name.toLowerCase().replace(/\s+/g, '-'),
        class_id: Number(formData.class_id),
        description: formData.description,
        articles_count: 0,
      };
      setSubjects([...subjects, newSubject]);
    } else if (modal.subject) {
      setSubjects(subjects.map((s) =>
        s.id === modal.subject?.id
          ? { ...s, name: formData.name, class_id: Number(formData.class_id), description: formData.description }
          : s
      ));
    }
    setModal({ open: false, mode: 'create', subject: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه المادة؟')) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المواد الدراسية</h1>
          <p className="text-muted-foreground">إدارة المواد والمناهج الدراسية</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة مادة
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي المواد</p>
            <p className="text-2xl font-bold text-primary">{subjects.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي المقالات</p>
            <p className="text-2xl font-bold text-accent">
              {subjects.reduce((sum, s) => sum + (s.articles_count || 0), 0)}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">متوسط المقالات</p>
            <p className="text-2xl font-bold text-success">
              {Math.round(subjects.reduce((sum, s) => sum + (s.articles_count || 0), 0) / subjects.length)}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة المواد</CardTitle>
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
            data={subjects.filter((s) =>
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
        onClose={() => setModal({ open: false, mode: 'create', subject: null })}
        title={modal.mode === 'create' ? 'إضافة مادة جديدة' : 'تعديل المادة'}
      >
        <div className="space-y-4 mt-4">
          <Input
            label="اسم المادة"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="مثال: الرياضيات"
          />
          <Select
            label="الصف الدراسي"
            value={formData.class_id}
            onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
            options={classOptions}
            placeholder="اختر الصف"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="وصف المادة (اختياري)"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', subject: null })}
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
