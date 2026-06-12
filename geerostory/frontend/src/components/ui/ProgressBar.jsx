import { cn } from '../../lib/cn';

export default function ProgressBar({ value = 0, className = '', onSeek }) {
  const pct = Math.min(100, Math.max(0, value * 100));

  const handleClick = (e) => {
    if (!onSeek) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.min(1, Math.max(0, ratio)));
  };

  return (
    <div
      className={cn('h-1.5 w-full cursor-pointer rounded-full bg-night-600', className)}
      onClick={handleClick}
      role="slider"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      tabIndex={0}
    >
      <div
        className="relative h-full rounded-full bg-lavender-300 transition-[width]"
        style={{ width: `${pct}%` }}
      >
        <span className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 translate-x-1/2 rounded-full bg-lavender-100 shadow" />
      </div>
    </div>
  );
}
