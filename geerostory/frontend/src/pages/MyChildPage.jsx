import { useState, useEffect } from 'react';
import Geero from '../components/mascot/Geero';
import SpeechBubble from '../components/ui/SpeechBubble';
import ChildForm from '../components/forms/ChildForm';
import { useAppData } from '../context/AppDataContext';

export default function MyChildPage() {
  const { child, saveChild } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timer = setTimeout(() => setSaved(false), 2500);
    return () => clearTimeout(timer);
  }, [saved]);

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await saveChild(values);
      setSaved(true);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 pb-6 pt-8">
      <h1 className="font-display text-2xl font-extrabold text-lavender-50">My Child</h1>

      <div className="mt-5 flex items-start gap-3">
        <Geero pose="wave" size={92} />
        <SpeechBubble className="mt-2 flex-1">
          Want to update your child's details? Just make your changes below.
        </SpeechBubble>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <ChildForm
          key={child?.id || 'loading'}
          initialValues={child}
          onSubmit={handleSubmit}
          submitLabel="Save Changes"
          loading={loading}
          error={error}
        />
        {saved && (
          <p className="mt-3 text-center text-sm font-semibold text-lavender-300">
            Saved! Geero will use these details for new stories.
          </p>
        )}
      </div>
    </div>
  );
}
