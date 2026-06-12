import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '../../lib/cn';

export default function TopBar({ title, onBack, right, transparent = false, className = '' }) {
  const navigate = useNavigate();

  return (
    <header
      className={cn(
        'flex items-center justify-between gap-3 px-5 py-4',
        transparent ? 'absolute inset-x-0 top-0 z-10' : '',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Go back"
        onClick={onBack ?? (() => navigate(-1))}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-night-800/70 text-lavender-100 backdrop-blur-sm transition hover:bg-night-700"
      >
        <ArrowLeft size={20} />
      </button>
      {title && (
        <h1 className="flex-1 truncate text-center font-display text-lg font-bold text-lavender-50">
          {title}
        </h1>
      )}
      <div className="flex h-10 w-10 items-center justify-center">{right}</div>
    </header>
  );
}
