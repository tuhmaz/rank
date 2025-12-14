'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Trash2, FileText, Eye, Calendar, User } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import type { Post } from '@/types';

const mockPosts: Post[] = [
  {
    id: 1,
    title: 'أهم النصائح للتعلم الفعال',
    slug: 'effective-learning-tips',
    content: 'محتوى المنشور عن أهم النصائح للتعلم الفعال...',
    excerpt: 'تعرف على أفضل الطرق لتحسين مهاراتك في التعلم',
    status: 'published',
    author: { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com' },
    created_at: '2024-01-15',
    views_count: 1250,
  },
  {
    id: 2,
    title: 'مقدمة في البرمجة',
    slug: 'programming-introduction',
    content: 'محتوى المنشور عن مقدمة في البرمجة...',
    excerpt: 'دليلك الشامل للبدء في عالم البرمجة',
    status: 'published',
    author: { id: 2, name: 'سارة علي', email: 'sara@example.com' },
    created_at: '2024-01-14',
    views_count: 890,
  },
  {
    id: 3,
    title: 'فوائد القراءة اليومية',
    slug: 'daily-reading-benefits',
    content: 'محتوى المنشور عن فوائد القراءة اليومية...',
    excerpt: 'اكتشف كيف تغير القراءة حياتك',
    status: 'draft',
    author: { id: 1, name: 'أحمد محمد', email: 'ahmed@example.com' },
    created_at: '2024-01-13',
    views_count: 0,
  },
  {
    id: 4,
    title: 'تقنيات إدارة الوقت',
    slug: 'time-management-techniques',
    content: 'محتوى المنشور عن تقنيات إدارة الوقت...',
    excerpt: 'استفد من وقتك بأفضل طريقة ممكنة',
    status: 'published',
    author: { id: 3, name: 'محمد خالد', email: 'mohammed@example.com' },
    created_at: '2024-01-12',
    views_count: 2100,
  },
  {
    id: 5,
    title: 'أساسيات التصميم الجرافيكي',
    slug: 'graphic-design-basics',
    content: 'محتوى المنشور عن أساسيات التصميم الجرافيكي...',
    excerpt: 'تعلم أساسيات التصميم من الصفر',
    status: 'pending',
    author: { id: 2, name: 'سارة علي', email: 'sara@example.com' },
    created_at: '2024-01-11',
    views_count: 0,
  },
];

const statusOptions = [
  { value: 'draft', label: 'مسودة' },
  { value: 'pending', label: 'قيد المراجعة' },
  { value: 'published', label: 'منشور' },
];

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [modal, setModal] = useState<{ open: boolean; mode: 'create' | 'edit'; post: Post | null }>({
    open: false,
    mode: 'create',
    post: null,
  });
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'draft',
  });

  const columns = [
    {
      key: 'title',
      title: 'العنوان',
      sortable: true,
      render: (value: string, item: Post) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <FileText className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{value}</p>
            <p className="text-xs text-muted-foreground">{item.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'author.name',
      title: 'الكاتب',
      render: (value: string, item: Post) => (
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm">{item.author?.name || '-'}</span>
        </div>
      ),
    },
    {
      key: 'status',
      title: 'الحالة',
      sortable: true,
      render: (value: string) => {
        const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'error' | 'info' }> = {
          published: { label: 'منشور', variant: 'success' },
          draft: { label: 'مسودة', variant: 'warning' },
          pending: { label: 'قيد المراجعة', variant: 'info' },
        };
        const status = statusMap[value] || { label: value, variant: 'info' };
        return <Badge variant={status.variant}>{status.label}</Badge>;
      },
    },
    {
      key: 'views_count',
      title: 'المشاهدات',
      sortable: true,
      render: (value: number) => (
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-muted-foreground" />
          <span>{value?.toLocaleString() || 0}</span>
        </div>
      ),
    },
    {
      key: 'created_at',
      title: 'التاريخ',
      sortable: true,
      render: (value: string) => (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          <span>{value}</span>
        </div>
      ),
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Post) => (
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

  const openEditModal = (post: Post) => {
    setFormData({
      title: post.title,
      excerpt: post.excerpt || '',
      content: post.content,
      status: post.status,
    });
    setModal({ open: true, mode: 'edit', post });
  };

  const openCreateModal = () => {
    setFormData({ title: '', excerpt: '', content: '', status: 'draft' });
    setModal({ open: true, mode: 'create', post: null });
  };

  const handleSubmit = () => {
    if (modal.mode === 'create') {
      const newPost: Post = {
        id: Date.now(),
        title: formData.title,
        slug: formData.title.toLowerCase().replace(/\s+/g, '-'),
        content: formData.content,
        excerpt: formData.excerpt,
        status: formData.status as Post['status'],
        author: { id: 1, name: 'المستخدم الحالي', email: 'user@example.com' },
        created_at: new Date().toISOString().split('T')[0],
        views_count: 0,
      };
      setPosts([newPost, ...posts]);
    } else if (modal.post) {
      setPosts(posts.map(p =>
        p.id === modal.post?.id
          ? { ...p, ...formData, slug: formData.title.toLowerCase().replace(/\s+/g, '-') }
          : p
      ));
    }
    setModal({ open: false, mode: 'create', post: null });
  };

  const handleDelete = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذا المنشور؟')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = !statusFilter || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    draft: posts.filter(p => p.status === 'draft').length,
    pending: posts.filter(p => p.status === 'pending').length,
    totalViews: posts.reduce((sum, p) => sum + (p.views_count || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المنشورات</h1>
          <p className="text-muted-foreground">إدارة منشورات المدونة</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={openCreateModal}>
          إضافة منشور
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي المنشورات</p>
            <p className="text-2xl font-bold text-primary">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">منشور</p>
            <p className="text-2xl font-bold text-success">{stats.published}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">مسودة</p>
            <p className="text-2xl font-bold text-warning">{stats.draft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">قيد المراجعة</p>
            <p className="text-2xl font-bold text-info">{stats.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي المشاهدات</p>
            <p className="text-2xl font-bold text-accent">{stats.totalViews.toLocaleString()}</p>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة المنشورات</CardTitle>
          <div className="flex items-center gap-3">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[{ value: '', label: 'كل الحالات' }, ...statusOptions]}
              className="w-40"
            />
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
            data={filteredPosts}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        isOpen={modal.open}
        onClose={() => setModal({ open: false, mode: 'create', post: null })}
        title={modal.mode === 'create' ? 'إضافة منشور جديد' : 'تعديل المنشور'}
        size="lg"
      >
        <div className="space-y-4 mt-4">
          <Input
            label="عنوان المنشور"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="أدخل عنوان المنشور"
          />
          <Input
            label="الملخص"
            value={formData.excerpt}
            onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
            placeholder="ملخص قصير للمنشور"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">المحتوى</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="اكتب محتوى المنشور هنا..."
            />
          </div>
          <Select
            label="الحالة"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={statusOptions}
          />
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setModal({ open: false, mode: 'create', post: null })}
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
