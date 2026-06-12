import { Bookmark, Clock } from 'lucide-react';
import AdventureCover from './AdventureCover';
import { THEMES_BY_ID } from '../../data/themes';
import { cn } from '../../lib/cn';

export default function StoryCard({
  title,
  themeIds = [],
  coverUrl,
  duration,
  bookmarked,
  onClick,
  onToggleBookmark,
  className = '',
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
      className={cn(
        'group flex cursor-pointer flex-col overflow-hidden rounded-2xl bg-night-700/50 text-left transition hover:bg-night-700',
        className,
      )}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <AdventureCover themeId={themeIds[0]} src={coverUrl} alt={title} />
        {onToggleBookmark && (
          <button
            type="button"
            aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
            className={cn(
              'absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full backdrop-blur transition-colors',
              bookmarked ? 'bg-lavender-300 text-night-900' : 'bg-night-900/55 text-lavender-50',
            )}
          >
            <Bookmark size={15} fill={bookmarked ? 'currentColor' : 'none'} />
          </button>
        )}
        {duration && (
          <span className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-night-900/70 px-2 py-0.5 text-xs font-semibold text-lavender-50">
            <Clock size={12} /> {duration}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug text-lavender-50">
          {title}
        </h3>
        {themeIds.length > 0 && (
          <p className="text-xs text-lavender-200/55">
            {themeIds.map((id) => THEMES_BY_ID[id]?.label).filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
    </div>
  );
}
