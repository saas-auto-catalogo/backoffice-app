import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  loading?: boolean;
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  loading = false,
  className = '',
  disabled,
  ...props
}: ButtonProps) {
  const variantStyles = {
    primary: 'bg-brand-primary hover:bg-brand-primaryHover text-white shadow-subtle border border-transparent',
    secondary: 'bg-surface-muted hover:bg-slate-200 text-typography-heading border border-surface-border',
    outline: 'bg-white hover:bg-surface-muted text-typography-body border border-surface-border hover:border-surface-borderHover',
    danger: 'bg-brand-price hover:bg-red-700 text-white shadow-subtle border border-transparent',
    ghost: 'bg-transparent hover:bg-surface-muted text-typography-body border border-transparent',
  };

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 font-semibold rounded-md',
    md: 'text-xs px-4 py-2 h-10 gap-2 font-bold rounded-lg',
    lg: 'text-sm px-5 py-2.5 h-12 gap-2 font-bold rounded-lg',
  };

  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center transition-all duration-150 select-none disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : icon ? (
        <span className="shrink-0">{icon}</span>
      ) : null}
      <span>{children}</span>
    </button>
  );
}
