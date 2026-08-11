import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    );
  }
  if (!session) return <Navigate to="/" replace />;
  return <>{children}</>;
}
