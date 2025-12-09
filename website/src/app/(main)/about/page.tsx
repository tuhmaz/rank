'use client';

import { motion } from 'framer-motion';
import { Users, Target, Award, Rocket } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';

const teamMembers = [
  {
    name: 'أحمد محمد',
    role: 'المدير التنفيذي',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=ahmed',
  },
  {
    name: 'سارة علي',
    role: 'مديرة التطوير',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sara',
  },
  {
    name: 'محمد خالد',
    role: 'مصمم رئيسي',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mohammed',
  },
  {
    name: 'نورة سعد',
    role: 'مديرة التسويق',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=noura',
  },
];

const values = [
  {
    icon: Target,
    title: 'رؤيتنا',
    description: 'أن نكون الشريك التقني الأول لكل من يسعى للتميز الرقمي في المنطقة العربية.',
  },
  {
    icon: Rocket,
    title: 'رسالتنا',
    description: 'تمكين الشركات والأفراد من تحقيق أهدافهم الرقمية من خلال حلول مبتكرة وخدمات متميزة.',
  },
  {
    icon: Award,
    title: 'قيمنا',
    description: 'الجودة، الابتكار، الشفافية، والالتزام هي المبادئ التي توجه كل ما نقوم به.',
  },
];

export default function AboutPage() {
  return (
    <div className="pt-24 pb-20">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-primary font-medium">من نحن</span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-6">
            نبني <span className="gradient-text">المستقبل الرقمي</span> معاً
          </h1>
          <p className="text-lg text-muted-foreground">
            منذ عام 2014، نعمل على تقديم حلول رقمية مبتكرة تساعد عملائنا على
            النمو والتطور. نفخر بفريقنا المتميز وشراكاتنا الناجحة.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '500+', label: 'مشروع منجز' },
            { value: '150+', label: 'عميل سعيد' },
            { value: '50+', label: 'موظف متميز' },
            { value: '10+', label: 'سنوات خبرة' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 rounded-2xl bg-card border border-border"
            >
              <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                {stat.value}
              </div>
              <div className="text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/50 py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">ما يميزنا</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              نؤمن بأن النجاح يبدأ بقيم راسخة ورؤية واضحة
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card hover className="h-full text-center">
                  <CardContent>
                    <div className="w-16 h-16 rounded-2xl gradient-bg mx-auto flex items-center justify-center mb-4">
                      <value.icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold mb-3">{value.title}</h3>
                    <p className="text-muted-foreground">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-primary font-medium">فريقنا</span>
          <h2 className="text-3xl font-bold mt-2 mb-4">
            خبراء <span className="gradient-text">متميزون</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            فريقنا يضم نخبة من المتخصصين في مختلف المجالات التقنية
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover className="text-center">
                <CardContent>
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 overflow-hidden bg-muted">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-bold mb-1">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
