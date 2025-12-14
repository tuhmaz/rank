'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  Users,
} from 'lucide-react';
import Card, { CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { cn } from '@/lib/utils';
import type { CalendarEvent } from '@/types';

const DAYS_AR = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const MONTHS_AR = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
];

const mockEvents: CalendarEvent[] = [
  {
    id: 1,
    title: 'اجتماع الفريق',
    description: 'اجتماع أسبوعي لمناقشة التقدم',
    start_date: '2024-01-15',
    end_date: '2024-01-15',
    start_time: '10:00',
    end_time: '11:00',
    type: 'meeting',
    color: '#3B82F6',
    location: 'قاعة الاجتماعات',
  },
  {
    id: 2,
    title: 'موعد تسليم المشروع',
    description: 'تسليم المرحلة الأولى من المشروع',
    start_date: '2024-01-20',
    end_date: '2024-01-20',
    type: 'deadline',
    color: '#EF4444',
  },
  {
    id: 3,
    title: 'ورشة عمل',
    description: 'ورشة عمل حول التقنيات الحديثة',
    start_date: '2024-01-18',
    end_date: '2024-01-18',
    start_time: '14:00',
    end_time: '17:00',
    type: 'workshop',
    color: '#10B981',
    location: 'المركز التدريبي',
  },
  {
    id: 4,
    title: 'عطلة رسمية',
    description: 'يوم التأسيس',
    start_date: '2024-01-22',
    end_date: '2024-01-22',
    type: 'holiday',
    color: '#F59E0B',
  },
];

const eventTypeOptions = [
  { value: 'meeting', label: 'اجتماع' },
  { value: 'deadline', label: 'موعد تسليم' },
  { value: 'workshop', label: 'ورشة عمل' },
  { value: 'holiday', label: 'عطلة' },
  { value: 'other', label: 'أخرى' },
];

const eventColors: Record<string, string> = {
  meeting: '#3B82F6',
  deadline: '#EF4444',
  workshop: '#10B981',
  holiday: '#F59E0B',
  other: '#8B5CF6',
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)); // January 2024
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_date: '',
    start_time: '',
    end_time: '',
    type: 'meeting',
    location: '',
  });

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }

    // Add days of the month
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(i);
    }

    return days;
  };

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.start_date === dateStr);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateStr);
    setFormData(prev => ({ ...prev, start_date: dateStr }));
  };

  const handleAddEvent = () => {
    const newEvent: CalendarEvent = {
      id: Date.now(),
      title: formData.title,
      description: formData.description,
      start_date: formData.start_date,
      end_date: formData.start_date,
      start_time: formData.start_time,
      end_time: formData.end_time,
      type: formData.type as CalendarEvent['type'],
      color: eventColors[formData.type],
      location: formData.location,
    };
    setEvents([...events, newEvent]);
    setShowEventModal(false);
    setFormData({
      title: '',
      description: '',
      start_date: '',
      start_time: '',
      end_time: '',
      type: 'meeting',
      location: '',
    });
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date();
  const isToday = (day: number) =>
    day === today.getDate() &&
    currentDate.getMonth() === today.getMonth() &&
    currentDate.getFullYear() === today.getFullYear();

  const upcomingEvents = events
    .filter(e => new Date(e.start_date) >= today)
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">التقويم</h1>
          <p className="text-muted-foreground">إدارة المواعيد والأحداث</p>
        </div>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setShowEventModal(true)}>
          إضافة حدث
        </Button>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth('prev')}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <CardTitle className="min-w-[150px] text-center">
                  {MONTHS_AR[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <button
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-lg hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>
              <Button variant="outline" size="sm" onClick={() => setCurrentDate(new Date())}>
                اليوم
              </Button>
            </CardHeader>
            <CardContent>
              {/* Days header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {DAYS_AR.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventsForDate(day) : [];
                  const dateStr = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : '';

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.01 }}
                      className={cn(
                        'min-h-[100px] p-2 rounded-lg border transition-colors cursor-pointer',
                        day ? 'border-border hover:border-primary/50' : 'border-transparent',
                        isToday(day!) && 'bg-primary/10 border-primary',
                        selectedDate === dateStr && 'ring-2 ring-primary'
                      )}
                      onClick={() => day && handleDateClick(day)}
                    >
                      {day && (
                        <>
                          <span className={cn(
                            'text-sm font-medium',
                            isToday(day) && 'text-primary'
                          )}>
                            {day}
                          </span>
                          <div className="mt-1 space-y-1">
                            {dayEvents.slice(0, 2).map(event => (
                              <div
                                key={event.id}
                                className="text-xs px-1.5 py-0.5 rounded truncate"
                                style={{ backgroundColor: `${event.color}20`, color: event.color }}
                                onClick={(e) => { e.stopPropagation(); setSelectedEvent(event); }}
                              >
                                {event.title}
                              </div>
                            ))}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{dayEvents.length - 2} أحداث
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          {/* Selected Date Events */}
          {selectedDate && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">
                  أحداث {selectedDate}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {getEventsForDate(parseInt(selectedDate.split('-')[2])).length === 0 ? (
                  <p className="text-muted-foreground text-sm text-center py-4">
                    لا توجد أحداث في هذا اليوم
                  </p>
                ) : (
                  <div className="space-y-3">
                    {getEventsForDate(parseInt(selectedDate.split('-')[2])).map(event => (
                      <div
                        key={event.id}
                        className="p-3 rounded-lg border border-border hover:border-primary/50 cursor-pointer transition-colors"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-3 h-3 rounded-full mt-1.5"
                            style={{ backgroundColor: event.color }}
                          />
                          <div className="flex-1">
                            <p className="font-medium">{event.title}</p>
                            {event.start_time && (
                              <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                                <Clock className="w-3 h-3" />
                                {event.start_time} - {event.end_time}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <Button
                  variant="outline"
                  className="w-full mt-4"
                  leftIcon={<Plus className="w-4 h-4" />}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, start_date: selectedDate }));
                    setShowEventModal(true);
                  }}
                >
                  إضافة حدث
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                الأحداث القادمة
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingEvents.length === 0 ? (
                <p className="text-muted-foreground text-sm text-center py-4">
                  لا توجد أحداث قادمة
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingEvents.map(event => (
                    <div
                      key={event.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                    >
                      <div
                        className="w-2 h-full min-h-[40px] rounded"
                        style={{ backgroundColor: event.color }}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{event.title}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {event.start_date}
                        </p>
                        {event.location && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {event.location}
                          </p>
                        )}
                      </div>
                      <Badge
                        variant={
                          event.type === 'deadline' ? 'error' :
                          event.type === 'meeting' ? 'info' :
                          event.type === 'workshop' ? 'success' :
                          'warning'
                        }
                      >
                        {eventTypeOptions.find(o => o.value === event.type)?.label}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Event Type Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">أنواع الأحداث</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {eventTypeOptions.map(type => (
                  <div key={type.value} className="flex items-center gap-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: eventColors[type.value] }}
                    />
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal
        isOpen={showEventModal}
        onClose={() => setShowEventModal(false)}
        title="إضافة حدث جديد"
      >
        <div className="space-y-4 mt-4">
          <Input
            label="عنوان الحدث"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="مثال: اجتماع الفريق"
          />
          <Input
            label="التاريخ"
            type="date"
            value={formData.start_date}
            onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="وقت البداية"
              type="time"
              value={formData.start_time}
              onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
            />
            <Input
              label="وقت النهاية"
              type="time"
              value={formData.end_time}
              onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
            />
          </div>
          <Select
            label="نوع الحدث"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={eventTypeOptions}
          />
          <Input
            label="المكان"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="مثال: قاعة الاجتماعات"
          />
          <div>
            <label className="mb-1.5 block text-sm font-medium">الوصف</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-foreground resize-none focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              placeholder="وصف الحدث (اختياري)"
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowEventModal(false)}>
              إلغاء
            </Button>
            <Button onClick={handleAddEvent}>
              إضافة
            </Button>
          </div>
        </div>
      </Modal>

      {/* Event Details Modal */}
      <Modal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        title="تفاصيل الحدث"
      >
        {selectedEvent && (
          <div className="space-y-4 mt-4">
            <div className="flex items-start gap-3">
              <div
                className="w-4 h-4 rounded-full mt-1"
                style={{ backgroundColor: selectedEvent.color }}
              />
              <div>
                <h3 className="font-bold text-lg">{selectedEvent.title}</h3>
                <Badge
                  variant={
                    selectedEvent.type === 'deadline' ? 'error' :
                    selectedEvent.type === 'meeting' ? 'info' :
                    selectedEvent.type === 'workshop' ? 'success' :
                    'warning'
                  }
                >
                  {eventTypeOptions.find(o => o.value === selectedEvent.type)?.label}
                </Badge>
              </div>
            </div>

            {selectedEvent.description && (
              <p className="text-muted-foreground">{selectedEvent.description}</p>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>{selectedEvent.start_date}</span>
              </div>
              {selectedEvent.start_time && (
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedEvent.start_time} - {selectedEvent.end_time}</span>
                </div>
              )}
              {selectedEvent.location && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{selectedEvent.location}</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                إغلاق
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
