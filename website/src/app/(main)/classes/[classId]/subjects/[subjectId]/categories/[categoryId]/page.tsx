'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  BookOpen,
  ChevronLeft,
  Loader2,
  Globe,
  Home,
  FileText,
  Calendar,
  Eye,
  Clock,
  User,
  FolderOpen,
  Search,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS, COUNTRIES } from '@/lib/api/config';

interface Article {
  id: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  meta_description?: string;
  featured_image?: string;
  views?: number;
  created_at?: string;
  updated_at?: string;
  author?: {
    id: number;
    name: string;
  };
  category?: {
    id: number;
    name: string;
  };
}

interface FilterResponse {
  articles?: {
    data: Article[];
    current_page: number;
    last_page: number;
    total: number;
  };
  files?: any[];
}

export default function ArticlesPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.classId as string;
  const subjectId = params.subjectId as string;
  const categoryId = params.categoryId as string;
  const database = searchParams.get('database') || 'jo';
  const semesterId = searchParams.get('semester') || '';

  const [selectedDatabase, setSelectedDatabase] = useState<string>(database);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [categoryName, setCategoryName] = useState('فئة الملفات');

  useEffect(() => {
    loadArticles();
  }, [classId, subjectId, categoryId, semesterId, selectedDatabase, currentPage]);

  const loadArticles = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Use the filter endpoint to get articles
      const response = await apiClient.get<FilterResponse>(
        API_ENDPOINTS.FRONTEND.FILTER,
        {
          database: selectedDatabase,
          class_id: classId,
          subject_id: subjectId,
          semester_id: semesterId,
          file_category: categoryId,
          page: currentPage.toString(),
        }
      );

      const data = response.data;
      if (data.articles) {
        setArticles(data.articles.data || []);
        setCurrentPage(data.articles.current_page || 1);
        setTotalPages(data.articles.last_page || 1);
        setTotalArticles(data.articles.total || 0);
      } else if (Array.isArray(data)) {
        setArticles(data);
        setTotalArticles(data.length);
      } else {
        setArticles([]);
      }
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل المقالات');
      setArticles([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredArticles = articles.filter((article) =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const databaseOptions = COUNTRIES.map((country) => ({
    value: country.code,
    label: country.name,
    icon: <Globe className="w-4 h-4" />,
  }));

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('ar', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <motion.nav
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-sm mb-6 flex-wrap"
          >
            <Link
              href="/"
              className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
            >
              <Home className="w-4 h-4" />
              الرئيسية
            </Link>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <Link
              href={`/classes?database=${selectedDatabase}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              الصفوف الدراسية
            </Link>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <Link
              href={`/classes/${classId}?database=${selectedDatabase}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              الصف
            </Link>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <Link
              href={`/classes/${classId}/subjects/${subjectId}?database=${selectedDatabase}`}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              المادة
            </Link>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">{categoryName}</span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <FolderOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">{categoryName}</h1>
                <p className="text-muted-foreground mt-1">
                  {totalArticles > 0 ? `${totalArticles} مقال متاح` : 'المقالات التعليمية'}
                </p>
              </div>
            </div>
            <div className="w-full md:w-48">
              <CustomSelect
                options={databaseOptions}
                value={selectedDatabase}
                onChange={(value) => setSelectedDatabase(value as string)}
                placeholder="اختر الدولة"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Search Section */}
      <div className="container mx-auto px-4 -mt-6">
        <Card className="shadow-lg">
          <CardContent className="py-4">
            <Input
              placeholder="ابحث عن مقال..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* Articles Grid */}
      <div className="container mx-auto px-4 mt-10">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-muted-foreground">جاري تحميل المقالات...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-error mb-4">{error}</p>
              <Button onClick={loadArticles} variant="outline">
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مقالات في هذه الفئة'}
              </p>
              <Link href={`/classes/${classId}/subjects/${subjectId}?database=${selectedDatabase}`}>
                <Button variant="outline" className="mt-4">
                  العودة للفئات
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredArticles.map((article) => (
                <motion.div key={article.id} variants={itemVariants}>
                  <Link href={`/articles/${article.slug || article.id}?database=${selectedDatabase}`}>
                    <Card hover className="h-full group cursor-pointer overflow-hidden">
                      {/* Featured Image */}
                      {article.featured_image && (
                        <div className="relative h-48 overflow-hidden">
                          <img
                            src={article.featured_image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          {article.category && (
                            <Badge
                              variant="primary"
                              className="absolute bottom-3 right-3"
                            >
                              {article.category.name}
                            </Badge>
                          )}
                        </div>
                      )}

                      <CardHeader className={article.featured_image ? 'pt-4' : ''}>
                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                          {article.title}
                        </CardTitle>
                        {(article.excerpt || article.meta_description) && (
                          <CardDescription className="line-clamp-3">
                            {article.excerpt || article.meta_description}
                          </CardDescription>
                        )}
                      </CardHeader>

                      <CardFooter className="flex-wrap gap-3">
                        {article.created_at && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Calendar className="w-4 h-4" />
                            <span>{formatDate(article.created_at)}</span>
                          </div>
                        )}
                        {article.views !== undefined && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4" />
                            <span>{article.views} مشاهدة</span>
                          </div>
                        )}
                        {article.author && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <User className="w-4 h-4" />
                            <span>{article.author.name}</span>
                          </div>
                        )}
                      </CardFooter>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  السابق
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? 'primary' : 'ghost'}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-10"
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  التالي
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
