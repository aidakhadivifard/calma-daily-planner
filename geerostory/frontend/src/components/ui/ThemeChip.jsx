import { cn } from '../../lib/cn';

export default function ThemeChip({ label, active = false, onClick, icon: Icon }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors',
        active
          ? 'bg-lavender-300 text-night-900'
          : 'bg-night-700/70 text-lavender-100 border border-night-500 hover:border-lavender-300/40',
      )}
    >
      {Icon && <Icon size={15} strokeWidth={2.5} />}
      {label}
    </button>
  );
}
