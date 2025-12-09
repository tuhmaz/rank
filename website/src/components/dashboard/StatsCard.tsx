'use client';

import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown, LucideIcon } from 'lucide-react';
import Card, { CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface StatsCardProps {
  title: string;
  value: string;
  change: number;
  changeType: 'increase' | 'decrease';
  icon: LucideIcon;
  color: string;
}

export default function StatsCard({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  color,
}: StatsCardProps) {
  return (
    <Card hover>
      <CardContent>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            <div className={cn(
              'flex items-center gap-1 text-sm',
              changeType === 'increase' ? 'text-success' : 'text-error'
            )}>
              {changeType === 'increase' ? (
                <ArrowUp className="w-4 h-4" />
              ) : (
                <ArrowDown className="w-4 h-4" />
              )}
              <span>{Math.abs(change)}%</span>
              <span className="text-muted-foreground">من الشهر الماضي</span>
            </div>
          </div>
          <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center', color)}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
