import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Geero from '../components/mascot/Geero';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useAppData } from '../context/AppDataContext';
import { api } from '../services/api';
import { getAdventureTitle, getAdventurePrompt } from '../data/adventures';
import { STORY_LOADING_STEPS } from '../data/constants';

export default function StoryGeneratingPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { getIdToken } = useAuth();
  const { child, upsertStory, refreshAccount } = useAppData();
  const [stepIndex, setStepIndex] = useState(0);
  const [error, setError] = useState('');
  const startedRef = useRef(false);

  const adventure = location.state?.adventure;
  const continueStoryId = location.state?.continueStoryId;
  const childName = child?.name || 'your child';
  const steps = STORY_LOADING_STEPS(childName);

  useEffect(() => {
    const interval = setInterval(() => {
      setStepIndex((i) => (i + 1) % steps.length);
    }, 2200);
    return () => clearInterval(interval);
  }, [steps.length]);

  useEffect(() => {
    if (startedRef.current) return;
    if (!adventure && !continueStoryId) {
      navigate('/app/home', { replace: true });
      return;
    }
    startedRef.current = true;

    (async () => {
      try {
        const token = await getIdToken();
        let story;
        if (continueStoryId) {
          story = await api.continueStory(token, continueStoryId);
        } else {
          story = await api.generateStory(token, {
            adventureId: adventure.id,
            themeIds: adventure.themeIds,
            title: getAdventureTitle(adventure, childName),
            promptSeed: getAdventurePrompt(adventure, childName),
          });
        }
        upsertStory(story);
        refreshAccount().catch(() => {});
        navigate(`/story/${story.id}`, { replace: true });
      } catch (err) {
        if (err.status === 402) {
          navigate('/paywall', { replace: true });
          return;
        }
        setError(err.message || 'Something went wrong while writing this story.');
      }
    })();
  }, [adventure, continueStoryId, childName, navigate, getIdToken, upsertStory, refreshAccount]);

  if (error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-5 px-6 text-center">
        <Geero pose="sad" size={130} />
        <p className="text-base font-semibold text-lavender-50">{error}</p>
        <Button variant="secondary" onClick={() => navigate('/app/home', { replace: true })}>
          Back to Home
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="animate-bounce">
        <Geero pose="book" size={150} />
      </div>
      <Spinner size={28} />
      <p
        key={stepIndex}
        className="font-display text-lg font-bold text-lavender-50 [animation:fadeIn_0.4s_ease-out]"
      >
        {steps[stepIndex]}
      </p>
    </div>
  );
}
