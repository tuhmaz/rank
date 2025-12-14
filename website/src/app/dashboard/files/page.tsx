'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  Trash2,
  Download,
  FileText,
  Image,
  Film,
  Music,
  Archive,
  File,
  Grid,
  List,
  Upload,
  Eye,
  MoreVertical,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import { cn, formatFileSize } from '@/lib/utils';
import type { FileItem } from '@/types';

const mockFiles: FileItem[] = [
  {
    id: 1,
    name: 'تقرير-الأداء-2024.pdf',
    original_name: 'تقرير الأداء 2024.pdf',
    path: '/uploads/documents/report-2024.pdf',
    mime_type: 'application/pdf',
    size: 2458000,
    created_at: '2024-01-15 10:30:00',
  },
  {
    id: 2,
    name: 'صورة-الغلاف.jpg',
    original_name: 'صورة الغلاف.jpg',
    path: '/uploads/images/cover.jpg',
    mime_type: 'image/jpeg',
    size: 856000,
    created_at: '2024-01-14 15:45:00',
  },
  {
    id: 3,
    name: 'فيديو-تعليمي.mp4',
    original_name: 'فيديو تعليمي.mp4',
    path: '/uploads/videos/tutorial.mp4',
    mime_type: 'video/mp4',
    size: 125800000,
    created_at: '2024-01-13 09:00:00',
  },
  {
    id: 4,
    name: 'ملف-صوتي.mp3',
    original_name: 'ملف صوتي.mp3',
    path: '/uploads/audio/podcast.mp3',
    mime_type: 'audio/mpeg',
    size: 8540000,
    created_at: '2024-01-12 14:20:00',
  },
  {
    id: 5,
    name: 'ملفات-المشروع.zip',
    original_name: 'ملفات المشروع.zip',
    path: '/uploads/archives/project.zip',
    mime_type: 'application/zip',
    size: 45600000,
    created_at: '2024-01-11 11:15:00',
  },
  {
    id: 6,
    name: 'جدول-البيانات.xlsx',
    original_name: 'جدول البيانات.xlsx',
    path: '/uploads/documents/data.xlsx',
    mime_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    size: 125000,
    created_at: '2024-01-10 16:30:00',
  },
];

type ViewMode = 'grid' | 'list';
type FileType = 'all' | 'document' | 'image' | 'video' | 'audio' | 'archive';

const getFileIcon = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return Image;
  if (mimeType.startsWith('video/')) return Film;
  if (mimeType.startsWith('audio/')) return Music;
  if (mimeType.includes('zip') || mimeType.includes('rar') || mimeType.includes('tar')) return Archive;
  if (mimeType.includes('pdf') || mimeType.includes('document') || mimeType.includes('sheet')) return FileText;
  return File;
};

const getFileColor = (mimeType: string) => {
  if (mimeType.startsWith('image/')) return 'text-green-500 bg-green-500/10';
  if (mimeType.startsWith('video/')) return 'text-purple-500 bg-purple-500/10';
  if (mimeType.startsWith('audio/')) return 'text-pink-500 bg-pink-500/10';
  if (mimeType.includes('zip') || mimeType.includes('rar')) return 'text-yellow-500 bg-yellow-500/10';
  if (mimeType.includes('pdf')) return 'text-red-500 bg-red-500/10';
  return 'text-blue-500 bg-blue-500/10';
};

const fileTypeFilters: { value: FileType; label: string; icon: typeof File }[] = [
  { value: 'all', label: 'الكل', icon: File },
  { value: 'document', label: 'مستندات', icon: FileText },
  { value: 'image', label: 'صور', icon: Image },
  { value: 'video', label: 'فيديو', icon: Film },
  { value: 'audio', label: 'صوت', icon: Music },
  { value: 'archive', label: 'أرشيف', icon: Archive },
];

export default function FilesPage() {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState<FileType>('all');
  const [selectedFiles, setSelectedFiles] = useState<number[]>([]);
  const [uploadModal, setUploadModal] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);

  const filterByType = (file: FileItem) => {
    if (fileTypeFilter === 'all') return true;
    const mime = file.mime_type;
    switch (fileTypeFilter) {
      case 'document':
        return mime.includes('pdf') || mime.includes('document') || mime.includes('sheet');
      case 'image':
        return mime.startsWith('image/');
      case 'video':
        return mime.startsWith('video/');
      case 'audio':
        return mime.startsWith('audio/');
      case 'archive':
        return mime.includes('zip') || mime.includes('rar') || mime.includes('tar');
      default:
        return true;
    }
  };

  const filteredFiles = files.filter(
    (f) =>
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      filterByType(f)
  );

  const toggleSelectFile = (id: number) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  const handleDelete = (ids: number[]) => {
    if (confirm(`هل أنت متأكد من حذف ${ids.length} ملف؟`)) {
      setFiles(files.filter((f) => !ids.includes(f.id)));
      setSelectedFiles([]);
    }
  };

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">إدارة الملفات</h1>
          <p className="text-muted-foreground">إدارة ملفات النظام والوسائط</p>
        </div>
        <Button leftIcon={<Upload className="w-4 h-4" />} onClick={() => setUploadModal(true)}>
          رفع ملف
        </Button>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">إجمالي الملفات</p>
            <p className="text-2xl font-bold text-primary">{files.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">الحجم الإجمالي</p>
            <p className="text-2xl font-bold text-accent">{formatFileSize(totalSize)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">الصور</p>
            <p className="text-2xl font-bold text-success">
              {files.filter((f) => f.mime_type.startsWith('image/')).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-muted-foreground">المستندات</p>
            <p className="text-2xl font-bold text-warning">
              {files.filter((f) => f.mime_type.includes('pdf') || f.mime_type.includes('document')).length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <Card>
        <CardContent className="py-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex items-center gap-2 overflow-x-auto">
              {fileTypeFilters.map((filter) => (
                <button
                  key={filter.value}
                  onClick={() => setFileTypeFilter(filter.value)}
                  className={cn(
                    'flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-colors',
                    fileTypeFilter === filter.value
                      ? 'bg-primary text-white'
                      : 'bg-muted hover:bg-muted/80'
                  )}
                >
                  <filter.icon className="w-4 h-4" />
                  {filter.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              {selectedFiles.length > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  leftIcon={<Trash2 className="w-4 h-4" />}
                  onClick={() => handleDelete(selectedFiles)}
                >
                  حذف ({selectedFiles.length})
                </Button>
              )}
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-48 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <div className="flex items-center border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'grid' ? 'bg-primary text-white' : 'hover:bg-muted'
                  )}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'p-2 transition-colors',
                    viewMode === 'list' ? 'bg-primary text-white' : 'hover:bg-muted'
                  )}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Files */}
      {viewMode === 'grid' ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredFiles.map((file, index) => {
            const Icon = getFileIcon(file.mime_type);
            const colorClass = getFileColor(file.mime_type);

            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer transition-all hover:shadow-lg',
                    selectedFiles.includes(file.id) && 'ring-2 ring-primary'
                  )}
                  onClick={() => toggleSelectFile(file.id)}
                >
                  <CardContent className="py-6">
                    <div className="flex flex-col items-center text-center">
                      <div className={cn('w-16 h-16 rounded-xl flex items-center justify-center mb-4', colorClass)}>
                        <Icon className="w-8 h-8" />
                      </div>
                      <p className="font-medium text-sm truncate w-full mb-1">{file.original_name}</p>
                      <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                    </div>
                    <div className="flex items-center justify-center gap-2 mt-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete([file.id]); }}
                        className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {filteredFiles.map((file) => {
                const Icon = getFileIcon(file.mime_type);
                const colorClass = getFileColor(file.mime_type);

                return (
                  <div
                    key={file.id}
                    className={cn(
                      'flex items-center gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors',
                      selectedFiles.includes(file.id) && 'bg-primary/5'
                    )}
                    onClick={() => toggleSelectFile(file.id)}
                  >
                    <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', colorClass)}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{file.original_name}</p>
                      <p className="text-sm text-muted-foreground">{file.created_at}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{formatFileSize(file.size)}</div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); setPreviewFile(file); }}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Eye className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => e.stopPropagation()}
                        className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                      >
                        <Download className="w-4 h-4 text-muted-foreground" />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete([file.id]); }}
                        className="p-1.5 rounded-lg hover:bg-error/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Modal */}
      <Modal
        isOpen={uploadModal}
        onClose={() => setUploadModal(false)}
        title="رفع ملف جديد"
      >
        <div className="mt-4">
          <div className="border-2 border-dashed border-border rounded-xl p-12 text-center">
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="font-medium mb-2">اسحب الملفات هنا أو اضغط للاختيار</p>
            <p className="text-sm text-muted-foreground mb-4">
              يدعم: PDF, DOC, XLS, JPG, PNG, MP4, MP3, ZIP
            </p>
            <Button variant="outline">
              اختيار ملف
            </Button>
          </div>
          <div className="flex items-center justify-end gap-3 pt-6">
            <Button variant="outline" onClick={() => setUploadModal(false)}>
              إلغاء
            </Button>
            <Button>
              رفع
            </Button>
          </div>
        </div>
      </Modal>

      {/* Preview Modal */}
      <Modal
        isOpen={!!previewFile}
        onClose={() => setPreviewFile(null)}
        title="معاينة الملف"
      >
        {previewFile && (
          <div className="mt-4">
            <div className="flex items-center gap-4 mb-6">
              <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center', getFileColor(previewFile.mime_type))}>
                {(() => { const Icon = getFileIcon(previewFile.mime_type); return <Icon className="w-6 h-6" />; })()}
              </div>
              <div>
                <p className="font-medium">{previewFile.original_name}</p>
                <p className="text-sm text-muted-foreground">{formatFileSize(previewFile.size)}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">النوع</span>
                <span>{previewFile.mime_type}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">المسار</span>
                <span className="font-mono text-xs">{previewFile.path}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">تاريخ الرفع</span>
                <span>{previewFile.created_at}</span>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 pt-6">
              <Button variant="outline" onClick={() => setPreviewFile(null)}>
                إغلاق
              </Button>
              <Button leftIcon={<Download className="w-4 h-4" />}>
                تحميل
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
