import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'available' | 'sold' | 'syncing' | 'error' | 'neutral' | 'purple' | 'amber';
  size?: 'sm' | 'md';
  dot?: boolean;
  icon?: React.ReactNode;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  dot = false,
  icon,
  className = '',
  ...props
}: BadgeProps) {
  const variantStyles = {
    available: 'bg-[#DCFCE7] text-[#166534] border-[#BBF7D0]',
    sold: 'bg-[#F1F5F9] text-[#475569] border-[#E2E8F0]',
    syncing: 'bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]',
    error: 'bg-[#FEF2F2] text-[#DE2626] border-[#FECACA]',
    amber: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
    purple: 'bg-[#F3E8FF] text-[#7E22CE] border-[#E9D5FF]',
    neutral: 'bg-[#F8FAFC] text-[#334155] border-[#E2E8F0]',
  };

  const dotColors = {
    available: 'bg-[#16A34A]',
    sold: 'bg-[#64748B]',
    syncing: 'bg-[#1D4ED8]',
    error: 'bg-[#DE2626]',
    amber: 'bg-[#D97706]',
    purple: 'bg-[#7E22CE]',
    neutral: 'bg-[#64748B]',
  };

  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-colors select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  );
}
