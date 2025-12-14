'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import $ from 'jquery';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'summernote/dist/summernote-bs5.css';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Save,
  FileText,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { articlesService, COUNTRIES, apiClient, API_ENDPOINTS } from '@/lib/api/services';
import type { SchoolClass, Subject, Semester, ArticleFormData } from '@/types';

export default function CreateArticlePage() {
  const router = useRouter();

  const extractError = (err: unknown) => {
    if (err && typeof err === 'object') {
      const e = err as any;
      return {
        status: e.status ?? e.response?.status ?? undefined,
        message: e.message ?? e.response?.data?.message ?? 'تعذر تنفيذ العملية',
        errors: e.errors ?? e.response?.data?.errors ?? undefined,
        name: e.name ?? undefined,
      };
    }
    return { message: String(err || '') };
  };

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<'1' | '2' | '3' | '4'>('1');

  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [semesters, setSemesters] = useState<Semester[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [loadingSemesters, setLoadingSemesters] = useState(false);

  const editorRef = useRef<HTMLDivElement | null>(null);
  const [summernoteReady, setSummernoteReady] = useState(false);
  const [useTitleForMeta, setUseTitleForMeta] = useState(false);
  const [useKeywordsForMeta, setUseKeywordsForMeta] = useState(false);
  const [isCheckingTitle, setIsCheckingTitle] = useState(false);
  const [isTitleDuplicate, setIsTitleDuplicate] = useState(false);

  const [formData, setFormData] = useState<ArticleFormData>({
    country: '1',
    class_id: 0,
    subject_id: 0,
    semester_id: 0,
    title: '',
    content: '',
    keywords: '',
    file_category: 'study_plan',
    file_name: '',
    status: true,
  });

  const classOptions = useMemo(
    () => classes.map((c) => ({ value: c.id, label: c.grade_name })),
    [classes]
  );

  const subjectOptions = useMemo(
    () => subjects.map((s) => ({ value: s.id, label: s.subject_name })),
    [subjects]
  );

  const semesterOptions = useMemo(
    () => semesters.map((s) => ({ value: s.id, label: s.semester_name })),
    [semesters]
  );

  const fileCategoryOptions = [
    { value: 'study_plan', label: 'خطط الدراسة' },
    { value: 'worksheet', label: 'أوراق عمل' },
    { value: 'exam', label: 'اختبارات' },
    { value: 'book', label: 'كتب' },
    { value: 'record', label: 'السجلات' },
  ];

  const generateMetaFromContent = (html: string, title: string, keywords?: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html || '';
    const text = (tmp.textContent || tmp.innerText || '').trim();
    const base = text || title || (keywords || '');
    const normalized = base.replace(/\s+/g, ' ').trim();
    return normalized.length > 160 ? normalized.slice(0, 157) + '...' : normalized;
  };

  useEffect(() => {
    const fetchCreateData = async () => {
      try {
        setIsLoading(true);
        const res = await articlesService.getCreateData(selectedCountry);
        setClasses(res.classes || []);
        setSubjects([]);
        setSemesters([]);
        setFormData((prev) => ({ ...prev, country: selectedCountry }));
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCreateData();
  }, [selectedCountry]);

  const toDatabase = (id: '1' | '2' | '3' | '4') => (id === '1' ? 'jo' : id === '2' ? 'sa' : id === '3' ? 'eg' : 'ps');

  useEffect(() => {
    const fetchSubjectsByClass = async () => {
      if (!formData.class_id) {
        setSubjects([]);
        return;
      }
      try {
        setLoadingSubjects(true);
        const res = await apiClient.get<{ subjects: Subject[] }>(
          API_ENDPOINTS.FILTER.SUBJECTS_BY_CLASS(formData.class_id),
          { database: toDatabase(selectedCountry) }
        );
        const list = (res.data as any).subjects ?? (res.data as any).data?.subjects ?? [];
        setSubjects(list);
      } catch (e) {
        console.error(e);
        setSubjects([]);
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjectsByClass();
  }, [formData.class_id, selectedCountry]);

  useEffect(() => {
    const fetchSemestersBySubject = async () => {
      if (!formData.subject_id) {
        setSemesters([]);
        return;
      }
      try {
        setLoadingSemesters(true);
        const res = await apiClient.get<{ semesters: Semester[] }>(
          API_ENDPOINTS.FILTER.SEMESTERS_BY_SUBJECT(formData.subject_id),
          { database: toDatabase(selectedCountry) }
        );
        const list = (res.data as any).semesters ?? (res.data as any).data?.semesters ?? [];
        setSemesters(list);
      } catch (e) {
        console.error(e);
        setSemesters([]);
      } finally {
        setLoadingSemesters(false);
      }
    };
    fetchSemestersBySubject();
  }, [formData.subject_id, selectedCountry]);

  useEffect(() => {
    const t = setTimeout(async () => {
      const title = formData.title.trim();
      if (!title) {
        setIsTitleDuplicate(false);
        setIsCheckingTitle(false);
        return;
      }
      try {
        setIsCheckingTitle(true);
        const unique = await articlesService.isTitleUnique(title, selectedCountry);
        setIsTitleDuplicate(!unique);
      } catch {
        setIsTitleDuplicate(false);
      } finally {
        setIsCheckingTitle(false);
      }
    }, 400);
    return () => clearTimeout(t);
  }, [formData.title, selectedCountry]);

  useEffect(() => {
    (window as any).$ = $;
    (window as any).jQuery = $;
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href =
      'https://fonts.googleapis.com/css2?family=Cairo:wght@400;700&family=Tajawal:wght@400;700&family=Almarai:wght@400;700&display=swap';
    document.head.appendChild(fontLink);
    (async () => {
      await import('bootstrap/dist/js/bootstrap.bundle.min.js');
      await import('summernote/dist/summernote-bs5');
      await import('summernote/dist/lang/summernote-ar-AR');
      setSummernoteReady(true);
    })();
  }, []);

  useEffect(() => {
    if (!summernoteReady || !editorRef.current) return;
    const jq = (window as any).jQuery || (window as any).$;
    if (!jq) return;
    const el = jq(editorRef.current);
    if (!el.data('summernote')) {
      el.summernote({
        height: 380,
        minHeight: 240,
        maxHeight: null,
        placeholder: 'اكتب المحتوى هنا...',
        lang: 'ar-AR',
        fontSizes: ['10', '12', '14', '16', '18', '24', '36'],
        buttons: {
          fileUpload: function () {
            const ui = (jq as any).summernote.ui;
            return ui.button({
              contents: '<span class="note-icon-link"></span>',
              tooltip: 'رفع ملف',
              click: async function () {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = async () => {
                  const f = input.files && input.files[0];
                  if (!f) return;
                  const fd = new FormData();
                  fd.append('file', f);
                  try {
                    const resp = await fetch('/api/upload/file', { method: 'POST', body: fd });
                    const json = await resp.json();
                    const url = (json as any).url ?? (json as any).data?.url;
                    const name = (json as any).name ?? (json as any).data?.name ?? f.name;
                    if (url) {
                      const a = document.createElement('a');
                      a.href = url;
                      a.textContent = name;
                      a.target = '_blank';
                      el.summernote('insertNode', a);
                    }
                  } catch (err) {
                    const info = extractError(err);
                    if (info.status === 404) {
                      try {
                        const resp2 = await fetch('/api/upload/file', { method: 'POST', body: fd });
                        const json2 = await resp2.json();
                        const url2 = (json2 as any).url ?? (json2 as any).data?.url;
                        const name2 = (json2 as any).name ?? (json2 as any).data?.name ?? f.name;
                        if (url2) {
                          const a = document.createElement('a');
                          a.href = url2;
                          a.textContent = name2;
                          a.target = '_blank';
                          el.summernote('insertNode', a);
                        }
                        return;
                      } catch (e2) {
                        console.error('Upload file error (secure)', extractError(e2));
                      }
                    }
                    console.error('Upload file error', info);
                  }
                };
                input.click();
              },
            });
          },
        },
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'italic', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['fontsize', ['fontsize']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video', 'fileUpload']],
          ['view', ['fullscreen', 'codeview', 'help']],
        ],
        popover: {
          image: [
            ['imagesize', ['imageSize100', 'imageSize50', 'imageSize25']],
            ['float', ['floatLeft', 'floatRight', 'floatNone']],
            ['remove', ['removeMedia']],
          ],
        },
        styleTags: ['p', 'blockquote', 'pre', 'h1', 'h2', 'h3', 'h4'],
        fontNames: ['Cairo', 'Tajawal', 'Almarai', 'Arial', 'Helvetica', 'Times New Roman', 'Courier New'],
        fontNamesIgnoreCheck: ['Cairo', 'Tajawal', 'Almarai'],
        disableDragAndDrop: true,
        dialogsInBody: true,
        callbacks: {
          onChange: (contents: string) => {
            setFormData((prev) => ({ ...prev, content: contents }));
          },
          onImageUpload: async (files: File[]) => {
            if (!files || !files.length) return;
            const file = files[0];
            const fd = new FormData();
            fd.append('file', file);
            fd.append('width', '1920');
            fd.append('quality', '85');
            fd.append('convert_to_webp', 'true');
            try {
              const resp = await fetch('/api/upload/image', { method: 'POST', body: fd });
              const json = await resp.json();
              const url = (json as any).url ?? (json as any).data?.url;
              if (url) {
                el.summernote('insertImage', url, ($image: any) => {
                  $image.attr('alt', file.name);
                  $image.css('max-width', '100%');
                  $image.css('height', 'auto');
                });
              }
            } catch (err) {
              const info = extractError(err);
              if (info.status === 404) {
                try {
                  const resp2 = await fetch('/api/upload/image', { method: 'POST', body: fd });
                  const json2 = await resp2.json();
                  const url2 = (json2 as any).url ?? (json2 as any).data?.url;
                  if (url2) {
                    el.summernote('insertImage', url2, ($image: any) => {
                      $image.attr('alt', file.name);
                      $image.css('max-width', '100%');
                      $image.css('height', 'auto');
                    });
                  }
                  return;
                } catch (e2) {
                  console.error('Upload image error (secure)', extractError(e2));
                }
              }
              console.error('Upload image error', info);
            }
          },
        },
      });
      const editable = el.next('.note-editor').find('.note-editable');
      editable.attr('dir', 'rtl');
      editable.css('font-family', 'Cairo, Tajawal, Almarai, sans-serif');
      editable.css('text-align', 'right');
      if (formData.content) {
        el.summernote('code', formData.content);
      }
    }
    return () => {
      try {
        el.summernote('destroy');
      } catch {}
    };
  }, [summernoteReady]);

  useEffect(() => {
    if (useTitleForMeta) {
      setFormData((prev) => ({ ...prev, meta_description: prev.title }));
    }
  }, [formData.title, useTitleForMeta]);

  useEffect(() => {
    if (useKeywordsForMeta) {
      setFormData((prev) => ({ ...prev, meta_description: prev.keywords || '' }));
    }
  }, [formData.keywords, useKeywordsForMeta]);

  const handleFileChange = (file: File | undefined) => {
    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
        file_name: file.name,
      }));
    } else {
      setFormData((prev) => {
        const { file, ...rest } = prev;
        return { ...(rest as ArticleFormData), file_name: '' };
      });
    }
  };

  const canSubmit =
    formData.title.trim() !== '' &&
    formData.content.trim() !== '' &&
    !!formData.class_id &&
    !!formData.subject_id &&
    !!formData.semester_id &&
    formData.file_category.trim() !== '' &&
    !isTitleDuplicate;

  const handleSubmit = async () => {
    if (!canSubmit || isTitleDuplicate) return;
    try {
      setIsSubmitting(true);
      const computedMeta =
        useTitleForMeta
          ? formData.title
          : useKeywordsForMeta
            ? (formData.keywords || '')
            : (formData.meta_description && formData.meta_description.trim())
              ? formData.meta_description!.trim()
              : generateMetaFromContent(formData.content, formData.title, formData.keywords);
      const created = await articlesService.create({ ...formData, meta_description: computedMeta });
      router.push('/dashboard/articles');
    } catch (e) {
      console.error(e);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إنشاء مقال جديد</h1>
          <p className="text-muted-foreground">نموذج متقدم لإنشاء مقال احترافي</p>
        </div>
        <div className="flex items-center gap-2">
          <label htmlFor="article-country" className="sr-only">الدولة</label>
          <select
            id="article-country"
            name="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value as '1' | '2' | '3' | '4')}
            className="bg-card border border-border rounded-lg px-3 py-2 text-sm"
          >
            {COUNTRIES.map((country) => (
              <option key={country.id} value={country.id}>
                {country.name}
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            onClick={() => router.push('/dashboard/articles')}
            leftIcon={<ArrowLeft className="w-4 h-4" />}
          >
            رجوع
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <style>{`
            .note-editor .dropdown-menu,
            .note-editor .note-dropdown-menu {
              z-index: 3000;
            }
            .note-editor .note-editable {
              direction: rtl;
              text-align: right;
              font-family: Cairo, Tajawal, Almarai, sans-serif;
            }
          `}</style>
          <Card>
            <CardHeader>
              <CardTitle>المحتوى</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Input
                label="العنوان"
                id="article-title"
                name="title"
                placeholder="أدخل عنوان المقال"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                error={isTitleDuplicate ? 'العنوان مستخدم مسبقاً' : undefined}
                required
              />
              <div>
                <label htmlFor="article-meta-description" className="mb-1.5 block text-sm font-medium">الوصف المختصر</label>
                <textarea
                  id="article-meta-description"
                  name="meta_description"
                  value={formData.meta_description || ''}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, meta_description: e.target.value }))
                  }
                  rows={3}
                  className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  disabled={useTitleForMeta || useKeywordsForMeta}
                  placeholder="وصف موجز يظهر في نتائج البحث"
                />
                <div className="mt-2 flex flex-col gap-2">
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="article-meta-use-title"
                      name="meta_use_title"
                      checked={useTitleForMeta}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseTitleForMeta(checked);
                        if (checked) {
                          setUseKeywordsForMeta(false);
                          setFormData((prev) => ({ ...prev, meta_description: prev.title }));
                        } else {
                          setFormData((prev) => ({ ...prev, meta_description: prev.meta_description || '' }));
                        }
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm">استخدام عنوان المقال كوصف المحتوى</span>
                  </label>
                  <label className="inline-flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      id="article-meta-use-keywords"
                      name="meta_use_keywords"
                      checked={useKeywordsForMeta}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        setUseKeywordsForMeta(checked);
                        if (checked) {
                          setUseTitleForMeta(false);
                          setFormData((prev) => ({ ...prev, meta_description: prev.keywords || '' }));
                        } else {
                          setFormData((prev) => ({ ...prev, meta_description: prev.meta_description || '' }));
                        }
                      }}
                      className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                    />
                    <span className="text-sm">استخدام كلمات دلالية المقال كوصف المحتوى</span>
                  </label>
                  <p className="text-xs text-muted-foreground">
                    ترك الحقل فارغاً يولّد الوصف تلقائياً من المحتوى أو العنوان.
                  </p>
                </div>
              </div>
              <div className="space-y-2">
                <p className="mb-1.5 block text-sm font-medium">المحتوى</p>
                <div ref={editorRef} id="summernote" className="w-full min-h-[240px] rounded-lg border border-border bg-card" />
              </div>
              <Input
                label="الكلمات المفتاحية"
                id="article-keywords"
                name="keywords"
                placeholder="مثال: تعليم, رياضيات, منهج"
                value={formData.keywords || ''}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, keywords: e.target.value }))
                }
                rightIcon={<Tag className="w-4 h-4" />}
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>الخصائص</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select
                label="الصف الدراسي"
                id="article-class"
                name="class_id"
                value={formData.class_id || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    class_id: Number(e.target.value),
                    subject_id: 0,
                    semester_id: 0,
                  }))
                }
                options={classOptions}
                placeholder="اختر الصف"
                required
              />
              <Select
                label="المادة"
                id="article-subject"
                name="subject_id"
                value={formData.subject_id || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    subject_id: Number(e.target.value),
                    semester_id: 0,
                  }))
                }
                options={
                  loadingSubjects
                    ? [{ value: '', label: 'جاري التحميل...' }]
                    : subjectOptions
                }
                disabled={loadingSubjects || !formData.class_id}
                placeholder="اختر المادة"
                required
              />
              <Select
                label="الفصل"
                id="article-semester"
                name="semester_id"
                value={formData.semester_id || ''}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    semester_id: Number(e.target.value),
                  }))
                }
                options={
                  loadingSemesters
                    ? [{ value: '', label: 'جاري التحميل...' }]
                    : semesterOptions
                }
                disabled={loadingSemesters || !formData.subject_id}
                placeholder="اختر الفصل"
                required
              />

              <Select
                label="تصنيف الملف"
                id="article-file-category"
                name="file_category"
                value={formData.file_category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, file_category: e.target.value }))
                }
                options={fileCategoryOptions}
                required
              />

              <div className="grid grid-cols-1 gap-3">
                <p className="mb-1.5 block text-sm font-medium">ملف مرفق</p>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer">
                    <FileText className="w-4 h-4" />
                    <span>اختيار ملف</span>
                    <input
                      type="file"
                      id="article-file"
                      name="file"
                      className="hidden"
                      onChange={(e) => handleFileChange(e.target.files?.[0])}
                    />
                  </label>
                  <Input
                    placeholder="اسم الملف المرفق"
                    id="article-file-name"
                    name="file_name"
                    value={formData.file_name || ''}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, file_name: e.target.value }))
                    }
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  id="article-status"
                  name="status"
                  checked={!!formData.status}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, status: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                />
                <span className="text-sm text-muted-foreground">نشر المقال فوراً</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => router.push('/dashboard/articles')}
                >
                  إلغاء
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting || isLoading}
                  disabled={!canSubmit || isSubmitting || isLoading}
                  rightIcon={<Save className="w-4 h-4" />}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  إنشاء المقال
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
