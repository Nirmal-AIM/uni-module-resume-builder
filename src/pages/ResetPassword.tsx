import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, Eye, EyeOff, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { updateUserPassword } from '@/services/authService';

export function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    const res = await updateUserPassword(password);
    setLoading(false);

    if (!res.success) {
      setError(res.error);
      return;
    }

    setSuccessMsg('Your password has been updated successfully! Redirecting to dashboard...');
    setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#051C36] p-4">
      <div className="w-full max-w-[440px] rounded-[32px] border border-white/10 bg-white p-8 shadow-2xl">
        <header className="flex flex-col items-center gap-3 text-center mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-[#fc4a27]">
            <LockKeyhole className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Set New Password</h1>
            <p className="mt-1 text-xs text-gray-500">
              Enter your new password below to secure your account.
            </p>
          </div>
        </header>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            {successMsg}
          </div>
        )}

        {!successMsg && (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="flex flex-col gap-1 text-xs font-bold text-gray-700">
              New Password
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
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

            <label className="flex flex-col gap-1 text-xs font-bold text-gray-700">
              Confirm New Password
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={loading}
              />
            </label>

            <Button type="submit" disabled={loading} className="mt-2">
              {loading ? 'Updating password...' : <>Update Password <ArrowRight className="ml-1.5 h-4 w-4" /></>}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
