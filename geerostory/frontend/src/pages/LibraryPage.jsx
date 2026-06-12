import { useNavigate } from 'react-router-dom';
import Geero from '../components/mascot/Geero';
import SpeechBubble from '../components/ui/SpeechBubble';
import StoryCard from '../components/ui/StoryCard';
import { formatDuration } from '../lib/format';
import { useAppData } from '../context/AppDataContext';

export default function LibraryPage() {
  const navigate = useNavigate();
  const { stories, toggleBookmark } = useAppData();
  const bookmarked = stories.filter((s) => s.bookmarked);

  return (
    <div className="px-5 pb-4 pt-6">
      <h1 className="font-display text-2xl font-extrabold text-lavender-50">My Library</h1>

      <div className="mt-5 flex items-start gap-3">
        <Geero pose="book" size={92} />
        <SpeechBubble className="mt-2 flex-1">
          You can bookmark a story to add it to your library.
        </SpeechBubble>
      </div>

      {bookmarked.length === 0 ? (
        <p className="mt-8 text-center text-sm leading-relaxed text-lavender-200/55">
          No bookmarked stories yet.
          <br />
          Tap the bookmark icon on any story to save it here.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-3">
          {bookmarked.map((story) => (
            <StoryCard
              key={story.id}
              title={story.title}
              themeIds={story.themeIds}
              coverUrl={story.imageUrl}
              duration={formatDuration(story.duration)}
              bookmarked={story.bookmarked}
              onClick={() => navigate(`/story/${story.id}`)}
              onToggleBookmark={() => toggleBookmark(story.id, false)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
