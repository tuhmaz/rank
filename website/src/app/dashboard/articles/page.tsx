'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Plus,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  Globe,
  RefreshCw,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import DataTable from '@/components/ui/DataTable';
import Modal from '@/components/ui/Modal';
import { articlesService, COUNTRIES, schoolClassesService, subjectsService, semestersService } from '@/lib/api/services';
import type { Article, PaginatedResponse } from '@/types';

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('1');
  const [classesMap, setClassesMap] = useState<Record<number, string>>({});
  const [classesById, setClassesById] = useState<Record<number, string>>({});
  const [subjectsMap, setSubjectsMap] = useState<Record<number, string>>({});
  const [semestersMap, setSemestersMap] = useState<Record<number, string>>({});
  const [classesCache, setClassesCache] = useState<Record<number, string>>({});
  const [subjectsCache, setSubjectsCache] = useState<Record<number, string>>({});
  const [semestersCache, setSemestersCache] = useState<Record<number, string>>({});
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 10,
    total: 0,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; article: Article | null }>({
    open: false,
    article: null,
  });

  const toCountryName = (id: string) =>
    id === '1' ? 'jordan' : id === '2' ? 'saudi' : id === '3' ? 'egypt' : 'palestine';

  const fetchArticles = useCallback(async (page = 1) => {
    try {
      setLoading(true);
      const response = await articlesService.getAll({
        country: selectedCountry,
        page,
        per_page: 10,
        q: searchQuery || undefined,
      });
      setArticles(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      console.error('Failed to fetch articles:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedCountry, searchQuery]);

  useEffect(() => {
    fetchArticles(1);
  }, [selectedCountry]);

  useEffect(() => {
    setClassesCache({});
    setSubjectsCache({});
    setSemestersCache({});
  }, [selectedCountry]);

  useEffect(() => {
    const loadRefs = async () => {
      try {
        const [classes, subjects, semesters] = await Promise.all([
          schoolClassesService.getAll(selectedCountry),
          subjectsService.getAll(toCountryName(selectedCountry)),
          semestersService.getAll(toCountryName(selectedCountry)),
        ]);
        const cm: Record<number, string> = {};
        const cmId: Record<number, string> = {};
        classes.forEach((c) => {
          cm[c.grade_level] = c.grade_name;
          cmId[c.id] = c.grade_name;
        });
        const sm: Record<number, string> = {};
        subjects.forEach((s) => {
          sm[s.id] = s.subject_name;
        });
        const semm: Record<number, string> = {};
        semesters.forEach((s) => {
          semm[s.id] = s.semester_name;
        });
        setClassesMap(cm);
        setClassesById(cmId);
        setSubjectsMap(sm);
        setSemestersMap(semm);
      } catch (e) {
        console.error(e);
        setClassesMap({});
        setClassesById({});
        setSubjectsMap({});
        setSemestersMap({});
      }
    };
    loadRefs();
  }, [selectedCountry]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      if (searchQuery !== '') {
        fetchArticles(1);
      }
    }, 500);
    return () => clearTimeout(debounce);
  }, [searchQuery]);

  useEffect(() => {
    const missingClassIds = Array.from(
      new Set(
        articles
          .map((a) => (a as any).class_id as number | undefined)
          .filter((id) => !!id && !classesById[id!] && !classesCache[id!])
      )
    ) as number[];
    const missingSubjectIds = Array.from(
      new Set(
        articles
          .map((a) => a.subject_id as number | undefined)
          .filter((id) => !!id && !subjectsMap[id!] && !subjectsCache[id!])
      )
    ) as number[];
    const missingSemesterIds = Array.from(
      new Set(
        articles
          .map((a) => a.semester_id as number | undefined)
          .filter((id) => !!id && !semestersMap[id!] && !semestersCache[id!])
      )
    ) as number[];
    const run = async () => {
      try {
        if (missingClassIds.length) {
          const updates: Record<number, string> = {};
          await Promise.all(
            missingClassIds.map(async (id) => {
              try {
                const c = await schoolClassesService.getById(id, selectedCountry);
                updates[id] = c.grade_name;
              } catch {}
            })
          );
          if (Object.keys(updates).length) {
            setClassesCache((prev) => ({ ...prev, ...updates }));
          }
        }
        if (missingSubjectIds.length) {
          const updates: Record<number, string> = {};
          await Promise.all(
            missingSubjectIds.map(async (id) => {
              try {
                const s = await subjectsService.getById(id, toCountryName(selectedCountry));
                updates[id] = s.subject_name;
              } catch {}
            })
          );
          if (Object.keys(updates).length) {
            setSubjectsCache((prev) => ({ ...prev, ...updates }));
          }
        }
        if (missingSemesterIds.length) {
          const updates: Record<number, string> = {};
          await Promise.all(
            missingSemesterIds.map(async (id) => {
              try {
                const s = await semestersService.getById(id, toCountryName(selectedCountry));
                updates[id] = s.semester_name;
              } catch {}
            })
          );
          if (Object.keys(updates).length) {
            setSemestersCache((prev) => ({ ...prev, ...updates }));
          }
        }
      } catch {}
    };
    run();
  }, [articles, selectedCountry, classesById, subjectsMap, semestersMap, classesCache, subjectsCache, semestersCache]);
  const handlePublish = async (article: Article) => {
    try {
      setActionLoading(article.id);
      if (article.status) {
        await articlesService.unpublish(article.id, selectedCountry);
      } else {
        await articlesService.publish(article.id, selectedCountry);
      }
      fetchArticles(pagination.current_page);
    } catch (err) {
      console.error('Failed to update article status:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.article) return;
    try {
      setActionLoading(deleteModal.article.id);
      await articlesService.delete(deleteModal.article.id, selectedCountry);
      setDeleteModal({ open: false, article: null });
      fetchArticles(pagination.current_page);
    } catch (err) {
      console.error('Failed to delete article:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const columns = [
    {
      key: 'title',
      title: 'العنوان',
      sortable: true,
      render: (value: string, item: Article) => (
        <div>
          <p className="font-medium line-clamp-1">{value}</p>
          <p className="text-xs text-muted-foreground">{item.slug}</p>
        </div>
      ),
    },
    {
      key: 'schoolClass',
      title: 'الصف',
      render: (_: any, item: Article) =>
        classesById[(item as any).class_id] ||
        classesCache[(item as any).class_id] ||
        classesMap[item.grade_level] ||
        item.schoolClass?.grade_name ||
        '-',
    },
    {
      key: 'subject',
      title: 'المادة',
      render: (_: any, item: Article) =>
        subjectsMap[item.subject_id] ||
        subjectsCache[item.subject_id] ||
        (item as any).subject?.subject_name ||
        '-',
    },
    {
      key: 'semester',
      title: 'الفصل الدراسي',
      render: (_: any, item: Article) =>
        semestersMap[item.semester_id] ||
        semestersCache[item.semester_id] ||
        (item as any).semester?.semester_name ||
        '-',
    },
    {
      key: 'status',
      title: 'الحالة',
      render: (value: boolean) => (
        <Badge variant={value ? 'success' : 'warning'}>
          {value ? 'منشور' : 'مسودة'}
        </Badge>
      ),
    },
    {
      key: 'keywords',
      title: 'كلمات دلالية',
      render: (_: any, item: Article) => {
        const kws = (item as any).keywords;
        if (Array.isArray(kws)) {
          if (!kws.length) return '-';
          return (
            <div className="flex flex-wrap gap-1">
              {kws.slice(0, 4).map((k: any) => (
                <Badge key={k.id ?? k.keyword} variant="default">{k.keyword ?? String(k)}</Badge>
              ))}
              {kws.length > 4 && (
                <span className="text-xs text-muted-foreground">+{kws.length - 4}</span>
              )}
            </div>
          );
        }
        if (typeof kws === 'string' && kws.trim() !== '') {
          const parts = kws.split(',').map((s: string) => s.trim()).filter(Boolean);
          if (!parts.length) return '-';
          return (
            <div className="flex flex-wrap gap-1">
              {parts.slice(0, 4).map((p: string, i: number) => (
                <Badge key={i} variant="default">{p}</Badge>
              ))}
              {parts.length > 4 && (
                <span className="text-xs text-muted-foreground">+{parts.length - 4}</span>
              )}
            </div>
          );
        }
        return '-';
      },
    },
    {
      key: 'files',
      title: 'الملفات',
      render: (_: any, item: Article) => {
        const count = (item.files || []).length;
        return <span>{count.toLocaleString('ar-SA')}</span>;
      },
    },
    {
      key: 'actions',
      title: 'الإجراءات',
      render: (_: any, item: Article) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handlePublish(item)}
            disabled={actionLoading === item.id}
            className="p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-50"
            title={item.status ? 'إلغاء النشر' : 'نشر'}
          >
            {item.status ? (
              <XCircle className="w-4 h-4 text-warning" />
            ) : (
              <CheckCircle className="w-4 h-4 text-success" />
            )}
          </button>
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
            disabled={actionLoading === item.id}
            className="p-1.5 rounded-lg hover:bg-error/10 transition-colors disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 text-error" />
          </button>
        </div>
      ),
    },
  ];

  const publishedCount = articles.filter((a) => a.status).length;
  const draftCount = articles.filter((a) => !a.status).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة المقالات</h1>
          <p className="text-muted-foreground">إدارة وتحرير جميع المقالات</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="articles-country" className="sr-only">الدولة</label>
          <select
            id="articles-country"
            name="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            {COUNTRIES.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          <Link href="/dashboard/articles/create">
            <Button leftIcon={<Plus className="w-4 h-4" />}>إضافة مقال</Button>
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'إجمالي المقالات', value: pagination.total, color: 'text-primary' },
          { label: 'منشور', value: publishedCount, color: 'text-success' },
          { label: 'مسودة', value: draftCount, color: 'text-warning' },
          { label: 'المشاهدات', value: articles.reduce((acc, a) => acc + (a.visit_count || 0), 0), color: 'text-blue-500' },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardContent className="py-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold ${stat.color}`}>
                  {stat.value.toLocaleString('ar-SA')}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <CardTitle>قائمة المقالات</CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <label htmlFor="articles-search" className="sr-only">بحث عن مقال</label>
              <input
                type="text"
                placeholder="بحث..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                id="articles-search"
                name="search"
                className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
              onClick={() => fetchArticles(pagination.current_page)}
              disabled={loading}
            >
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={articles}
            columns={columns}
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => fetchArticles(page)}
          />
        </CardContent>
      </Card>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, article: null })}
        title="حذف المقال"
        description={`هل أنت متأكد من حذف المقال "${deleteModal.article?.title}"؟ لا يمكن التراجع عن هذا الإجراء.`}
      >
        <div className="flex items-center justify-end gap-3 mt-6">
          <Button
            variant="outline"
            onClick={() => setDeleteModal({ open: false, article: null })}
            disabled={actionLoading !== null}
          >
            إلغاء
          </Button>
          <Button
            variant="danger"
            onClick={handleDelete}
            loading={actionLoading === deleteModal.article?.id}
          >
            حذف
          </Button>
        </div>
      </Modal>
    </div>
  );
}
