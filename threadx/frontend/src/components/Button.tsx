import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost'
  children: ReactNode
  loading?: boolean
}

export default function Button({ variant = 'primary', children, loading, className = '', disabled, ...rest }: ButtonProps) {
  const base = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold uppercase tracking-widest2 text-ink/70 hover:text-ink transition-colors',
  }[variant]

  return (
    <button
      className={`${base} ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...rest}
    >
      {loading ? 'Please wait…' : children}
    </button>
  )
}
