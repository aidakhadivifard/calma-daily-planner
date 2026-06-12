import { cn } from '../../lib/cn';

export default function SpeechBubble({ children, className = '', tailSide = 'left' }) {
  return (
    <div
      className={cn(
        'relative rounded-2xl border border-lavender-200/15 bg-night-700/70 px-4 py-3 text-sm leading-snug text-lavender-50 shadow-lg shadow-black/10 backdrop-blur-sm',
        tailSide === 'left' ? 'rounded-bl-md' : 'rounded-br-md',
        className,
      )}
    >
      {children}
      <span
        className={cn(
          'absolute bottom-3 h-3.5 w-3.5 rotate-45 border border-lavender-200/15 bg-night-700/70',
          tailSide === 'left'
            ? '-left-1.5 border-r-0 border-t-0'
            : '-right-1.5 border-l-0 border-b-0',
        )}
      />
    </div>
  );
}
