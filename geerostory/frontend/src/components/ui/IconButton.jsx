import { cn } from '../../lib/cn';

export default function IconButton({ children, active = false, className = '', ...props }) {
  return (
    <button
      type="button"
      className={cn(
        'flex h-10 w-10 items-center justify-center rounded-full backdrop-blur-sm transition-colors',
        active ? 'bg-lavender-300 text-night-900' : 'bg-night-800/70 text-lavender-100 hover:bg-night-700',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
