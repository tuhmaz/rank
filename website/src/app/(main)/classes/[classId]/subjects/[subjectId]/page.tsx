'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  GraduationCap,
  BookOpen,
  ChevronLeft,
  Loader2,
  Globe,
  Home,
  Calendar,
  FolderOpen,
  FileText,
  Download,
  Layers,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { CustomSelect } from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS, COUNTRIES } from '@/lib/api/config';

interface FileCategory {
  id: number;
  name: string;
  slug?: string;
  files_count?: number;
  articles_count?: number;
}

interface Semester {
  id: number;
  semester_name: string;
  slug?: string;
  file_categories?: FileCategory[];
  articles_count?: number;
  files_count?: number;
}

interface Subject {
  id: number;
  subject_name: string;
  slug?: string;
  description?: string;
}

interface SchoolClass {
  id: number;
  grade_name: string;
  grade_level: number;
}

export default function SubjectSemestersPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const classId = params.classId as string;
  const subjectId = params.subjectId as string;
  const database = searchParams.get('database') || 'jo';

  const [selectedDatabase, setSelectedDatabase] = useState<string>(database);
  const [schoolClass, setSchoolClass] = useState<SchoolClass | null>(null);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [selectedSemester, setSelectedSemester] = useState<Semester | null>(null);
  const [fileCategories, setFileCategories] = useState<FileCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [classId, subjectId, selectedDatabase]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load class details
      const classResponse = await apiClient.get<SchoolClass>(
        API_ENDPOINTS.FRONTEND.CLASS_DETAILS(classId),
        { database: selectedDatabase }
      );
      setSchoolClass(classResponse.data);

      // Load semesters for this subject
      const semestersResponse = await apiClient.get<{ data: Semester[] } | Semester[]>(
        API_ENDPOINTS.FRONTEND.SEMESTERS_BY_SUBJECT(subjectId),
        { database: selectedDatabase }
      );

      const semestersData = semestersResponse.data;
      let semestersList: Semester[] = [];
      if (Array.isArray(semestersData)) {
        semestersList = semestersData;
      } else if (semestersData && 'data' in semestersData) {
        semestersList = semestersData.data;
      }
      setSemesters(semestersList);

      // Set subject name from response or create a placeholder
      setSubject({
        id: parseInt(subjectId),
        subject_name: 'المادة الدراسية',
      });

      // Auto-select first semester if available
      if (semestersList.length > 0) {
        handleSemesterSelect(semestersList[0]);
      }
    } catch (err: any) {
      setError(err.message || 'فشل في تحميل البيانات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSemesterSelect = async (semester: Semester) => {
    try {
      setSelectedSemester(semester);
      setIsLoadingCategories(true);

      // Load file categories for this semester
      const categoriesResponse = await apiClient.get<{ data: FileCategory[] } | FileCategory[]>(
        API_ENDPOINTS.FRONTEND.FILE_TYPES(semester.id),
        { database: selectedDatabase }
      );

      const categoriesData = categoriesResponse.data;
      if (Array.isArray(categoriesData)) {
        setFileCategories(categoriesData);
      } else if (categoriesData && 'data' in categoriesData) {
        setFileCategories(categoriesData.data);
      } else if (semester.file_categories) {
        setFileCategories(semester.file_categories);
      } else {
        setFileCategories([]);
      }
    } catch (err: any) {
      console.error('Failed to load file categories:', err);
      setFileCategories([]);
    } finally {
      setIsLoadingCategories(false);
    }
  };

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

  // Category colors
  const getCategoryColor = (index: number) => {
    const colors = [
      { bg: 'bg-blue-500/10', text: 'text-blue-500', gradient: 'from-blue-500 to-cyan-500' },
      { bg: 'bg-green-500/10', text: 'text-green-500', gradient: 'from-green-500 to-emerald-500' },
      { bg: 'bg-purple-500/10', text: 'text-purple-500', gradient: 'from-purple-500 to-pink-500' },
      { bg: 'bg-orange-500/10', text: 'text-orange-500', gradient: 'from-orange-500 to-amber-500' },
      { bg: 'bg-red-500/10', text: 'text-red-500', gradient: 'from-red-500 to-rose-500' },
      { bg: 'bg-teal-500/10', text: 'text-teal-500', gradient: 'from-teal-500 to-cyan-500' },
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
              {schoolClass?.grade_name || 'الصف'}
            </Link>
            <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            <span className="text-foreground font-medium">
              {subject?.subject_name || 'المادة'}
            </span>
          </motion.nav>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="secondary">{schoolClass?.grade_name}</Badge>
                </div>
                <h1 className="text-3xl font-bold">{subject?.subject_name || 'المادة الدراسية'}</h1>
                <p className="text-muted-foreground mt-1">
                  اختر الفصل الدراسي وفئة الملفات للوصول إلى المقالات
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

      {/* Content */}
      <div className="container mx-auto px-4 mt-10">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="w-10 h-10 animate-spin text-primary" />
              <span className="text-muted-foreground">جاري تحميل البيانات...</span>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <p className="text-error mb-4">{error}</p>
              <Button onClick={loadData} variant="outline">
                إعادة المحاولة
              </Button>
            </div>
          </div>
        ) : semesters.length === 0 ? (
          <div className="flex items-center justify-center min-h-[300px]">
            <div className="text-center">
              <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">لا توجد فصول دراسية لهذه المادة</p>
              <Link href={`/classes/${classId}?database=${selectedDatabase}`}>
                <Button variant="outline" className="mt-4">
                  العودة للمواد
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            {/* Semesters Sidebar */}
            <div className="lg:col-span-3">
              <Card className="sticky top-28">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    الفصول الدراسية
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {semesters.map((semester) => (
                    <button
                      key={semester.id}
                      onClick={() => handleSemesterSelect(semester)}
                      className={cn(
                        'w-full text-right p-3 rounded-xl transition-all',
                        selectedSemester?.id === semester.id
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-muted/50 hover:bg-muted text-foreground'
                      )}
                    >
                      <div className="font-medium">{semester.semester_name}</div>
                      {semester.articles_count !== undefined && (
                        <div
                          className={cn(
                            'text-sm mt-1',
                            selectedSemester?.id === semester.id
                              ? 'text-white/80'
                              : 'text-muted-foreground'
                          )}
                        >
                          {semester.articles_count} مقال
                        </div>
                      )}
                    </button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* File Categories */}
            <div className="lg:col-span-9">
              {selectedSemester ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                      <Layers className="w-6 h-6 text-primary" />
                      فئات الملفات - {selectedSemester.semester_name}
                    </h2>
                  </div>

                  {isLoadingCategories ? (
                    <div className="flex items-center justify-center min-h-[200px]">
                      <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    </div>
                  ) : fileCategories.length === 0 ? (
                    <Card>
                      <CardContent className="py-12 text-center">
                        <FolderOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground">لا توجد فئات ملفات لهذا الفصل</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="grid sm:grid-cols-2 gap-6"
                    >
                      {fileCategories.map((category, index) => {
                        const colors = getCategoryColor(index);
                        return (
                          <motion.div key={category.id} variants={itemVariants}>
                            <Link
                              href={`/classes/${classId}/subjects/${subjectId}/categories/${category.id}?database=${selectedDatabase}&semester=${selectedSemester.id}`}
                            >
                              <Card hover className="h-full group cursor-pointer overflow-hidden">
                                <div
                                  className={cn('h-2 bg-gradient-to-r', colors.gradient)}
                                />
                                <CardHeader className="pt-6">
                                  <div className="flex items-center justify-between">
                                    <div
                                      className={cn(
                                        'w-14 h-14 rounded-xl flex items-center justify-center',
                                        colors.bg
                                      )}
                                    >
                                      <FolderOpen className={cn('w-7 h-7', colors.text)} />
                                    </div>
                                    <ChevronLeft className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:-translate-x-1 transition-all" />
                                  </div>
                                  <CardTitle className="mt-4 group-hover:text-primary transition-colors">
                                    {category.name}
                                  </CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    {category.articles_count !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <FileText className="w-4 h-4" />
                                        <span>{category.articles_count} مقال</span>
                                      </div>
                                    )}
                                    {category.files_count !== undefined && (
                                      <div className="flex items-center gap-1">
                                        <Download className="w-4 h-4" />
                                        <span>{category.files_count} ملف</span>
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
                </>
              ) : (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">اختر فصلاً دراسياً لعرض فئات الملفات</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
