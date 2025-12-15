'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Globe,
  Search,
  Home,
  FileText,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { CustomSelect } from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS, COUNTRIES } from '@/lib/api/config';

interface Subject {
  id: number;
  subject_name: string;
  slug?: string;
  description?: string;
  icon?: string;
  articles_count?: number;
  files_count?: number;
}

interface SchoolClass {
  id: number;
  grade_name: string;
  grade_level: number;
  slug?: string;
  subjects?: Subject[];
}

export default function ClassSubjectsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.classId as string;
  const database = searchParams.get('database') || 'jo';

  const [selectedDatabase, setSelectedDatabase] = useState<string>(database);
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadClassWithSubjects();
  }, [classId, selectedDatabase]);

  const loadClassWithSubjects = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get class details
      const classResponse = await apiClient.get<SchoolClass>(
        API_ENDPOINTS.FRONTEND.CLASS_DETAILS(classId),
        { database: selectedDatabase }
      );

      const classData = classResponse.data;
      setSchoolClass(classData);

      // Get subjects for this class
      const subjectsResponse = await apiClient.get<{ data: Subject[] } | Subject[]>(
        API_ENDPOINTS.FRONTEND.SUBJECTS_BY_CLASS(classId),
        { database: selectedDatabase }
      );

      const subjectsData = subjectsResponse.data;
      if (Array.isArray(subjectsData)) {
        setSubjects(subjectsData);
      } else if (subjectsData && 'data' in subjectsData) {
        setSubjects(subjectsData.data);
      } else if (classData.subjects) {
        setSubjects(classData.subjects);
      } else {
        setSubjects([]);
      }
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل المواد الدراسية');
      setSubjects([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSubjects = subjects.filter((subject) =>
    subject.subject_name.toLowerCase().includes(searchQuery.toLowerCase())
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

  // Subject colors
  const getSubjectColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
      { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
      { bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
      { bg: 'bg-orange-500/10', text: 'text-orange-500', gradient: 'from-orange-500 to-amber-500' },
      { bg: 'bg-red-500/10', text: 'text-red-500', gradient: 'from-red-500 to-rose-500' },
      { bg: 'bg-indigo-500/10', text: 'text-indigo-500', gradient: 'from-indigo-500 to-violet-500' },
      { bg: 'bg-teal-500/10', text: 'text-teal-500', gradient: 'from-teal-500 to-cyan-500' },
      { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500', gradient: 'from-fuchsia-500 to-pink-500' },
    ];
    return colors[index % colors.length];
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
            className="flex items-center gap-2 text-sm mb-6"
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
            <span className="text-foreground font-medium">
              {schoolClass?.grade_name || 'جاري التحميل...'}
            </span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {schoolClass?.grade_level || '?'}
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  {schoolClass?.grade_name || 'جاري التحميل...'}
                </h1>
                <p className="text-muted-foreground mt-1">
                  اختر المادة الدراسية للوصول إلى المحتوى التعليمي
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
              placeholder="ابحث عن مادة دراسية..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </CardContent>
        </Card>
      </div>

      {/* Subjects Grid */}
      <div className="container mx-auto px-4 mt-10">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-muted-foreground">جاري تحميل المواد...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-error mb-4">{error}</p>
              <Button onClick={loadClassWithSubjects} variant="outline">
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : filteredSubjects.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'لا توجد نتائج للبحث' : 'لا توجد مواد دراسية لهذا الصف'}
              </p>
              <Link href={`/classes?database=${selectedDatabase}`}>
                <Button variant="outline" className="mt-4">
                  العودة للصفوف
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredSubjects.map((subject, index) => {
              const colors = getSubjectColor(index);
              return (
                <motion.div key={subject.id} variants={itemVariants}>
                  <Link
                    href={`/classes/${classId}/subjects/${subject.id}?database=${selectedDatabase}`}
                  >
                    <Card
                      hover
                      className="h-full group cursor-pointer overflow-hidden"
                    >
                      <div
                        className={cn(
                          'h-2 bg-gradient-to-r',
                          colors.gradient
                        )}
                      />
                      <CardHeader className="pt-6">
                        <div className="flex items-center justify-between">
                          <div
                            className={cn(
                              'w-14 h-14 rounded-xl flex items-center justify-center',
                              colors.bg
                            )}
                          >
                            <BookOpen className={cn('w-7 h-7', colors.text)} />
                          </div>
                          <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                        </div>
                        <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                          {subject.subject_name}
                        </CardTitle>
                        {subject.description && (
                          <CardDescription className="line-clamp-2">
                            {subject.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          {subject.articles_count !== undefined && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{subject.articles_count} مقال</span>
                            </div>
                          )}
                          {subject.files_count !== undefined && (
                            <div className="flex items-center gap-1">
                              <FileText className="w-4 h-4" />
                              <span>{subject.files_count} ملف</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </div>
    </div>
  );
}
