import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LibraryScene from '../components/mascot/LibraryScene';
import Button from '../components/ui/Button';
import TextField from '../components/ui/TextField';
import GoogleIcon from '../components/ui/GoogleIcon';

export default function WelcomePage() {
  const navigate = useNavigate();
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, sendPhoneVerification, isMock } =
    useAuth();

  const [mode, setMode] = useState('main'); // 'main' | 'email' | 'phone'
  const [authAction, setAuthAction] = useState('signin'); // 'signin' | 'signup'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  const goToApp = () => navigate('/', { replace: true });

  const handleGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithGoogle();
      goToApp();
    } catch (err) {
      setError(err.message || 'Could not sign in with Google.');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (authAction === 'signup') {
        await signUpWithEmail(email, password, name);
      } else {
        await signInWithEmail(email, password);
      }
      goToApp();
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (!confirmation) {
        const result = await sendPhoneVerification(phone, 'recaptcha-container');
        setConfirmation(result);
      } else {
        await confirmation.confirm(code);
        goToApp();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const backToMain = () => {
    setMode('main');
    setError('');
    setConfirmation(null);
    setCode('');
  };

  return (
    <div className="flex min-h-screen flex-col px-6 pb-10 pt-8">
      <LibraryScene pose="balloons" className="aspect-[5/4]" geeroSize={132} />

      <div className="mt-7 text-center">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-lavender-50">
          Geero
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-lavender-200/70">
          Personalized bedtime adventures, narrated just for your child.
        </p>
      </div>

      <div className="mt-8 flex flex-1 flex-col gap-3">
        {mode === 'main' && (
          <>
            <Button onClick={handleGoogle} disabled={loading} className="w-full">
              <GoogleIcon size={20} />
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 py-1">
              <span className="h-px flex-1 bg-night-600" />
              <span className="text-xs font-semibold uppercase tracking-wide text-lavender-200/40">
                or
              </span>
              <span className="h-px flex-1 bg-night-600" />
            </div>

            <Button variant="secondary" className="w-full" onClick={() => setMode('email')}>
              <Mail size={18} />
              Continue with Email
            </Button>
            <Button variant="secondary" className="w-full" onClick={() => setMode('phone')}>
              <Phone size={18} />
              Continue with Phone
            </Button>
          </>
        )}

        {mode === 'email' && (
          <form onSubmit={handleEmailSubmit} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={backToMain}
              className="mb-1 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-lavender-200/60 hover:text-lavender-200"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {authAction === 'signup' && (
              <TextField
                label="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jamie Lee"
                required
              />
            )}
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              minLength={6}
              required
            />
            <Button type="submit" disabled={loading} className="mt-1 w-full">
              {authAction === 'signup' ? 'Create account' : 'Sign in'}
            </Button>
            <button
              type="button"
              onClick={() => setAuthAction(authAction === 'signup' ? 'signin' : 'signup')}
              className="text-center text-sm font-semibold text-lavender-300"
            >
              {authAction === 'signup'
                ? 'Already have an account? Sign in'
                : 'New here? Create an account'}
            </button>
          </form>
        )}

        {mode === 'phone' && (
          <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-3">
            <button
              type="button"
              onClick={backToMain}
              className="mb-1 inline-flex items-center gap-1.5 self-start text-sm font-semibold text-lavender-200/60 hover:text-lavender-200"
            >
              <ArrowLeft size={16} /> Back
            </button>
            {!confirmation ? (
              <TextField
                label="Phone number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555 123 4567"
                required
              />
            ) : (
              <TextField
                label="Verification code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="123456"
                maxLength={6}
                required
                hint={isMock ? 'Demo mode: enter any 6 digits to continue.' : undefined}
              />
            )}
            <Button type="submit" disabled={loading} className="w-full">
              {confirmation ? 'Verify & continue' : 'Send code'}
            </Button>
          </form>
        )}

        {error && <p className="text-center text-sm text-rose-300">{error}</p>}

        {isMock && mode === 'main' && (
          <p className="mt-2 text-center text-xs text-lavender-200/35">
            Demo mode — sign-in is simulated locally, no account needed.
          </p>
        )}
      </div>

      <div id="recaptcha-container" />
    </div>
  );
}
