import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, MessageCircle, Info, Star, Share2, LogOut, Moon } from 'lucide-react';
import Geero from '../components/mascot/Geero';
import SpeechBubble from '../components/ui/SpeechBubble';
import ToggleSwitch from '../components/ui/ToggleSwitch';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function SettingsRow({ label, icon: Icon, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center justify-between border-b border-night-700 py-4 text-left last:border-none"
    >
      <span className="flex items-center gap-3 text-sm font-semibold text-lavender-50">
        {Icon && <Icon size={18} className="text-lavender-200/60" />}
        {label}
      </span>
      <ChevronRight size={18} className="text-lavender-200/40" />
    </button>
  );
}

const ABOUT_TEXT =
  "Geero helps families turn bedtime into an adventure. Every story is written fresh for your child, narrated aloud, and illustrated with a cozy, imaginative scene — so the night ends with a smile.";

export default function SettingsPage() {
  const navigate = useNavigate();
  const { nightMode, setNightMode } = useTheme();
  const { signOutUser, getIdToken } = useAuth();
  const [modal, setModal] = useState(null); // 'about' | 'feedback' | 'rate' | 'exit' | null
  const [feedback, setFeedback] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('idle'); // idle | sending | sent | error
  const [shareMessage, setShareMessage] = useState('');

  const closeModal = () => setModal(null);

  const handleExit = async () => {
    await signOutUser();
    navigate('/welcome', { replace: true });
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Geero — Bedtime Stories',
      text: 'Geero writes personalized bedtime stories for kids. Check it out!',
      url: window.location.origin,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareData.url);
        setShareMessage('Link copied to clipboard!');
        setTimeout(() => setShareMessage(''), 2500);
      }
    } catch {
      // user cancelled share — no action needed
    }
  };

  const handleSendFeedback = async (e) => {
    e.preventDefault();
    if (!feedback.trim()) return;
    setFeedbackStatus('sending');
    try {
      const token = await getIdToken();
      await api.submitFeedback(token, feedback.trim());
      setFeedbackStatus('sent');
      setFeedback('');
    } catch {
      setFeedbackStatus('error');
    }
  };

  return (
    <div className="px-5 pb-4 pt-6">
      <h1 className="font-display text-2xl font-extrabold text-lavender-50">Settings</h1>

      <div className="mt-5 flex items-start gap-3">
        <Geero pose="thinking" size={92} />
        <SpeechBubble className="mt-2 flex-1">What do you want to change?</SpeechBubble>
      </div>

      <div className="mt-6 flex items-center justify-between border-b border-night-700 py-4">
        <span className="flex items-center gap-3 text-sm font-semibold text-lavender-50">
          <Moon size={18} className="text-lavender-200/60" />
          Night Mode
        </span>
        <ToggleSwitch checked={nightMode} onChange={setNightMode} label="Night mode" />
      </div>

      <SettingsRow label="Feedback / Support" icon={MessageCircle} onClick={() => setModal('feedback')} />
      <SettingsRow label="About Us" icon={Info} onClick={() => setModal('about')} />
      <SettingsRow label="Rate App" icon={Star} onClick={() => setModal('rate')} />
      <SettingsRow label="Share App" icon={Share2} onClick={handleShare} />
      <SettingsRow label="Exit Account" icon={LogOut} onClick={() => setModal('exit')} />

      {shareMessage && (
        <p className="mt-3 text-center text-sm font-semibold text-lavender-300">{shareMessage}</p>
      )}

      <Modal open={modal === 'about'} onClose={closeModal}>
        <div className="flex flex-col items-center gap-4 text-center">
          <Geero pose="wave" size={100} />
          <h2 className="font-display text-xl font-bold text-lavender-50">About Geero</h2>
          <p className="text-sm leading-relaxed text-lavender-200/75">{ABOUT_TEXT}</p>
          <Button className="w-full" onClick={closeModal}>
            Got it
          </Button>
        </div>
      </Modal>

      <Modal open={modal === 'rate'} onClose={closeModal}>
        <div className="flex flex-col items-center gap-4 text-center">
          <Geero pose="cheer" size={100} />
          <h2 className="font-display text-xl font-bold text-lavender-50">Enjoying Geero?</h2>
          <p className="text-sm leading-relaxed text-lavender-200/75">
            Ratings help other families discover bedtime adventures too. Thanks so much for the
            support!
          </p>
          <Button className="w-full" onClick={closeModal}>
            Maybe later
          </Button>
        </div>
      </Modal>

      <Modal open={modal === 'feedback'} onClose={closeModal}>
        {feedbackStatus === 'sent' ? (
          <div className="flex flex-col items-center gap-4 text-center">
            <Geero pose="cheer" size={100} />
            <h2 className="font-display text-xl font-bold text-lavender-50">Thank you!</h2>
            <p className="text-sm leading-relaxed text-lavender-200/75">
              Your message has been sent to our team.
            </p>
            <Button
              className="w-full"
              onClick={() => {
                setFeedbackStatus('idle');
                closeModal();
              }}
            >
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSendFeedback} className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 text-center">
              <Geero pose="thinking" size={92} />
              <h2 className="font-display text-xl font-bold text-lavender-50">
                Feedback &amp; Support
              </h2>
              <p className="text-sm text-lavender-200/70">
                Tell us what's working, what's not, or what you'd love to see next.
              </p>
            </div>
            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
              required
              placeholder="Type your message..."
              className="w-full rounded-xl border border-night-500 bg-night-800/80 px-4 py-3 text-sm text-lavender-50 placeholder:text-lavender-200/35 focus:border-lavender-300 focus:outline-none focus:ring-2 focus:ring-lavender-300/30"
            />
            {feedbackStatus === 'error' && (
              <p className="text-sm text-rose-300">Couldn't send your message. Please try again.</p>
            )}
            <Button type="submit" disabled={feedbackStatus === 'sending'} className="w-full">
              Send
            </Button>
          </form>
        )}
      </Modal>

      <Modal open={modal === 'exit'} onClose={closeModal}>
        <div className="flex flex-col items-center gap-4 text-center">
          <Geero pose="sad" size={110} />
          <h2 className="font-display text-xl font-bold text-lavender-50">Do you want to exit?</h2>
          <p className="text-sm leading-relaxed text-lavender-200/70">
            You can always sign back in to continue your child's adventures.
          </p>
          <div className="flex w-full gap-3">
            <Button variant="secondary" className="flex-1" onClick={closeModal}>
              Cancel
            </Button>
            <Button variant="danger" className="flex-1" onClick={handleExit}>
              Exit
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
