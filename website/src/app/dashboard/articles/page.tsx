'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  MoreHorizontal,
  Check,
  X,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import type { Article, PaginatedResponse } from '@/types';

// بيانات تجريبية
const mockArticles: Article[] = [
  {
    id: 1,
    title: 'مقدمة في الرياضيات',
    slug: 'intro-math',
    content: '...',
    status: 'published',
    views: 1250,
    created_at: '2024-01-15',
    author: { id: 1, name: 'أحمد محمد', email: 'ahmed@email.com' },
  },
  {
    id: 2,
    title: 'أساسيات اللغة العربية',
    slug: 'arabic-basics',
    content: '...',
    status: 'published',
    views: 890,
    created_at: '2024-01-14',
    author: { id: 2, name: 'سارة علي', email: 'sara@email.com' },
  },
  {
    id: 3,
    title: 'العلوم الطبيعية للصف الأول',
    slug: 'science-grade-1',
    content: '...',
    status: 'draft',
    views: 0,
    created_at: '2024-01-13',
    author: { id: 1, name: 'أحمد محمد', email: 'ahmed@email.com' },
  },
  {
    id: 4,
    title: 'التاريخ الإسلامي',
    slug: 'islamic-history',
    content: '...',
    status: 'published',
    views: 2100,
    created_at: '2024-01-12',
    author: { id: 3, name: 'محمد خالد', email: 'mohammed@email.com' },
  },
  {
    id: 5,
    title: 'الجغرافيا العربية',
    slug: 'arab-geography',
    content: '...',
    status: 'archived',
    views: 560,
    created_at: '2024-01-11',
    author: { id: 2, name: 'سارة علي', email: 'sara@email.com' },
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(mockArticles);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; article: Article | null }>({
    open: false,
    article: null,
  });

  const statusVariant = (status: string) => {
    switch (status) {
      case 'published':
        return 'success';
      case 'draft':
        return 'warning';
      case 'archived':
        return 'error';
      default:
        return 'default';
    }
  };

  const statusLabel = (status: string) => {
    switch (status) {
      case 'published':
        return 'منشور';
      case 'draft':
        return 'مسودة';
      case 'archived':
        return 'مؤرشف';
      default:
        return status;
    }
  };

  const columns = [
    {
      key: 'title',
      title: 'العنوان',
      sortable: true,
      render: (value: string, item: Article) => (
        <div>
          <p className="font-medium">{value}</p>
          <p className="text-xs text-muted-foreground">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'author.name',
      title: 'الكاتب',
      render: (value: string) => value || '-',
    },
    {
      key: 'status',
      title: 'الحالة',
      render: (value: string) => (
        <Badge variant={statusVariant(value)}>{statusLabel(value)}</Badge>
      ),
    },
    {
      key: 'views',
      title: 'المشاهدات',
      sortable: true,
      render: (value: number) => value?.toLocaleString() || '0',
    },
    {
      key: 'created_at',
      title: 'التاريخ',
      sortable: true,
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Article) => (
        <div className="flex items-center gap-1">
          <Link href={`/dashboard/articles/${item.id}`}>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Eye className="w-4 h-4 text-muted-foreground" />
            </button>
          </Link>
          <Link href={`/dashboard/articles/${item.id}/edit`}>
            <button className="p-1.5 rounded-lg hover:bg-muted transition-colors">
              <Edit className="w-4 h-4 text-muted-foreground" />
            </button>
          </Link>
          <button
            onClick={() => setDeleteModal({ open: true, article: item })}
            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  const handleDelete = () => {
    if (deleteModal.article) {
      setArticles(articles.filter((a) => a.id !== deleteModal.article?.id));
      setDeleteModal({ open: false, article: null });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المقالات</h1>
          <p className="text-muted-foreground">إدارة وتحرير جميع المقالات</p>
        </div>
        <Link href="/dashboard/articles/create">
          <Button leftIcon={<Plus className="w-4 h-4" />}>إضافة مقال</Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المقالات', value: articles.length, color: 'text-primary' },
          { label: 'منشور', value: articles.filter((a) => a.status === 'published').length, color: 'text-success' },
          { label: 'مسودة', value: articles.filter((a) => a.status === 'draft').length, color: 'text-warning' },
          { label: 'مؤرشف', value: articles.filter((a) => a.status === 'archived').length, color: 'text-error' },
        ].map((stat, index) => (
          <Card key={index}>
            <CardContent className="py-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة المقالات</CardTitle>
          <div className="flex items-center gap-2">
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
            <Button variant="outline" size="sm" leftIcon={<Filter className="w-4 h-4" />}>
              فلترة
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={articles.filter((a) =>
              a.title.toLowerCase().includes(searchQuery.toLowerCase())
            )}
            columns={columns}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, article: null })}
        title="حذف المقال"
        description="هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء."
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button variant="outline" onClick={() => setDeleteModal({ open: false, article: null })}>
            إلغاء
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
