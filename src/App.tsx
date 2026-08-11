import { Navigate, Route, Routes } from 'react-router-dom';
import { AuthLayout } from '@/layouts/AuthLayout';
import { Login } from '@/pages/Login';
import { Dashboard } from '@/pages/Dashboard';
import { TemplateSelection } from '@/pages/TemplateSelection';
import { ResumeEditor } from '@/pages/ResumeEditor';
import { AuthCallback } from '@/pages/AuthCallback';
import { ResetPassword } from '@/pages/ResetPassword';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';

function AuthRoute() {
  const { session, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-50">
        <span className="text-sm text-gray-400">Loading…</span>
      </div>
    );
  }
  if (session) return <Navigate to="/dashboard" replace />;
  return (
    <AuthLayout>
      <Login />
    </AuthLayout>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthRoute />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/templates" element={<ProtectedRoute><TemplateSelection /></ProtectedRoute>} />
      <Route path="/create-resume" element={<ProtectedRoute><TemplateSelection /></ProtectedRoute>} />
      <Route path="/builder" element={<ProtectedRoute><ResumeEditor /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
