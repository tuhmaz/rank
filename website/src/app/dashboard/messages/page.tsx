'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Send,
  FileText,
  Trash2,
  Star,
  Search,
  Plus,
  Reply,
  Forward,
  MoreVertical,
  Inbox,
  Clock,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import type { Message } from '@/types';

type TabType = 'inbox' | 'sent' | 'drafts';

const mockMessages: Record<TabType, Message[]> = {
  inbox: [
    {
      id: 1,
      subject: 'طلب مراجعة المقال',
      body: 'مرحباً، أرجو مراجعة المقال المرفق وإبداء الملاحظات',
      sender_id: 2,
      sender: { id: 2, name: 'أحمد محمد', email: 'ahmed@example.com' },
      recipient_id: 1,
      is_read: false,
      is_starred: true,
      created_at: '2024-01-15 10:30:00',
    },
    {
      id: 2,
      subject: 'تحديث النظام',
      body: 'تم تحديث النظام بنجاح، يرجى التحقق من الميزات الجديدة',
      sender_id: 3,
      sender: { id: 3, name: 'سارة علي', email: 'sara@example.com' },
      recipient_id: 1,
      is_read: true,
      is_starred: false,
      created_at: '2024-01-14 15:45:00',
    },
    {
      id: 3,
      subject: 'اجتماع الفريق',
      body: 'تذكير باجتماع الفريق يوم الخميس الساعة 3 مساءً',
      sender_id: 4,
      sender: { id: 4, name: 'محمد خالد', email: 'mohammed@example.com' },
      recipient_id: 1,
      is_read: true,
      is_starred: false,
      created_at: '2024-01-13 09:00:00',
    },
  ],
  sent: [
    {
      id: 4,
      subject: 'رد: طلب مراجعة المقال',
      body: 'تم المراجعة، المقال ممتاز مع بعض التعديلات الطفيفة',
      sender_id: 1,
      recipient_id: 2,
      recipient: { id: 2, name: 'أحمد محمد', email: 'ahmed@example.com' },
      is_read: true,
      is_starred: false,
      created_at: '2024-01-15 11:00:00',
    },
  ],
  drafts: [
    {
      id: 5,
      subject: 'تقرير الأداء الشهري',
      body: 'مرفق تقرير الأداء الشهري لشهر يناير...',
      sender_id: 1,
      recipient_id: 0,
      is_read: false,
      is_starred: false,
      created_at: '2024-01-15 08:30:00',
    },
  ],
};

export default function MessagesPage() {
  const [activeTab, setActiveTab] = useState<TabType>('inbox');
  const [messages, setMessages] = useState(mockMessages);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [composeModal, setComposeModal] = useState(false);
  const [composeData, setComposeData] = useState({ to: '', subject: '', body: '' });

  const tabs = [
    { id: 'inbox' as TabType, label: 'الوارد', icon: Inbox, count: messages.inbox.filter(m => !m.is_read).length },
    { id: 'sent' as TabType, label: 'المرسل', icon: Send, count: 0 },
    { id: 'drafts' as TabType, label: 'المسودات', icon: FileText, count: messages.drafts.length },
  ];

  const handleStarMessage = (id: number) => {
    setMessages(prev => ({
      ...prev,
      [activeTab]: prev[activeTab].map(m =>
        m.id === id ? { ...m, is_starred: !m.is_starred } : m
      ),
    }));
  };

  const handleDeleteMessage = (id: number) => {
    if (confirm('هل أنت متأكد من حذف هذه الرسالة؟')) {
      setMessages(prev => ({
        ...prev,
        [activeTab]: prev[activeTab].filter(m => m.id !== id),
      }));
      if (selectedMessage?.id === id) {
        setSelectedMessage(null);
      }
    }
  };

  const handleSendMessage = () => {
    const newMessage: Message = {
      id: Date.now(),
      subject: composeData.subject,
      body: composeData.body,
      sender_id: 1,
      recipient_id: 0,
      is_read: true,
      is_starred: false,
      created_at: new Date().toISOString(),
    };
    setMessages(prev => ({
      ...prev,
      sent: [newMessage, ...prev.sent],
    }));
    setComposeModal(false);
    setComposeData({ to: '', subject: '', body: '' });
  };

  const handleReadMessage = (message: Message) => {
    if (!message.is_read && activeTab === 'inbox') {
      setMessages(prev => ({
        ...prev,
        inbox: prev.inbox.map(m =>
          m.id === message.id ? { ...m, is_read: true } : m
        ),
      }));
    }
    setSelectedMessage(message);
  };

  const filteredMessages = messages[activeTab].filter(m =>
    m.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.body.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">الرسائل</h1>
          <p className="text-muted-foreground">إدارة الرسائل والمراسلات</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setComposeModal(true)}>
          رسالة جديدة
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardContent className="py-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedMessage(null); }}
                  className={cn(
                    'w-full flex items-center justify-between px-4 py-3 rounded-lg transition-colors',
                    activeTab === tab.id
                      ? 'bg-primary text-white'
                      : 'hover:bg-muted'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </div>
                  {tab.count > 0 && (
                    <Badge variant={activeTab === tab.id ? 'info' : 'warning'}>
                      {tab.count}
                    </Badge>
                  )}
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Stats */}
          <Card>
            <CardContent className="py-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">غير مقروءة</span>
                  <span className="font-bold text-warning">
                    {messages.inbox.filter(m => !m.is_read).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">مميزة</span>
                  <span className="font-bold text-accent">
                    {messages.inbox.filter(m => m.is_starred).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">المسودات</span>
                  <span className="font-bold text-muted-foreground">
                    {messages.drafts.length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <div className="lg:col-span-9">
          <Card className="h-full">
            <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border">
              <CardTitle>{tabs.find(t => t.id === activeTab)?.label}</CardTitle>
              <div className="relative">
                <Search className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="بحث في الرسائل..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-muted border-none rounded-lg pr-9 pl-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {selectedMessage ? (
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-xl font-bold mb-2">{selectedMessage.subject}</h2>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>
                          {activeTab === 'inbox'
                            ? `من: ${selectedMessage.sender?.name}`
                            : `إلى: ${selectedMessage.recipient?.name || 'غير محدد'}`
                          }
                        </span>
                        <span>•</span>
                        <Clock className="w-4 h-4" />
                        <span>{selectedMessage.created_at}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => setSelectedMessage(null)}>
                        رجوع
                      </Button>
                      {activeTab === 'inbox' && (
                        <>
                          <Button variant="outline" size="sm" leftIcon={<Reply className="w-4 h-4" />}>
                            رد
                          </Button>
                          <Button variant="outline" size="sm" leftIcon={<Forward className="w-4 h-4" />}>
                            تحويل
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="prose prose-sm max-w-none">
                    <p className="text-foreground whitespace-pre-wrap">{selectedMessage.body}</p>
                  </div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">
                  <Mail className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>لا توجد رسائل</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {filteredMessages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={cn(
                        'flex items-start gap-4 p-4 hover:bg-muted/50 cursor-pointer transition-colors',
                        !message.is_read && activeTab === 'inbox' && 'bg-primary/5'
                      )}
                      onClick={() => handleReadMessage(message)}
                    >
                      <button
                        onClick={(e) => { e.stopPropagation(); handleStarMessage(message.id); }}
                        className="mt-1"
                      >
                        <Star
                          className={cn(
                            'w-5 h-5 transition-colors',
                            message.is_starred ? 'fill-accent text-accent' : 'text-muted-foreground hover:text-accent'
                          )}
                        />
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <span className={cn('font-medium', !message.is_read && 'font-bold')}>
                            {activeTab === 'inbox' ? message.sender?.name : message.recipient?.name || 'غير محدد'}
                          </span>
                          <span className="text-xs text-muted-foreground">{message.created_at}</span>
                        </div>
                        <p className={cn('text-sm mb-1', !message.is_read ? 'font-semibold' : 'text-foreground')}>
                          {message.subject}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">{message.body}</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteMessage(message.id); }}
                        className="p-1.5 rounded-lg hover:bg-error/10 transition-colors opacity-0 group-hover:opacity-100"
                      >
                        <Trash2 className="w-4 h-4 text-error" />
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Compose Modal */}
      <Modal
        isOpen={composeModal}
        onClose={() => setComposeModal(false)}
        title="رسالة جديدة"
        size="lg"
      >
        <div className="space-y-4 mt-4">
          <Input
            label="إلى"
            value={composeData.to}
            onChange={(e) => setComposeData({ ...composeData, to: e.target.value })}
            placeholder="البريد الإلكتروني للمستلم"
          />
          <Input
            label="الموضوع"
            value={composeData.subject}
            onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
            placeholder="موضوع الرسالة"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">المحتوى</label>
            <textarea
              value={composeData.body}
              onChange={(e) => setComposeData({ ...composeData, body: e.target.value })}
              rows={8}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="اكتب رسالتك هنا..."
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setComposeModal(false)}>
              إلغاء
            </Button>
            <Button leftIcon={<Send className="w-4 h-4" />} onClick={handleSendMessage}>
              إرسال
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
