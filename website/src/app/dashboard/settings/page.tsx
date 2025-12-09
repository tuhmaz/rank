'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Shield,
  Palette,
  Globe,
  CreditCard,
  Save,
  Camera,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useThemeStore, useAuthStore } from '@/store/useStore';
import { cn } from '@/lib/utils';

const tabs = [
  { id: 'profile', label: 'الملف الشخصي', icon: User },
  { id: 'notifications', label: 'الإشعارات', icon: Bell },
  { id: 'security', label: 'الأمان', icon: Shield },
  { id: 'appearance', label: 'المظهر', icon: Palette },
  { id: 'language', label: 'اللغة', icon: Globe },
  { id: 'billing', label: 'الفواتير', icon: CreditCard },
];

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const { isDarkMode, toggleDarkMode } = useThemeStore();
  const { user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);

  const [profile, setProfile] = useState({
    name: user?.name || 'أحمد محمد',
    email: user?.email || 'ahmed@email.com',
    phone: '+966 50 123 4567',
    bio: 'مطور ويب متخصص في React و Next.js',
  });

  const handleSave = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">الإعدادات</h1>
        <p className="text-muted-foreground">إدارة إعدادات حسابك وتفضيلاتك</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <Card className="lg:col-span-1 h-fit">
          <CardContent className="p-2">
            <nav className="space-y-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-white'
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

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>الملف الشخصي</CardTitle>
                  <CardDescription>
                    تحديث معلوماتك الشخصية والصورة
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Avatar */}
                  <div className="flex items-center gap-6">
                    <div className="relative">
                      <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center text-white text-3xl font-bold">
                        {profile.name[0]}
                      </div>
                      <button className="absolute bottom-0 left-0 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg">
                        <Camera className="w-4 h-4" />
                      </button>
                    </div>
                    <div>
                      <h3 className="font-semibold">{profile.name}</h3>
                      <p className="text-sm text-muted-foreground">{profile.email}</p>
                      <Button variant="outline" size="sm" className="mt-2">
                        تغيير الصورة
                      </Button>
                    </div>
                  </div>

                  {/* Form */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="الاسم الكامل"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                    <Input
                      label="رقم الهاتف"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    />
                    <div className="sm:col-span-2">
                      <label className="mb-1.5 block text-sm font-medium">النبذة</label>
                      <textarea
                        rows={4}
                        value={profile.bio}
                        onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                        className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button
                      onClick={handleSave}
                      isLoading={isLoading}
                      leftIcon={<Save className="w-4 h-4" />}
                    >
                      حفظ التغييرات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

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
                  <div className="flex items-center justify-between p-4 rounded-lg bg-muted">
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
                      {['#3b82f6', '#8b5cf6', '#22c55e', '#f59e0b', '#ef4444'].map((color) => (
                        <button
                          key={color}
                          className="w-10 h-10 rounded-full border-2 border-transparent hover:border-foreground transition-colors"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>الإشعارات</CardTitle>
                  <CardDescription>إدارة تفضيلات الإشعارات</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    { label: 'إشعارات البريد الإلكتروني', description: 'استلام إشعارات عبر البريد' },
                    { label: 'إشعارات الطلبات', description: 'إشعارات عند وجود طلبات جديدة' },
                    { label: 'إشعارات النظام', description: 'تحديثات وصيانة النظام' },
                    { label: 'إشعارات التسويق', description: 'عروض ومنتجات جديدة' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted"
                    >
                      <div>
                        <h4 className="font-medium">{item.label}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked={index < 2}
                        className="w-5 h-5 rounded border-border text-primary focus:ring-primary/20"
                      />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle>تغيير كلمة المرور</CardTitle>
                  <CardDescription>حافظ على أمان حسابك بكلمة مرور قوية</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    label="كلمة المرور الحالية"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="كلمة المرور الجديدة"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Input
                    label="تأكيد كلمة المرور"
                    type="password"
                    placeholder="••••••••"
                  />
                  <Button>تحديث كلمة المرور</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>المصادقة الثنائية</CardTitle>
                  <CardDescription>إضافة طبقة أمان إضافية لحسابك</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">المصادقة الثنائية غير مفعلة</p>
                      <p className="text-sm text-muted-foreground">
                        قم بتفعيل المصادقة الثنائية لحماية حسابك
                      </p>
                    </div>
                    <Button variant="outline">تفعيل</Button>
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
