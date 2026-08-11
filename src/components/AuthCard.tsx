import { ArrowLeft, ArrowRight, LockKeyhole } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { Input } from './Input';
import { SocialButton } from './SocialButton';
import { sendEmailOtp, verifyEmailOtp, resendEmailOtp, signInWithGoogle } from '@/services/authService';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COOLDOWN_SECONDS = 30;

export function AuthCard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submittedEmail, setSubmittedEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'email' | 'code'>('email');
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (cooldown <= 0) {
      if (timerRef.current) window.clearInterval(timerRef.current);
      return;
    }
    timerRef.current = window.setInterval(() => setCooldown((c) => c - 1), 1000);
    return () => {
      if (timerRef.current) window.clearInterval(timerRef.current);
    };
  }, [cooldown]);

  const startCooldown = () => setCooldown(COOLDOWN_SECONDS);

  const submitEmail = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!EMAIL_RE.test(email)) {
      setError('Enter a valid email address');
      return;
    }
    setError('');
    setSending(true);
    const result = await sendEmailOtp(email);
    setSending(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setSubmittedEmail(email);
    setStep('code');
    startCooldown();
  };

  const submitCode = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (code.length !== 6) {
      setError('Enter the 6-digit code');
      return;
    }
    setError('');
    setVerifying(true);
    const result = await verifyEmailOtp(submittedEmail, code);
    setVerifying(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    navigate('/dashboard', { replace: true });
  };

  const handleResend = async () => {
    if (cooldown > 0 || resending) return;
    setError('');
    setResending(true);
    const result = await resendEmailOtp(submittedEmail);
    setResending(false);
    if (!result.success) {
      setError(result.error);
      return;
    }
    setCode('');
    startCooldown();
  };

  const handleChangeEmail = () => {
    setError('');
    setCode('');
    setStep('email');
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
        {step === 'email' ? (
          <>
            <header className="flex flex-col items-center gap-3">
              <img
                src="/logo-icon.svg"
                alt="ResUme NoW"
                className="h-12 w-12"
                aria-hidden="true"
              />
              <div className="text-center">
                <h1 className="text-[22px] font-bold leading-tight text-gray-900">Welcome Back!</h1>
                <p className="mt-2 text-sm text-gray-500">Sign in to your account</p>
              </div>
            </header>
            <form className="flex flex-col gap-4" onSubmit={submitEmail} noValidate>
              <label className="flex flex-col gap-1 text-[12px] font-bold text-gray-700" htmlFor="email">
                Email Address
                <Input id="email" type="email" autoComplete="email" placeholder="name@company.com" value={email} onChange={(event) => setEmail(event.target.value)} aria-invalid={Boolean(error)} disabled={sending} />
              </label>
              {error && <p className="-mt-2 text-xs text-red-500">{error}</p>}
              <Button type="submit" disabled={sending}>
                {sending ? 'Sending code…' : <>Continue with Email <ArrowRight className="ml-1 h-4 w-4" /></>}
              </Button>
            </form>
            <div className="flex items-center gap-4" aria-label="or continue with another method">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-xs text-gray-400">OR</span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <nav className="flex flex-col gap-3 pt-2" aria-label="Social sign-in options">
              <SocialButton provider="Google" onClick={handleGoogle} disabled={googleLoading} />
            </nav>
          </>
        ) : (
          <>
            <header className="flex flex-col items-center gap-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                <LockKeyhole className="h-6 w-6" />
              </div>
              <div className="text-center">
                <h1 className="text-[28px] font-bold leading-tight text-gray-900">Check your email</h1>
                <p className="mt-2 text-sm leading-5 text-gray-500">
                  We sent a 6-digit verification code to<br />
                  <strong className="font-medium text-gray-700">{submittedEmail}</strong>
                </p>
              </div>
            </header>
            <form className="flex flex-col gap-4" onSubmit={submitCode}>
              <label className="flex flex-col gap-1.5 text-[13px] font-bold text-gray-700" htmlFor="code">
                Verification Code
                <input id="code" inputMode="numeric" maxLength={6} placeholder="000000" value={code} onChange={(event) => setCode(event.target.value.replace(/\D/g, ''))} className="h-12 w-full rounded-2xl border border-gray-200 px-4 text-center text-lg tracking-[.35em] outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100" disabled={verifying} />
              </label>
              {error && <p className="-mt-2 text-xs text-red-500">{error}</p>}
              <Button type="submit" disabled={verifying}>
                {verifying ? 'Verifying…' : <>Verify Email <ArrowRight className="ml-1 h-4 w-4" /></>}
              </Button>
            </form>
            <div className="flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={handleResend}
                disabled={cooldown > 0 || resending}
                className="text-xs font-medium text-gray-500 transition hover:text-gray-800 disabled:cursor-not-allowed disabled:text-gray-300"
              >
                {resending ? 'Sending…' : cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend code'}
              </button>
              <button type="button" className="flex items-center gap-2 text-xs font-medium text-gray-500 hover:text-gray-800" onClick={handleChangeEmail}>
                <ArrowLeft className="h-3.5 w-3.5" />Use a different email
              </button>
            </div>
          </>
        )}
        <p className="flex items-center justify-center gap-2 pt-3 text-xs font-medium text-emerald-500">
          <LockKeyhole className="h-3.5 w-3.5" />Your data is secure and encrypted
        </p>
      </div>
    </div>
  );
}
