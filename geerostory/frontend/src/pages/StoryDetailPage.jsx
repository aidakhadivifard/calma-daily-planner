import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Bookmark, Clock } from 'lucide-react';
import TopBar from '../components/ui/TopBar';
import IconButton from '../components/ui/IconButton';
import AdventureCover from '../components/ui/AdventureCover';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import { THEMES_BY_ID } from '../data/themes';
import { formatDuration } from '../lib/format';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { api } from '../services/api';

export default function StoryDetailPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { getIdToken } = useAuth();
  const { stories, toggleBookmark, upsertStory } = useAppData();

  const cached = stories.find((s) => s.id === storyId);
  const [story, setStory] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState('');

  useEffect(() => {
    if (cached) {
      setStory(cached);
      setLoading(false);
      return;
    }
    let active = true;
    (async () => {
      try {
        const token = await getIdToken();
        const data = await api.getStory(token, storyId);
        if (!active) return;
        setStory(data);
        upsertStory(data);
      } catch (err) {
        if (!active) return;
        setError(err.message || 'Could not load this story.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const handleBookmark = async () => {
    if (!story) return;
    const updated = await toggleBookmark(story.id, !story.bookmarked);
    setStory(updated);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  if (error || !story) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-rose-300">{error || 'Story not found.'}</p>
        <Button variant="secondary" onClick={() => navigate('/app/home')}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-10">
      <div className="relative aspect-square w-full">
        <AdventureCover
          themeId={story.themeIds?.[0]}
          src={story.imageUrl}
          alt={story.title}
          className="rounded-b-3xl"
        />
        <TopBar
          transparent
          right={
            <IconButton aria-label="Bookmark story" active={story.bookmarked} onClick={handleBookmark}>
              <Bookmark size={18} fill={story.bookmarked ? 'currentColor' : 'none'} />
            </IconButton>
          }
        />
      </div>

      <div className="px-5 pt-5">
        <h1 className="font-display text-2xl font-extrabold leading-tight text-lavender-50">
          {story.title}
        </h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {(story.themeIds || []).map((id) => (
            <span
              key={id}
              className="rounded-full border border-night-500 px-3 py-1 text-xs font-semibold text-lavender-200/80"
            >
              {THEMES_BY_ID[id]?.label || id}
            </span>
          ))}
          {story.duration && (
            <span className="flex items-center gap-1 rounded-full bg-night-700/70 px-3 py-1 text-xs font-semibold text-lavender-200/80">
              <Clock size={12} /> {formatDuration(story.duration)}
            </span>
          )}
        </div>

        {story.episodeNumber > 1 && (
          <p className="mt-3 text-xs font-bold uppercase tracking-wide text-lavender-300/80">
            Episode {story.episodeNumber}
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-lavender-100/85">{story.episodeSummary}</p>

        <Button className="mt-8 w-full" onClick={() => navigate(`/story/${story.id}/play`)}>
          Start
        </Button>
      </div>
    </div>
  );
}
