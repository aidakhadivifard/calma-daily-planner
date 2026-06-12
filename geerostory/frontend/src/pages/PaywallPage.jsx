import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import TopBar from '../components/ui/TopBar';
import Geero from '../components/mascot/Geero';
import Button from '../components/ui/Button';
import { cn } from '../lib/cn';
import { useAppData } from '../context/AppDataContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const PLANS = [
  { id: 'monthly', label: 'Monthly', price: '$4.99', cadence: '/ month' },
  {
    id: 'yearly',
    label: 'Yearly',
    price: '$29.99',
    cadence: '/ year',
    badge: 'Best value',
    note: 'Just $2.50 / month',
  },
];

const PERKS = [
  'Unlimited personalized stories',
  'A new illustrated world every night',
  'Continue every adventure as a series',
];

export default function PaywallPage() {
  const navigate = useNavigate();
  const { child, refreshAccount } = useAppData();
  const { getIdToken, isMock } = useAuth();
  const [plan, setPlan] = useState('yearly');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const childName = child?.name || 'Your child';

  const handleSubscribe = async () => {
    setLoading(true);
    setError('');
    try {
      const token = await getIdToken();
      if (isMock) {
        await api.simulateSubscribe(token, plan);
        await refreshAccount();
        navigate('/app/home', { replace: true });
        return;
      }
      const result = await api.createCheckout(token, plan);
      if (result?.url) {
        window.location.href = result.url;
      } else {
        throw new Error('Could not start checkout. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col px-5 pb-6 pt-2">
      <TopBar />

      <div className="mt-1 flex flex-col items-center gap-4 text-center">
        <Geero pose="cheer" size={116} />
        <h1 className="font-display text-2xl font-extrabold leading-tight text-lavender-50">
          {childName} wants more adventures!
        </h1>
        <p className="text-sm leading-relaxed text-lavender-200/70">
          You've used all your free stories this month. Unlock unlimited bedtime adventures with
          Geero Plus.
        </p>
      </div>

      <div className="mt-7 flex flex-col gap-3">
        {PLANS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => setPlan(p.id)}
            className={cn(
              'relative flex items-center justify-between rounded-2xl border-2 px-5 py-4 text-left transition',
              plan === p.id ? 'border-lavender-300 bg-lavender-300/10' : 'border-night-600 bg-night-800/60',
            )}
          >
            {p.badge && (
              <span className="absolute -top-2.5 right-4 rounded-full bg-lavender-300 px-2.5 py-0.5 text-[11px] font-bold text-night-900">
                {p.badge}
              </span>
            )}
            <div>
              <p className="font-display text-base font-bold text-lavender-50">{p.label}</p>
              {p.note && <p className="mt-0.5 text-xs text-lavender-200/60">{p.note}</p>}
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="font-display text-lg font-extrabold text-lavender-50">{p.price}</p>
                <p className="text-xs text-lavender-200/55">{p.cadence}</p>
              </div>
              <div
                className={cn(
                  'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2',
                  plan === p.id
                    ? 'border-lavender-300 bg-lavender-300 text-night-900'
                    : 'border-night-500',
                )}
              >
                {plan === p.id && <Check size={14} strokeWidth={3} />}
              </div>
            </div>
          </button>
        ))}
      </div>

      <ul className="mt-6 flex flex-col gap-2.5">
        {PERKS.map((perk) => (
          <li key={perk} className="flex items-center gap-2.5 text-sm text-lavender-200/75">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lavender-300/15 text-lavender-300">
              <Check size={12} strokeWidth={3} />
            </span>
            {perk}
          </li>
        ))}
      </ul>

      {error && <p className="mt-4 text-center text-sm text-rose-300">{error}</p>}

      <div className="mt-auto pt-8">
        <Button className="w-full" size="lg" onClick={handleSubscribe} disabled={loading}>
          {loading ? 'Starting...' : `Start ${childName}'s journey`}
        </Button>
        <p className="mt-3 text-center text-xs text-lavender-200/50">
          Cancel anytime from Settings.
        </p>
      </div>
    </div>
  );
}
