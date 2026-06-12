import { cn } from '../../lib/cn';

export default function TextField({ label, className = '', id, error, hint, ...props }) {
  const fieldId = id || props.name;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <label htmlFor={fieldId} className="text-sm font-semibold text-lavender-100">
          {label}
        </label>
      )}
      <input
        id={fieldId}
        className={cn(
          'w-full rounded-xl border border-night-500 bg-night-800/80 px-4 py-3 text-base text-lavender-50 placeholder:text-lavender-200/35',
          'focus:border-lavender-300 focus:outline-none focus:ring-2 focus:ring-lavender-300/30',
          'transition-colors',
          error && 'border-rose-400 focus:border-rose-400 focus:ring-rose-400/30',
        )}
        {...props}
      />
      {hint && !error && <p className="text-xs text-lavender-200/60">{hint}</p>}
      {error && <p className="text-xs text-rose-300">{error}</p>}
    </div>
  );
}
