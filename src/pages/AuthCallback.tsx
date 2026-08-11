import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function AuthCallback() {
  const navigate = useNavigate();
  const { session, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash || '';
      const search = window.location.search || '';
      const isRecovery = hash.includes('type=recovery') || search.includes('type=recovery');

      if (isRecovery) {
        navigate('/reset-password', { replace: true });
      } else if (session) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    }
  }, [session, loading, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#051C36] border-t-transparent" />
        <p className="text-sm font-medium text-gray-600">Completing sign in…</p>
      </div>
    </div>
  );
}
