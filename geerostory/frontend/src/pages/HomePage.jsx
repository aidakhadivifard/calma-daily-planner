import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { THEMES } from '../data/themes';
import { ADVENTURES, getAdventureTitle } from '../data/adventures';
import { FREE_STORY_LIMIT } from '../data/constants';
import LibraryScene from '../components/mascot/LibraryScene';
import ThemeChip from '../components/ui/ThemeChip';
import StoryCard from '../components/ui/StoryCard';
import { useAppData } from '../context/AppDataContext';

export default function HomePage() {
  const navigate = useNavigate();
  const { child, account } = useAppData();
  const [activeTheme, setActiveTheme] = useState('all');

  const childName = child?.name || 'your child';
  const remaining =
    account && account.subscriptionStatus !== 'active'
      ? Math.max(0, FREE_STORY_LIMIT - (account.freeStoriesUsed || 0))
      : null;

  const adventures =
    activeTheme === 'all'
      ? ADVENTURES
      : ADVENTURES.filter((a) => a.themeIds.includes(activeTheme));

  const handleSelect = (adventure) => {
    if (remaining !== null && remaining <= 0) {
      navigate('/paywall');
      return;
    }
    navigate('/generating', { state: { adventure } });
  };

  return (
    <div className="px-5 pt-6">
      <LibraryScene pose="wink" className="aspect-[16/10]" geeroSize={108} />

      <div className="mt-5">
        <h1 className="font-display text-2xl font-extrabold leading-tight text-lavender-50">
          New adventures for {childName}
        </h1>
        <p className="mt-1 text-sm text-lavender-200/65">
          Pick a theme and Geero will write tonight's story.
        </p>
        {remaining !== null && (
          <p className="mt-2 text-xs font-semibold text-lavender-300/80">
            {remaining} free {remaining === 1 ? 'story' : 'stories'} left this month
          </p>
        )}
      </div>

      <div className="-mx-5 mt-5 overflow-x-auto px-5 no-scrollbar">
        <div className="flex gap-2 pb-1">
          {THEMES.map((theme) => (
            <ThemeChip
              key={theme.id}
              label={theme.label}
              icon={theme.icon}
              active={activeTheme === theme.id}
              onClick={() => setActiveTheme(theme.id)}
            />
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 pb-4">
        {adventures.map((adventure) => (
          <StoryCard
            key={adventure.id}
            title={getAdventureTitle(adventure, childName)}
            themeIds={adventure.themeIds}
            onClick={() => handleSelect(adventure)}
          />
        ))}
      </div>
    </div>
  );
}
