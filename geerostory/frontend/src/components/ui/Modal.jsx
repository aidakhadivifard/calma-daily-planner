import { cn } from '../../lib/cn';

export default function Modal({ open, onClose, children, className = '' }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-6">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-night-950/70 backdrop-blur-sm"
      />
      <div
        className={cn(
          'relative w-full max-w-sm rounded-3xl border border-lavender-200/10 bg-night-800 p-6 shadow-2xl',
          'animate-[fadeIn_0.15s_ease-out]',
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
