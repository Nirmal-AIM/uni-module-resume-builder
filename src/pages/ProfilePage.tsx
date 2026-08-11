import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  LayoutTemplate,
  Sparkles,
  Mail,
  TrendingUp,
  Briefcase,
  User,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  LogOut,
  Bell,
  CheckCircle2,
  Shield,
  Key,
} from 'lucide-react';
import { updateUserPassword } from '@/services/authService';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, path: '/templates' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, path: '/dashboard?ai=open' },
  { id: 'cover-letters', label: 'Cover Letters', icon: Mail, path: '/cover-letters' },
  { id: 'resume-analytics', label: 'Resume Analytics', icon: TrendingUp, path: '/resume-analytics' },
  { id: 'job-tracker', label: 'Job Tracker', icon: Briefcase, path: '/job-tracker' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'help-support', label: 'Help & Support', icon: HelpCircle, path: '/help-support' },
];

import { useAIAssistant } from '@/context/AIAssistantContext';

export function ProfilePage() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { openAIAssistant } = useAIAssistant();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const [newPass, setNewPass] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');
  const [passLoading, setPassLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass.length < 6) {
      setPassError('Password must be at least 6 characters');
      return;
    }
    setPassError('');
    setPassLoading(true);
    const res = await updateUserPassword(newPass);
    setPassLoading(false);
    if (!res.success) {
      setPassError(res.error);
    } else {
      setPassMsg('Password updated successfully!');
      setNewPass('');
      setTimeout(() => setPassMsg(''), 3000);
    }
  };

  const fullName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = fullName.charAt(0).toUpperCase();

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Sidebar */}
      <aside className="flex w-[230px] shrink-0 flex-col bg-[#051C36] text-white">
        <div className="px-6 pt-6 pb-6 border-b border-white/10">
          <img src="/logo-dark-banner.svg" alt="ResUme NoW" className="w-full h-auto" />
        </div>
        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === 'profile';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  if (item.id === 'ai-assistant') {
                    openAIAssistant();
                    return;
                  }
                  if (item.path && item.path !== '#') {
                    navigate(item.path);
                  }
                }}
                className={`flex items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#153459] text-white shadow-sm font-semibold'
                    : 'text-[#8ca0b8] hover:bg-[#0d2d52] hover:text-white'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-white' : 'text-[#8ca0b8]'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#0d2d52]"
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fc4a27] text-xs font-bold text-white">
              {initial}
            </div>
            <div className="flex min-w-0 flex-1 flex-col text-left">
              <span className="truncate text-xs font-semibold text-white">{fullName}</span>
              <span className="truncate text-[10px] text-[#8ca0b8]">{user?.email}</span>
            </div>
            {userMenuOpen ? <ChevronUp className="h-3.5 w-3.5 text-[#8ca0b8]" /> : <ChevronDown className="h-3.5 w-3.5 text-[#8ca0b8]" />}
          </button>
          {userMenuOpen && (
            <div className="mt-2.5 rounded-xl border border-white/10 bg-[#0d2d52] py-1 shadow-lg">
              <button
                type="button"
                onClick={() => logout()}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-[#ff6b52] font-semibold hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" /> Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200/80 bg-white px-8 shrink-0">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-[#fc4a27]" />
            <h1 className="text-base font-bold text-gray-900">User Profile & Account Settings</h1>
          </div>
          <Bell className="h-4.5 w-4.5 text-gray-500 cursor-pointer" />
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-4xl">
          {/* User Hero Badge */}
          <div className="flex items-center gap-6 p-6 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#051C36] text-2xl font-bold text-white border-4 border-orange-100">
              {initial}
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-extrabold text-gray-900">{fullName}</h2>
              <p className="text-xs text-gray-500">{user?.email}</p>
              <div className="pt-1 flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px] uppercase border border-emerald-200 flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Verified Account
                </span>
                <span className="px-2.5 py-0.5 rounded-md bg-orange-50 text-[#fc4a27] font-bold text-[10px] uppercase border border-orange-200">
                  Single User Record (1:1 Active)
                </span>
              </div>
            </div>
          </div>

          {/* Account Details Form */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <User className="h-4 w-4 text-[#fc4a27]" /> Personal Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-700">Full Name</label>
                <input
                  type="text"
                  disabled
                  value={fullName}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1 text-gray-700"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ''}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1 text-gray-700"
                />
              </div>
            </div>
          </div>

          {/* Security & Password Update */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
              <Key className="h-4 w-4 text-[#fc4a27]" /> Change Account Password
            </h3>

            {passError && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-xs text-red-600 font-medium">
                {passError}
              </div>
            )}

            {passMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 font-medium flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> {passMsg}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-3 max-w-md">
              <div>
                <label className="text-xs font-bold text-gray-700">New Password</label>
                <input
                  type="password"
                  value={newPass}
                  onChange={(e) => setNewPass(e.target.value)}
                  placeholder="Enter new password..."
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={passLoading || !newPass}
                className="px-5 py-2.5 bg-[#fc4a27] hover:bg-[#e0401f] text-white font-bold rounded-xl text-xs shadow-sm transition disabled:opacity-50"
              >
                {passLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
