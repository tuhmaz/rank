'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Code2, Palette, Smartphone, Globe, Database, Shield, Check } from 'lucide-react';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import Button from '@/components/ui/Button';

const services = [
  {
    icon: Code2,
    title: 'تطوير الويب',
    description: 'نبني مواقع وتطبيقات ويب متطورة باستخدام أحدث التقنيات العالمية',
    features: [
      'مواقع متجاوبة مع جميع الأجهزة',
      'تطبيقات React & Next.js',
      'واجهات برمجة تطبيقات REST & GraphQL',
      'قواعد بيانات متقدمة',
      'استضافة سحابية',
    ],
    price: 'من 5,000 ر.س',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Smartphone,
    title: 'تطبيقات الموبايل',
    description: 'تطوير تطبيقات أصلية وهجينة لمنصات iOS و Android',
    features: [
      'تطبيقات React Native',
      'تطبيقات Flutter',
      'تصميم UX/UI احترافي',
      'نشر على المتاجر',
      'صيانة ودعم مستمر',
    ],
    price: 'من 10,000 ر.س',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: Palette,
    title: 'التصميم الإبداعي',
    description: 'نصمم هويات بصرية فريدة وواجهات مستخدم جذابة',
    features: [
      'تصميم واجهات المستخدم',
      'تجربة المستخدم UX',
      'الهوية البصرية الكاملة',
      'موشن جرافيك',
      'تصميم الشعارات',
    ],
    price: 'من 3,000 ر.س',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Globe,
    title: 'التسويق الرقمي',
    description: 'استراتيجيات تسويق فعالة لزيادة الوصول والمبيعات',
    features: [
      'تحسين محركات البحث SEO',
      'إدارة الإعلانات المدفوعة',
      'التسويق بالمحتوى',
      'إدارة وسائل التواصل',
      'تحليل البيانات',
    ],
    price: 'من 2,000 ر.س/شهر',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Database,
    title: 'الحوسبة السحابية',
    description: 'حلول سحابية آمنة وقابلة للتوسع لجميع أحجام الأعمال',
    features: [
      'إعداد البنية السحابية',
      'AWS & Azure & Google Cloud',
      'DevOps و CI/CD',
      'مراقبة الأداء',
      'النسخ الاحتياطي',
    ],
    price: 'حسب المتطلبات',
    color: 'from-cyan-500 to-cyan-600',
  },
  {
    icon: Shield,
    title: 'الأمن السيبراني',
    description: 'حماية بياناتك وأنظمتك من التهديدات الإلكترونية',
    features: [
      'تقييم الثغرات الأمنية',
      'اختبار الاختراق',
      'تشفير البيانات',
      'مراقبة الأمان 24/7',
      'التدريب والتوعية',
    ],
    price: 'حسب المتطلبات',
    color: 'from-red-500 to-red-600',
  },
];

export default function ServicesPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-primary font-medium">خدماتنا</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            حلول <span className="gradient-text">متكاملة</span> لأعمالك
          </h1>
          <p className="text-lg text-muted-foreground">
            نقدم مجموعة شاملة من الخدمات الرقمية المصممة خصيصاً لتلبية
            احتياجاتك ومساعدتك على تحقيق أهدافك
          </p>
        </motion.div>
      </section>

      {/* Services Grid */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="h-full flex flex-col">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-r ${service.color} flex items-center justify-center mb-4`}>
                    <service.icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-success shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4 border-t border-border flex-col items-stretch gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">يبدأ من</span>
                    <span className="font-bold text-primary">{service.price}</span>
                  </div>
                  <Link href="/contact">
                    <Button className="w-full" rightIcon={<ArrowLeft className="w-4 h-4" />}>
                      اطلب الخدمة
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-3xl gradient-bg p-12 text-center text-white"
        >
          <h2 className="text-3xl font-bold mb-4">لم تجد ما تبحث عنه؟</h2>
          <p className="text-white/80 mb-8 max-w-2xl mx-auto">
            نقدم حلولاً مخصصة تناسب احتياجاتك الفريدة. تواصل معنا وسنساعدك
            في إيجاد الحل الأمثل لمشروعك.
          </p>
          <Link href="/contact">
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-white/90"
              rightIcon={<ArrowLeft className="w-5 h-5" />}
            >
              تواصل معنا
            </Button>
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
