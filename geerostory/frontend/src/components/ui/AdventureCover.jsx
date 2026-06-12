import { THEMES_BY_ID } from '../../data/themes';
import { cn } from '../../lib/cn';

export default function AdventureCover({ themeId, src, alt = '', className = '' }) {
  if (src) {
    return <img src={src} alt={alt} className={cn('h-full w-full object-cover', className)} />;
  }

  const theme = THEMES_BY_ID[themeId] || THEMES_BY_ID.animals;
  const Icon = theme.icon;

  return (
    <div
      className={cn('flex h-full w-full items-center justify-center', className)}
      style={{
        background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[1]})`,
      }}
    >
      {Icon && <Icon size={36} strokeWidth={1.75} className="text-white/90" />}
    </div>
  );
}
