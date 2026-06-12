import { cn } from '../../lib/cn';

export default function ToggleSwitch({ checked, onChange, label, disabled = false }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'relative h-7 w-12 shrink-0 rounded-full transition-colors duration-200',
        checked ? 'bg-lavender-400' : 'bg-night-500',
        disabled && 'opacity-50 cursor-not-allowed',
      )}
    >
      <span
        className={cn(
          'absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-md transition-transform duration-200',
          checked && 'translate-x-5',
        )}
      />
    </button>
  );
}
