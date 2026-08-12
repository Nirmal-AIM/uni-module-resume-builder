import { ArrowLeft, ArrowRight, LockKeyhole, Eye, EyeOff, CheckCircle2, User, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { SocialButton } from './SocialButton';
import {
  signInWithPassword,
  signUpWithPassword,
  sendForgotPasswordReset,
  signInWithGoogle,
} from '@/services/authService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AuthCard({ initialMode = 'login' }: { initialMode?: 'login' | 'signup' }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);

  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status states
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const resetForm = (newMode: 'login' | 'signup' | 'forgot') => {
    setError('');
    setSuccessMsg('');
    setLoading(false);
    setMode(newMode);
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (!password) {
      setError('Please enter your password');
      return;
    }
    setError('');
    setLoading(true);
    const res = await signInWithPassword(email, password);
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Please enter your full name');
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    setLoading(true);
    const res = await signUpWithPassword(email, password, fullName.trim());
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    if (res.sessionPresent) {
      setSuccessMsg('Account created successfully! Redirecting to Dashboard...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 500);
    } else if (res.requiresConfirmation) {
      setSuccessMsg('Account created! Please check your email inbox to confirm your account (or turn OFF "Confirm email" in Supabase Auth settings to log in instantly).');
    } else {
      setSuccessMsg('Account created successfully! Logging you in...');
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    }
  };

  const handleForgotPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Please enter your email address');
      return;
    }
    setError('');
    setLoading(true);
    const res = await sendForgotPasswordReset(email);
    setLoading(false);
    if (!res.success) {
      setError(res.error);
      return;
    }
    setSuccessMsg(`Password reset link sent to ${email}. Check your inbox!`);
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    const result = await signInWithGoogle();
    if (!result.success) {
      setGoogleLoading(false);
      setError(result.error);
    }
  };

  return (
    <div className="w-full max-w-[480px] rounded-[32px] border border-gray-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,.04),0_1px_2px_rgba(0,0,0,.03)]">
      <div className="flex flex-col gap-4 px-6 pb-6 pt-7 sm:px-12">
        {/* Brand Logo Header */}
        <header className="flex flex-col items-center gap-3">
          <img
            src="/logo-icon.svg"
            alt="ResUme NoW"
            className="h-12 w-12"
            aria-hidden="true"
          />
          <div className="text-center">
            <h1 className="text-[22px] font-bold leading-tight text-gray-900">
              {mode === 'login' && 'Welcome Back!'}
              {mode === 'signup' && 'Create an Account'}
              {mode === 'forgot' && 'Reset Your Password'}
            </h1>
            <p className="mt-1 text-xs text-gray-500">
              {mode === 'login' && 'Sign in to access your resumes'}
              {mode === 'signup' && 'Start building professional resumes today'}
              {mode === 'forgot' && 'We will send a password reset link to your email'}
            </p>
          </div>
        </header>

        {/* Global Messages */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}
        {successMsg && (
          <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
            {successMsg}
          </div>
        )}

        {/* ── 1. LOGIN FORM ────────────────────────────────────────── */}
        {mode === 'login' && (
          <>
            <form className="flex flex-col gap-3.5" onSubmit={handleLogin} noValidate>
              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="email">
                Email Address
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="password">
                <div className="flex items-center justify-between">
                  <span>Password</span>
                  <button
                    type="button"
                    onClick={() => resetForm('forgot')}
                    className="text-xs font-medium text-[#fc4a27] hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? 'Signing in...' : <>Sign In <ArrowRight className="ml-1.5 h-4 w-4" /></>}
              </Button>
            </form>

            <div className="flex items-center gap-4 py-1" aria-label="or continue with another method">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google OAuth (Preserved 100%) */}
            <SocialButton provider="Google" onClick={handleGoogle} disabled={googleLoading} />

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => resetForm('signup')}
                  className="font-bold text-[#fc4a27] hover:underline"
                >
                  Sign up
                </button>
              </p>
            </div>
          </>
        )}

        {/* ── 2. SIGNUP FORM ───────────────────────────────────────── */}
        {mode === 'signup' && (
          <>
            <form className="flex flex-col gap-3.5" onSubmit={handleSignup} noValidate>
              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="fullName">
                Full Name
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="email">
                Email Address
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </label>

              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="password">
                Password
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    placeholder="At least 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </label>

              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? 'Creating account...' : <>Create Account <ArrowRight className="ml-1.5 h-4 w-4" /></>}
              </Button>
            </form>

            <div className="flex items-center gap-4 py-1" aria-label="or continue with another method">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400 font-medium">OR</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>

            {/* Google OAuth (Preserved 100%) */}
            <SocialButton provider="Google" onClick={handleGoogle} disabled={googleLoading} />

            <div className="text-center pt-2 border-t border-gray-100">
              <p className="text-xs text-gray-600">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => resetForm('login')}
                  className="font-bold text-[#fc4a27] hover:underline"
                >
                  Sign in
                </button>
              </p>
            </div>
          </>
        )}

        {/* ── 3. FORGOT PASSWORD FORM ──────────────────────────────── */}
        {mode === 'forgot' && (
          <>
            <form className="flex flex-col gap-3.5" onSubmit={handleForgotPassword} noValidate>
              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="email">
                Email Address
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
              </label>

              <Button type="submit" disabled={loading} className="mt-1">
                {loading ? 'Sending link...' : <>Send Reset Link <Mail className="ml-1.5 h-4 w-4" /></>}
              </Button>
            </form>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => resetForm('login')}
                className="flex items-center justify-center gap-1.5 text-xs font-bold text-gray-600 hover:text-gray-900 mx-auto"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign in
              </button>
            </div>
          </>
        )}

        {/* Secure Footer Badge */}
        <p className="flex items-center justify-center gap-2 pt-2 text-xs font-medium text-emerald-500">
          <LockKeyhole className="h-3.5 w-3.5" /> Your data is secure and encrypted
        </p>

        {/* Developer Credit */}
        <p className="text-center pt-2 text-xs font-semibold text-gray-500">
          Built &amp; Developed by <span className="font-extrabold text-[#fc4a27]">Nirmal Kollipara</span>
        </p>
      </div>
    </div>
  );
}
