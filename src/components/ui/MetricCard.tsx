import React from 'react';
import { Card } from './Card.js';

export interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  highlightPrice?: boolean;
}

export function MetricCard({
  title,
  value,
  subtitle,
  change,
  changeType = 'positive',
  icon,
  highlightPrice = false,
}: MetricCardProps) {
  const changeColor = {
    positive: 'text-brand-accent bg-green-50 border border-green-200',
    negative: 'text-brand-price bg-red-50 border border-red-200',
    neutral: 'text-typography-muted bg-surface-muted border border-surface-border',
  };

  return (
    <Card className="p-4 flex flex-col justify-between h-full hover:border-surface-borderHover">
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold text-typography-muted uppercase tracking-wider">
          {title}
        </span>
        <div className="p-2 rounded-lg bg-surface-muted text-brand-primary">
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-baseline gap-2">
          <span
            className={`text-2xl font-bold tracking-tight ${
              highlightPrice ? 'text-brand-price font-extrabold' : 'text-typography-heading'
            }`}
          >
            {value}
          </span>
          {change && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${changeColor[changeType]}`}>
              {change}
            </span>
          )}
        </div>
        {subtitle && (
          <p className="text-xs text-typography-muted mt-1 truncate">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
}
