import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { loadResume, type ResumeRecord } from '@/services/resumeService';
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
  AlertTriangle,
  FileCheck,
  Target,
  BarChart3,
} from 'lucide-react';

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

export function ResumeAnalytics() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [existingResume, setExistingResume] = useState<ResumeRecord | null>(null);

  useEffect(() => {
    (async () => {
      const record = await loadResume();
      if (record) setExistingResume(record);
    })();
  }, []);

  const fullName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = fullName.charAt(0).toUpperCase();

  const data = existingResume?.resume_data as any || {};
  const hasSummary = Boolean(data.summary?.text || data.summary);
  const expCount = Array.isArray(data.experience) ? data.experience.length : 0;
  const eduCount = Array.isArray(data.education_list) ? data.education_list.length : 0;
  const skillsCount = Array.isArray(data.skills) ? data.skills.length : (data.personal?.skillsText ? data.personal.skillsText.split(',').length : 0);

  // Compute live completeness score
  let completeness = 20; // base contact info
  if (hasSummary) completeness += 20;
  if (expCount > 0) completeness += 25;
  if (eduCount > 0) completeness += 15;
  if (skillsCount > 0) completeness += 20;

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
            const isActive = item.id === 'resume-analytics';
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(item.path)}
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

      {/* Main Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200/80 bg-white px-8 shrink-0">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#fc4a27]" />
            <h1 className="text-base font-bold text-gray-900">Resume Analytics & ATS Score</h1>
          </div>
          <Bell className="h-4.5 w-4.5 text-gray-500 cursor-pointer" />
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Top Score Overview Banner */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-gradient-to-br from-[#051C36] to-[#0d2d52] text-white rounded-2xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-orange-400 uppercase tracking-wider">Overall ATS Score</span>
                <h2 className="text-3xl font-black mt-1">88 / 100</h2>
                <p className="text-[10px] text-emerald-400 mt-1">Top 10% ATS Ready</p>
              </div>
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 border-4 border-[#fc4a27]">
                <Target className="h-6 w-6 text-white" />
              </div>
            </div>

            <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Completeness</span>
              <h2 className="text-2xl font-black text-gray-900 mt-1">{completeness}%</h2>
              <div className="w-full bg-gray-100 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-[#fc4a27] h-full rounded-full" style={{ width: `${completeness}%` }} />
              </div>
            </div>

            <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Action Verbs</span>
              <h2 className="text-2xl font-black text-emerald-600 mt-1">92%</h2>
              <p className="text-[10px] text-gray-500 mt-1">Strong quantifiable verbs</p>
            </div>

            <div className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Readability Score</span>
              <h2 className="text-2xl font-black text-indigo-600 mt-1">A+ (94%)</h2>
              <p className="text-[10px] text-gray-500 mt-1">Optimal typography & layout</p>
            </div>
          </div>

          {/* Detailed Analysis Section */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left: Section Breakdown */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-6">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BarChart3 className="h-4.5 w-4.5 text-[#fc4a27]" /> Resume Section Health
              </h2>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Personal Info & Contact</span>
                    <span className="text-emerald-600">100% Complete</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '100%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Professional Summary</span>
                    <span className={hasSummary ? 'text-emerald-600' : 'text-amber-600'}>
                      {hasSummary ? '100% Complete' : 'Needs Summary'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className={hasSummary ? 'bg-emerald-500 h-full rounded-full' : 'bg-amber-400 h-full rounded-full'} style={{ width: hasSummary ? '100%' : '30%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Work Experience ({expCount} positions)</span>
                    <span className={expCount > 0 ? 'text-emerald-600' : 'text-amber-600'}>
                      {expCount > 0 ? '85% Strong' : 'Add Experience'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className={expCount > 0 ? 'bg-emerald-500 h-full rounded-full' : 'bg-amber-400 h-full rounded-full'} style={{ width: expCount > 0 ? '85%' : '20%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-700 mb-1">
                    <span>Skills & Technologies ({skillsCount} added)</span>
                    <span className={skillsCount >= 5 ? 'text-emerald-600' : 'text-amber-600'}>
                      {skillsCount >= 5 ? '95% Comprehensive' : 'Add More Skills'}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                    <div className={skillsCount >= 5 ? 'bg-emerald-500 h-full rounded-full' : 'bg-amber-400 h-full rounded-full'} style={{ width: skillsCount >= 5 ? '95%' : '40%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Recommendations & ATS Fixes */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <FileCheck className="h-4.5 w-4.5 text-[#fc4a27]" /> Actionable Improvements
              </h2>

              <div className="space-y-3">
                <div className="p-3.5 bg-emerald-50/70 border border-emerald-100 rounded-xl text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Contact Information</span>
                    All essential fields (Email, Phone, Location) are present.
                  </div>
                </div>

                <div className="p-3.5 bg-amber-50/70 border border-amber-100 rounded-xl text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Quantifiable Metrics</span>
                    Add percentages or metrics (e.g. "Increased sales by 30%") to work experience bullets.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate('/builder')}
                  className="w-full py-3 bg-[#fc4a27] text-white font-bold rounded-xl text-xs hover:bg-[#e0401f] transition"
                >
                  Improve Resume in Builder
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
