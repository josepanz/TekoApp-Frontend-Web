import type { LucideIcon } from 'lucide-react';
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string;
  trend?: string;
  trendDirection?: 'up' | 'down' | 'neutral';
  icon: LucideIcon;
}

export function StatCard({
  title,
  value,
  trend,
  trendDirection = 'neutral',
  icon: Icon,
}: StatCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums">
          {value}
        </CardTitle>
        <CardAction>
          <Icon className="text-muted-foreground size-5" />
        </CardAction>
      </CardHeader>
      {trend && (
        <div className="px-6 pb-4">
          <span
            className={cn(
              'text-sm font-medium',
              trendDirection === 'up' && 'text-success',
              trendDirection === 'down' && 'text-destructive',
              trendDirection === 'neutral' && 'text-muted-foreground',
            )}
          >
            {trend}
          </span>
        </div>
      )}
    </Card>
  );
}
