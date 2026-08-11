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
  Plus,
  Trash2,
  Building2,
  MapPin,
  Calendar,
  X,
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

interface JobItem {
  id: string;
  company: string;
  position: string;
  location: string;
  status: 'Applied' | 'Interviewing' | 'Offer' | 'Rejected';
  date: string;
}

import { useAIAssistant } from '@/context/AIAssistantContext';

export function JobTracker() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { openAIAssistant } = useAIAssistant();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'All' | 'Applied' | 'Interviewing' | 'Offer' | 'Rejected'>('All');

  const [jobs, setJobs] = useState<JobItem[]>([
    { id: '1', company: 'Google', position: 'Senior Software Engineer', location: 'Mountain View, CA', status: 'Interviewing', date: '2026-08-01' },
    { id: '2', company: 'Microsoft', position: 'Full Stack Engineer', location: 'Redmond, WA', status: 'Applied', date: '2026-08-05' },
    { id: '3', company: 'Meta', position: 'Frontend Specialist', location: 'Remote', status: 'Offer', date: '2026-07-20' },
  ]);

  const [modalOpen, setModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState('');
  const [newPosition, setNewPosition] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newStatus, setNewStatus] = useState<'Applied' | 'Interviewing' | 'Offer' | 'Rejected'>('Applied');

  const handleAddJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newPosition) return;
    const item: JobItem = {
      id: Date.now().toString(),
      company: newCompany,
      position: newPosition,
      location: newLocation || 'Remote',
      status: newStatus,
      date: new Date().toISOString().split('T')[0],
    };
    setJobs([item, ...jobs]);
    setNewCompany('');
    setNewPosition('');
    setNewLocation('');
    setModalOpen(false);
  };

  const handleDeleteJob = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
  };

  const filteredJobs = activeTab === 'All' ? jobs : jobs.filter((j) => j.status === activeTab);

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
            const isActive = item.id === 'job-tracker';
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

      {/* Main Container */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200/80 bg-white px-8 shrink-0">
          <div className="flex items-center gap-2">
            <Briefcase className="h-5 w-5 text-[#fc4a27]" />
            <h1 className="text-base font-bold text-gray-900">Job Application Tracker</h1>
          </div>
          <Bell className="h-4.5 w-4.5 text-gray-500 cursor-pointer" />
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          {/* Header & Add Button */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Track Your Applications</h2>
              <p className="text-xs text-gray-500 mt-0.5">Manage interview pipelines and job offers in one place.</p>
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#fc4a27] hover:bg-[#e0401f] text-white font-bold rounded-xl text-xs shadow-sm transition"
            >
              <Plus className="h-4 w-4" /> Add Application
            </button>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 border-b border-gray-200/80 pb-2">
            {(['All', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-xs font-bold rounded-xl transition ${
                  activeTab === tab
                    ? 'bg-[#051C36] text-white shadow-xs'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Job Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredJobs.map((job) => (
              <div key={job.id} className="p-5 bg-white border border-gray-200/80 rounded-2xl shadow-sm hover:border-[#fc4a27]/30 transition space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-[#fc4a27] font-bold">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-gray-900">{job.position}</h3>
                      <p className="text-xs font-semibold text-gray-600">{job.company}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteJob(job.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500 pt-2 border-t border-gray-100">
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5 text-gray-400" /> {job.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-gray-400" /> {job.date}
                  </span>
                </div>

                <div className="pt-2">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      job.status === 'Offer'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : job.status === 'Interviewing'
                        ? 'bg-sky-50 text-sky-700 border border-sky-200'
                        : job.status === 'Applied'
                        ? 'bg-orange-50 text-[#fc4a27] border border-orange-200'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Add Job Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900">Add New Job Application</h3>
              <button type="button" onClick={() => setModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-4 w-4" />
              </button>
            </div>
            <form onSubmit={handleAddJob} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-700">Company Name</label>
                <input
                  type="text"
                  required
                  value={newCompany}
                  onChange={(e) => setNewCompany(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                  placeholder="e.g. Google"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Job Title / Role</label>
                <input
                  type="text"
                  required
                  value={newPosition}
                  onChange={(e) => setNewPosition(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                  placeholder="e.g. Software Engineer"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Location</label>
                <input
                  type="text"
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                  placeholder="e.g. San Francisco, CA or Remote"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700">Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as any)}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interviewing">Interviewing</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-100 text-xs font-bold text-gray-600 rounded-xl hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#fc4a27] text-xs font-bold text-white rounded-xl hover:bg-[#e0401f]"
                >
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
