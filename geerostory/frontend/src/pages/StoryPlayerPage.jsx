import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Pause, RotateCcw, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import TopBar from '../components/ui/TopBar';
import AdventureCover from '../components/ui/AdventureCover';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Spinner from '../components/ui/Spinner';
import Geero from '../components/mascot/Geero';
import { formatTime } from '../lib/format';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ContinuePrompt({ story, navigate }) {
  return (
    <div className="mt-2 flex flex-col items-center gap-4 px-5 pb-2 text-center">
      <Geero pose="cheer" size={110} />
      <h2 className="font-display text-xl font-bold text-lavender-50">Continue the adventure?</h2>
      <div className="flex w-full flex-col gap-3">
        <Button
          className="w-full"
          onClick={() => navigate('/generating', { state: { continueStoryId: story.id } })}
        >
          Next Episode
        </Button>
        <Button variant="secondary" className="w-full" onClick={() => navigate('/app/home')}>
          New story
        </Button>
      </div>
    </div>
  );
}

export default function StoryPlayerPage() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { getIdToken } = useAuth();
  const { stories, upsertStory } = useAppData();

  const cached = stories.find((s) => s.id === storyId);
  const [story, setStory] = useState(cached || null);
  const [loading, setLoading] = useState(!cached);

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
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storyId]);

  const { isPlaying, currentTime, duration, ended, togglePlay, seek, skip } = useAudioPlayer(
    story?.audioUrl,
  );

  if (loading || !story) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner size={32} />
      </div>
    );
  }

  const pages = story.pages?.length ? story.pages : [story.text];
  const totalDuration = duration || story.duration || 0;
  const progress = totalDuration > 0 ? Math.min(1, currentTime / totalDuration) : 0;

  const pageIndex =
    pages.length > 1 ? Math.min(pages.length - 1, Math.floor(progress * pages.length)) : 0;
  const currentPageText = pages[pageIndex] || '';
  const words = currentPageText.split(/\s+/).filter(Boolean);

  let pageProgress = progress;
  if (pages.length > 1) {
    const pageStart = pageIndex / pages.length;
    const pageSpan = 1 / pages.length;
    pageProgress = Math.min(1, Math.max(0, (progress - pageStart) / pageSpan));
  }
  const highlightIndex = Math.floor(pageProgress * words.length);

  const goToPage = (index) => {
    const clamped = Math.min(pages.length - 1, Math.max(0, index));
    const target = (clamped / pages.length) * totalDuration + 0.05;
    seek(target);
  };

  return (
    <div className="flex min-h-screen flex-col pb-6">
      <div className="relative aspect-[5/4] w-full shrink-0">
        <AdventureCover
          themeId={story.themeIds?.[0]}
          src={story.imageUrl}
          alt={story.title}
          className="rounded-b-3xl"
        />
        <TopBar transparent title={story.title} />
      </div>

      <div className="flex-1 px-5 pt-4">
        <p className="text-base leading-relaxed text-lavender-100/85">
          {words.map((word, i) => (
            <span
              key={i}
              className={
                i === highlightIndex && isPlaying
                  ? 'rounded bg-lavender-300/30 px-0.5 text-lavender-50'
                  : ''
              }
            >
              {word}{' '}
            </span>
          ))}
        </p>
      </div>

      {!ended ? (
        <div className="mt-4 px-5">
          <ProgressBar value={progress} onSeek={(ratio) => seek(ratio * totalDuration)} />
          <div className="mt-1.5 flex justify-between text-xs font-semibold text-lavender-200/55">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(totalDuration)}</span>
          </div>

          <div className="mt-5 flex items-center justify-center gap-6">
            <button
              type="button"
              aria-label="Rewind 10 seconds"
              onClick={() => skip(-10)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-night-700/70 text-lavender-100 transition hover:bg-night-600"
            >
              <RotateCcw size={22} />
            </button>
            <button
              type="button"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-lavender-300 text-night-900 shadow-[0_12px_30px_-12px_rgba(155,126,240,0.65)] transition hover:bg-lavender-200"
            >
              {isPlaying ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <button
              type="button"
              aria-label="Forward 10 seconds"
              onClick={() => skip(10)}
              className="flex h-12 w-12 items-center justify-center rounded-full bg-night-700/70 text-lavender-100 transition hover:bg-night-600"
            >
              <RotateCw size={22} />
            </button>
          </div>

          {pages.length > 1 && (
            <div className="mt-5 flex items-center justify-center gap-4 text-sm font-semibold text-lavender-200/70">
              <button
                type="button"
                aria-label="Previous page"
                onClick={() => goToPage(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="disabled:opacity-30"
              >
                <ChevronLeft size={18} />
              </button>
              <span>
                Page {pageIndex + 1} of {pages.length}
              </span>
              <button
                type="button"
                aria-label="Next page"
                onClick={() => goToPage(pageIndex + 1)}
                disabled={pageIndex === pages.length - 1}
                className="disabled:opacity-30"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <ContinuePrompt story={story} navigate={navigate} />
      )}
    </div>
  );
}
