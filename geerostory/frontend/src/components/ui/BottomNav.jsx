import { NavLink } from 'react-router-dom';
import { Home, BookMarked, Baby, Settings } from 'lucide-react';
import { cn } from '../../lib/cn';

const TABS = [
  { to: '/app/home', label: 'Home', icon: Home },
  { to: '/app/library', label: 'My Library', icon: BookMarked },
  { to: '/app/child', label: 'My Child', icon: Baby },
  { to: '/app/settings', label: 'Settings', icon: Settings },
];

export default function BottomNav() {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-night-700 bg-night-900/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-md items-stretch justify-between px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                'flex flex-1 flex-col items-center gap-1 px-2 py-2.5 text-[11px] font-semibold transition-colors',
                isActive ? 'text-lavender-300' : 'text-lavender-200/45 hover:text-lavender-200/80',
              )
            }
          >
            <Icon size={22} strokeWidth={2.2} />
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
