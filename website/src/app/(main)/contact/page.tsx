'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Clock, MessageCircle } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const contactInfo = [
  {
    icon: Mail,
    title: 'البريد الإلكتروني',
    value: 'info@rank.com',
    description: 'راسلنا في أي وقت',
  },
  {
    icon: Phone,
    title: 'الهاتف',
    value: '+966 50 123 4567',
    description: 'من السبت للخميس',
  },
  {
    icon: MapPin,
    title: 'العنوان',
    value: 'الرياض، السعودية',
    description: 'حي الملقا، طريق الملك فهد',
  },
  {
    icon: Clock,
    title: 'ساعات العمل',
    value: '9 ص - 6 م',
    description: 'من السبت للخميس',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // محاكاة إرسال النموذج
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    alert('تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.');
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-primary font-medium">تواصل معنا</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            نحن هنا <span className="gradient-text">لمساعدتك</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            لديك سؤال أو مشروع في ذهنك؟ لا تتردد في التواصل معنا.
            فريقنا جاهز للإجابة على جميع استفساراتك.
          </p>
        </motion.div>
      </section>

      {/* Contact Info Cards */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactInfo.map((info, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="text-center h-full">
                <CardContent>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 mx-auto flex items-center justify-center mb-4">
                    <info.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{info.title}</h3>
                  <p className="text-primary font-medium mb-1" dir="ltr">{info.value}</p>
                  <p className="text-sm text-muted-foreground">{info.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Form & Map */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">أرسل لنا رسالة</h2>
                    <p className="text-sm text-muted-foreground">سنرد عليك خلال 24 ساعة</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="الاسم الكامل"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="أدخل اسمك"
                      required
                    />
                    <Input
                      label="البريد الإلكتروني"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      required
                    />
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <Input
                      label="رقم الهاتف"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+966 5X XXX XXXX"
                    />
                    <Input
                      label="الموضوع"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="موضوع الرسالة"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-foreground">
                      الرسالة
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground placeholder:text-muted-foreground transition-colors duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                      placeholder="اكتب رسالتك هنا..."
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    className="w-full"
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    إرسال الرسالة
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <Card className="h-full min-h-[500px] overflow-hidden">
              <div className="absolute inset-0 bg-muted">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3624.146887986!2d46.6765!3d24.7136!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjTCsDQyJzQ5LjAiTiA0NsKwNDAnMzUuNCJF!5e0!3m2!1sen!2ssa!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Teaser */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold mb-4">لديك أسئلة أخرى؟</h2>
          <p className="text-muted-foreground mb-6">
            تحقق من صفحة الأسئلة الشائعة أو تواصل معنا مباشرة
          </p>
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline">الأسئلة الشائعة</Button>
            <Button>
              <Phone className="w-4 h-4 ml-2" />
              اتصل بنا
            </Button>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
