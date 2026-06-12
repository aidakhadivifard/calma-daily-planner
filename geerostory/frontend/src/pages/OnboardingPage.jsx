import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Geero from '../components/mascot/Geero';
import SpeechBubble from '../components/ui/SpeechBubble';
import ChildForm from '../components/forms/ChildForm';
import { useAppData } from '../context/AppDataContext';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { saveChild } = useAppData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (values) => {
    setLoading(true);
    setError('');
    try {
      await saveChild(values);
      navigate('/app/home', { replace: true });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-8">
      <h1 className="font-display text-2xl font-extrabold text-lavender-50">My Child</h1>

      <div className="mt-5 flex items-start gap-3">
        <Geero pose="wave" size={92} />
        <SpeechBubble className="mt-2 flex-1">
          Please enter your child's information so I can craft stories just for them.
        </SpeechBubble>
      </div>

      <div className="mt-8 flex flex-1 flex-col">
        <ChildForm onSubmit={handleSubmit} submitLabel="Let's Start!" loading={loading} error={error} />
      </div>
    </div>
  );
}
