import { cn } from '../../lib/cn';

const VARIANTS = {
  primary:
    'bg-lavender-300 text-night-900 hover:bg-lavender-200 shadow-[0_12px_30px_-12px_rgba(155,126,240,0.65)]',
  secondary: 'bg-night-700 text-lavender-50 hover:bg-night-600 border border-night-500/80',
  outline: 'bg-transparent border border-lavender-300/35 text-lavender-100 hover:border-lavender-300 hover:bg-lavender-300/5',
  ghost: 'bg-transparent text-lavender-200 hover:bg-night-700/70',
  danger: 'bg-rose-400/90 text-night-900 hover:bg-rose-400',
};

const SIZES = {
  sm: 'px-4 py-2 text-sm gap-1.5',
  md: 'px-6 py-3 text-base gap-2',
  lg: 'px-7 py-3.5 text-base gap-2',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-full font-display font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100',
        VARIANTS[variant],
        SIZES[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
