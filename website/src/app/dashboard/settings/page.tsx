'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  Globe,
  Image,
  Mail,
  FileText,
  Palette,
  Save,
  Upload,
  TestTube,
  Send,
  Loader2,
  CheckCircle2,
  XCircle,
  Code,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input, { Textarea } from '@/components/ui/Input';
import { useThemeStore } from '@/store/useStore';
import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/api/client';
import { API_ENDPOINTS } from '@/lib/api/config';

// Tabs configuration
const tabs = [
  { id: 'general', label: 'الإعدادات العامة', icon: Settings },
  { id: 'site', label: 'الموقع', icon: Globe },
  { id: 'media', label: 'الوسائط', icon: Image },
  { id: 'email', label: 'البريد الإلكتروني', icon: Mail },
  { id: 'seo', label: 'SEO', icon: FileText },
  { id: 'ads', label: 'الإعلانات', icon: Code },
  { id: 'appearance', label: 'المظهر', icon: Palette },
];

interface SettingsData {
  // General
  site_name?: string;
  site_description?: string;
  site_language?: string;
  timezone?: string;

  // Site
  site_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;

  // Media
  logo?: string;
  favicon?: string;
  default_image?: string;

  // Email (SMTP)
  mail_host?: string;
  mail_port?: string;
  mail_username?: string;
  mail_password?: string;
  mail_encryption?: string;
  mail_from_address?: string;
  mail_from_name?: string;

  // SEO
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  robots_txt?: string;
  google_analytics?: string;

  // Ads
  adsense_client?: string;
  google_ads_header?: string;
  google_ads_sidebar?: string;
  google_ads_content?: string;
  google_ads_footer?: string;

  [key: string]: any;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('general');
  const { isDarkMode, toggleDarkMode } = useThemeStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({});
  const [originalSettings, setOriginalSettings] = useState<SettingsData>({});
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // SMTP Test states
  const [smtpTestResult, setSmtpTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [testEmail, setTestEmail] = useState('');
  const [isSendingTest, setIsSendingTest] = useState(false);

  // Load settings on mount
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await apiClient.get<{ data: SettingsData }>(API_ENDPOINTS.SETTINGS.GET_ALL);
      const data = response.data?.data || {};
      setSettings(data);
      setOriginalSettings(data);
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'فشل في تحميل الإعدادات' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setMessage(null);

      // Find changed settings
      const changedSettings: SettingsData = {};
      Object.keys(settings).forEach((key) => {
        if (settings[key] !== originalSettings[key]) {
          changedSettings[key] = settings[key];
        }
      });

      if (Object.keys(changedSettings).length === 0) {
        setMessage({ type: 'error', text: 'لم يتم إجراء أي تغييرات' });
        return;
      }

      await apiClient.post(API_ENDPOINTS.SETTINGS.UPDATE, changedSettings);
      setOriginalSettings({ ...settings });
      setMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'فشل في حفظ الإعدادات' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestSmtp = async () => {
    try {
      setIsTesting(true);
      setSmtpTestResult(null);
      const response = await apiClient.post<{ result: { success: boolean; message: string } }>(
        API_ENDPOINTS.SETTINGS.TEST_SMTP
      );
      setSmtpTestResult(response.data?.result || { success: false, message: 'فشل في الاختبار' });
    } catch (error: any) {
      setSmtpTestResult({ success: false, message: error.message || 'فشل في اختبار الاتصال' });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSendTestEmail = async () => {
    if (!testEmail) return;

    try {
      setIsSendingTest(true);
      await apiClient.post(API_ENDPOINTS.SETTINGS.SEND_TEST_EMAIL, { email: testEmail });
      setMessage({ type: 'success', text: 'تم إرسال البريد التجريبي بنجاح' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'فشل في إرسال البريد التجريبي' });
    } finally {
      setIsSendingTest(false);
    }
  };

  const handleUpdateRobots = async () => {
    try {
      setIsSaving(true);
      await apiClient.post(API_ENDPOINTS.SETTINGS.UPDATE_ROBOTS, {
        content: settings.robots_txt || '',
      });
      setMessage({ type: 'success', text: 'تم تحديث robots.txt بنجاح' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'فشل في تحديث robots.txt' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileUpload = async (key: string, file: File) => {
    try {
      const formData = new FormData();
      formData.append(key, file);

      const response = await apiClient.upload<{ data: { path: string } }>(
        API_ENDPOINTS.SETTINGS.UPDATE,
        formData
      );

      setSettings((prev) => ({ ...prev, [key]: response.data?.data?.path || '' }));
      setMessage({ type: 'success', text: 'تم رفع الملف بنجاح' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'فشل في رفع الملف' });
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
          <span className="text-muted-foreground">جاري تحميل الإعدادات...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">الإعدادات</h1>
          <p className="text-muted-foreground">إدارة إعدادات الموقع والتفضيلات</p>
        </div>
        <Button
          onClick={handleSave}
          isLoading={isSaving}
          leftIcon={<Save className="w-4 h-4" />}
        >
          حفظ الإعدادات
        </Button>
      </div>

      {/* Message Alert */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={cn(
              'p-4 rounded-xl flex items-center gap-3',
              message.type === 'success' ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
            )}
          >
            {message.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5" />
            ) : (
              <XCircle className="w-5 h-5" />
            )}
            <span>{message.text}</span>
            <button
              onClick={() => setMessage(null)}
              className="mr-auto hover:opacity-70"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all duration-200',
                    activeTab === tab.id
                      ? 'bg-primary text-white shadow-md'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  )}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </CardContent>
        </Card>

        {/* Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* General Settings */}
          {activeTab === 'general' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>الإعدادات العامة</CardTitle>
                  <CardDescription>إعدادات الموقع الأساسية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="اسم الموقع"
                      value={settings.site_name || ''}
                      onChange={(e) => updateSetting('site_name', e.target.value)}
                      placeholder="أدخل اسم الموقع"
                    />
                    <Input
                      label="لغة الموقع"
                      value={settings.site_language || 'ar'}
                      onChange={(e) => updateSetting('site_language', e.target.value)}
                      placeholder="ar"
                    />
                  </div>
                  <Textarea
                    label="وصف الموقع"
                    value={settings.site_description || ''}
                    onChange={(e) => updateSetting('site_description', e.target.value)}
                    placeholder="وصف مختصر للموقع"
                    resize="vertical"
                  />
                  <Input
                    label="المنطقة الزمنية"
                    value={settings.timezone || 'Asia/Amman'}
                    onChange={(e) => updateSetting('timezone', e.target.value)}
                    placeholder="Asia/Amman"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Site Settings */}
          {activeTab === 'site' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>معلومات الموقع</CardTitle>
                  <CardDescription>معلومات الاتصال والعنوان</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="رابط الموقع"
                    value={settings.site_url || ''}
                    onChange={(e) => updateSetting('site_url', e.target.value)}
                    placeholder="https://example.com"
                  />
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="البريد الإلكتروني للتواصل"
                      type="email"
                      value={settings.contact_email || ''}
                      onChange={(e) => updateSetting('contact_email', e.target.value)}
                      placeholder="contact@example.com"
                    />
                    <Input
                      label="رقم الهاتف"
                      value={settings.contact_phone || ''}
                      onChange={(e) => updateSetting('contact_phone', e.target.value)}
                      placeholder="+962 7xx xxx xxx"
                    />
                  </div>
                  <Textarea
                    label="العنوان"
                    value={settings.address || ''}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    placeholder="عنوان المكتب أو الشركة"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Media Settings */}
          {activeTab === 'media' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>الشعار والأيقونات</CardTitle>
                  <CardDescription>رفع شعار الموقع والأيقونة المفضلة</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Logo Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">شعار الموقع</label>
                    <div className="flex items-center gap-4">
                      <div className="w-32 h-32 rounded-xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                        {settings.logo ? (
                          <img
                            src={`/storage/${settings.logo}`}
                            alt="Logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="logo-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('logo', file);
                          }}
                        />
                        <label htmlFor="logo-upload">
                          <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />} className="cursor-pointer">
                            رفع شعار جديد
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground">PNG, JPG, WEBP, SVG (حد أقصى 2MB)</p>
                      </div>
                    </div>
                  </div>

                  {/* Favicon Upload */}
                  <div>
                    <label className="block text-sm font-medium mb-2">الأيقونة المفضلة (Favicon)</label>
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-muted/50 border-2 border-dashed border-border flex items-center justify-center overflow-hidden">
                        {settings.favicon ? (
                          <img
                            src={`/storage/${settings.favicon}`}
                            alt="Favicon"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Image className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <input
                          type="file"
                          accept="image/*"
                          id="favicon-upload"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload('favicon', file);
                          }}
                        />
                        <label htmlFor="favicon-upload">
                          <Button variant="outline" size="sm" leftIcon={<Upload className="w-4 h-4" />} className="cursor-pointer">
                            رفع أيقونة جديدة
                          </Button>
                        </label>
                        <p className="text-xs text-muted-foreground">يفضل 32x32 أو 64x64 بكسل</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Email Settings */}
          {activeTab === 'email' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات SMTP</CardTitle>
                  <CardDescription>إعدادات خادم البريد الإلكتروني</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="خادم SMTP"
                      value={settings.mail_host || ''}
                      onChange={(e) => updateSetting('mail_host', e.target.value)}
                      placeholder="smtp.example.com"
                    />
                    <Input
                      label="المنفذ"
                      value={settings.mail_port || ''}
                      onChange={(e) => updateSetting('mail_port', e.target.value)}
                      placeholder="587"
                    />
                    <Input
                      label="اسم المستخدم"
                      value={settings.mail_username || ''}
                      onChange={(e) => updateSetting('mail_username', e.target.value)}
                      placeholder="user@example.com"
                    />
                    <Input
                      label="كلمة المرور"
                      type="password"
                      value={settings.mail_password || ''}
                      onChange={(e) => updateSetting('mail_password', e.target.value)}
                      placeholder="••••••••"
                    />
                    <Input
                      label="التشفير"
                      value={settings.mail_encryption || 'tls'}
                      onChange={(e) => updateSetting('mail_encryption', e.target.value)}
                      placeholder="tls / ssl"
                    />
                    <Input
                      label="عنوان المرسل"
                      value={settings.mail_from_address || ''}
                      onChange={(e) => updateSetting('mail_from_address', e.target.value)}
                      placeholder="noreply@example.com"
                    />
                    <Input
                      label="اسم المرسل"
                      value={settings.mail_from_name || ''}
                      onChange={(e) => updateSetting('mail_from_name', e.target.value)}
                      placeholder="اسم الموقع"
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex-col items-start gap-4">
                  {/* SMTP Test Result */}
                  {smtpTestResult && (
                    <div
                      className={cn(
                        'w-full p-3 rounded-lg flex items-center gap-2',
                        smtpTestResult.success ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                      )}
                    >
                      {smtpTestResult.success ? (
                        <CheckCircle2 className="w-5 h-5" />
                      ) : (
                        <XCircle className="w-5 h-5" />
                      )}
                      <span>{smtpTestResult.message}</span>
                    </div>
                  )}

                  <div className="flex flex-wrap items-center gap-3">
                    <Button
                      variant="outline"
                      onClick={handleTestSmtp}
                      isLoading={isTesting}
                      leftIcon={<TestTube className="w-4 h-4" />}
                    >
                      اختبار الاتصال
                    </Button>
                  </div>

                  {/* Send Test Email */}
                  <div className="w-full flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label="إرسال بريد تجريبي"
                        type="email"
                        value={testEmail}
                        onChange={(e) => setTestEmail(e.target.value)}
                        placeholder="test@example.com"
                      />
                    </div>
                    <Button
                      variant="secondary"
                      onClick={handleSendTestEmail}
                      isLoading={isSendingTest}
                      disabled={!testEmail}
                      leftIcon={<Send className="w-4 h-4" />}
                    >
                      إرسال
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* SEO Settings */}
          {activeTab === 'seo' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات SEO</CardTitle>
                  <CardDescription>تحسين محركات البحث</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="عنوان الصفحة الرئيسية"
                    value={settings.meta_title || ''}
                    onChange={(e) => updateSetting('meta_title', e.target.value)}
                    placeholder="عنوان الموقع | الوصف"
                  />
                  <Textarea
                    label="الوصف التعريفي"
                    value={settings.meta_description || ''}
                    onChange={(e) => updateSetting('meta_description', e.target.value)}
                    placeholder="وصف الموقع لمحركات البحث (150-160 حرف)"
                  />
                  <Input
                    label="الكلمات المفتاحية"
                    value={settings.meta_keywords || ''}
                    onChange={(e) => updateSetting('meta_keywords', e.target.value)}
                    placeholder="كلمة1, كلمة2, كلمة3"
                  />
                  <Input
                    label="معرف Google Analytics"
                    value={settings.google_analytics || ''}
                    onChange={(e) => updateSetting('google_analytics', e.target.value)}
                    placeholder="G-XXXXXXXXXX"
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>ملف Robots.txt</CardTitle>
                  <CardDescription>التحكم في فهرسة محركات البحث</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    value={settings.robots_txt || 'User-agent: *\nAllow: /'}
                    onChange={(e) => updateSetting('robots_txt', e.target.value)}
                    placeholder="محتوى robots.txt"
                    resize="vertical"
                    className="font-mono text-sm"
                  />
                </CardContent>
                <CardFooter>
                  <Button
                    variant="secondary"
                    onClick={handleUpdateRobots}
                    isLoading={isSaving}
                    leftIcon={<Save className="w-4 h-4" />}
                  >
                    تحديث Robots.txt
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          )}

          {/* Ads Settings */}
          {activeTab === 'ads' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>إعدادات Google AdSense</CardTitle>
                  <CardDescription>إدارة أكواد الإعلانات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="معرف AdSense Client"
                    value={settings.adsense_client || ''}
                    onChange={(e) => updateSetting('adsense_client', e.target.value)}
                    placeholder="ca-pub-xxxxxxxxxxxxxxxx"
                  />
                  <Textarea
                    label="كود إعلان الهيدر"
                    value={settings.google_ads_header || ''}
                    onChange={(e) => updateSetting('google_ads_header', e.target.value)}
                    placeholder="<script>...</script>"
                    className="font-mono text-sm"
                  />
                  <Textarea
                    label="كود إعلان الشريط الجانبي"
                    value={settings.google_ads_sidebar || ''}
                    onChange={(e) => updateSetting('google_ads_sidebar', e.target.value)}
                    placeholder="<script>...</script>"
                    className="font-mono text-sm"
                  />
                  <Textarea
                    label="كود إعلان المحتوى"
                    value={settings.google_ads_content || ''}
                    onChange={(e) => updateSetting('google_ads_content', e.target.value)}
                    placeholder="<script>...</script>"
                    className="font-mono text-sm"
                  />
                  <Textarea
                    label="كود إعلان الفوتر"
                    value={settings.google_ads_footer || ''}
                    onChange={(e) => updateSetting('google_ads_footer', e.target.value)}
                    placeholder="<script>...</script>"
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Appearance Settings */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>المظهر</CardTitle>
                  <CardDescription>تخصيص مظهر لوحة التحكم</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-muted/50">
                    <div>
                      <h4 className="font-medium">الوضع الداكن</h4>
                      <p className="text-sm text-muted-foreground">
                        تفعيل الوضع الداكن للواجهة
                      </p>
                    </div>
                    <button
                      onClick={toggleDarkMode}
                      className={cn(
                        'relative w-14 h-8 rounded-full transition-colors',
                        isDarkMode ? 'bg-primary' : 'bg-border'
                      )}
                    >
                      <motion.div
                        animate={{ x: isDarkMode ? 24 : 4 }}
                        className="absolute top-1 w-6 h-6 rounded-full bg-white shadow-lg"
                      />
                    </button>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">اختر اللون الأساسي</h4>
                    <div className="flex items-center gap-3">
                      {[
                        { color: '#0891b2', name: 'Teal' },
                        { color: '#7c3aed', name: 'Purple' },
                        { color: '#22c55e', name: 'Green' },
                        { color: '#f59e0b', name: 'Amber' },
                        { color: '#ef4444', name: 'Red' },
                      ].map((item) => (
                        <button
                          key={item.color}
                          className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground transition-colors shadow-md"
                          style={{ backgroundColor: item.color }}
                          title={item.name}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
