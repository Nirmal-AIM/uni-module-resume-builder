import { useState, useEffect, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { loadResume, saveResume, type ResumeRecord } from '@/services/resumeService';
import {
  LayoutDashboard,
  LayoutTemplate,
  Sparkles,
  Mail,
  TrendingUp,
  Briefcase,
  User,
  HelpCircle,
  Plus,
  UploadCloud,
  Download,
  GraduationCap,
  FileText,
  AlertCircle,
  BookOpen,
  ChevronRight,
  Bell,
  ChevronDown,
  ChevronUp,
  LogOut,
  FolderOpen,
  X,
  Send,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { reviewResumeContent, askAIAssistant, type AIResumeReviewResult } from '@/services/aiService';
import { useAIAssistant } from '@/context/AIAssistantContext';

const sidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, path: '/templates' },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, path: '#' },
  { id: 'cover-letters', label: 'Cover Letters', icon: Mail, path: '/cover-letters' },
  { id: 'resume-analytics', label: 'Resume Analytics', icon: TrendingUp, path: '/resume-analytics' },
  { id: 'job-tracker', label: 'Job Tracker', icon: Briefcase, path: '/job-tracker' },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile' },
  { id: 'help-support', label: 'Help & Support', icon: HelpCircle, path: '/help-support' },
];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function getInitial(name: string, email: string) {
  const src = name && name !== '—' ? name : email;
  return src ? src.charAt(0).toUpperCase() : '?';
}

export function Dashboard() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { openAIAssistant } = useAIAssistant();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [existingResume, setExistingResume] = useState<ResumeRecord | null>(null);

  // AI Feature States
  const [aiReviewModalOpen, setAiReviewModalOpen] = useState(false);
  const [aiReviewData, setAiReviewData] = useState<AIResumeReviewResult | null>(null);
  const [isAuditingResume, setIsAuditingResume] = useState(false);

  const [aiAssistantOpen, setAiAssistantOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string }>>([
    { sender: 'ai', text: "Hello! I'm your AI Resume & Career Coach powered by Groq. Ask me anything about resume writing, ATS optimization, or interview tips!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isSendingChat, setIsSendingChat] = useState(false);

  const [activeResourceModal, setActiveResourceModal] = useState<string | null>(null);
  const fileImportRef = useRef<HTMLInputElement>(null);

  const fullName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    '';
  const email = user?.email ?? '';
  const avatarUrl =
    profile?.avatar_url ||
    user?.user_metadata?.avatar_url ||
    user?.user_metadata?.picture ||
    '';

  const displayName = fullName || email.split('@')[0] || 'User';
  const initial = getInitial(fullName, email);
  const greeting = getGreeting();

  const handleRunAIReview = async () => {
    setAiReviewModalOpen(true);
    if (aiReviewData) return;
    setIsAuditingResume(true);
    try {
      const dataToAudit = existingResume?.resume_data || {
        personal: { fullName: displayName, email },
        skills: ['React', 'TypeScript', 'Node.js'],
      };
      const result = await reviewResumeContent(dataToAudit);
      setAiReviewData(result);
    } catch (e) {
      console.error('handleRunAIReview error:', e);
    } finally {
      setIsAuditingResume(false);
    }
  };

  const handleSendChatMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim() || isSendingChat) return;

    const userMsg = chatInput.trim();
    setChatInput('');
    setChatMessages((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setIsSendingChat(true);

    try {
      const reply = await askAIAssistant(userMsg, existingResume?.resume_data);
      setChatMessages((prev) => [...prev, { sender: 'ai', text: reply }]);
    } catch (err) {
      setChatMessages((prev) => [...prev, { sender: 'ai', text: "Sorry, I couldn't process your request right now." }]);
    } finally {
      setIsSendingChat(false);
    }
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const record = await loadResume();
        if (record) {
          setExistingResume(record);
        }
      } catch (err) {
        console.error('Error loading resume on dashboard:', err);
      }
    })();
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

  const handleSidebarClick = (item: typeof sidebarItems[0]) => {
    setActiveTab(item.id);
    if (item.id === 'ai-assistant') {
      openAIAssistant();
      return;
    }
    if (item.path && item.path !== '#') {
      navigate(item.path);
    }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const content = evt.target?.result as string;
        const parsed = JSON.parse(content);
        await saveResume({ title: file.name.replace(/\.[^/.]+$/, ''), resume_data: parsed, template_key: 'ats-6' });
        navigate('/builder?template=ats-6');
      } catch (err) {
        navigate('/builder?template=ats-6');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] overflow-hidden">
      {/* Hidden File Input for Import Resume */}
      <input
        ref={fileImportRef}
        type="file"
        accept=".json,.txt,.doc,.docx,.pdf"
        onChange={handleImportFile}
        className="hidden"
      />

      {/* Resource Modals */}
      {activeResourceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#fc4a27]" />
                {activeResourceModal === 'tips' && 'Resume Writing Tips'}
                {activeResourceModal === 'ats' && 'ATS Scanner Guidelines'}
                {activeResourceModal === 'mistakes' && 'Common Resume Mistakes to Avoid'}
                {activeResourceModal === 'samples' && 'Sample Resumes by Role'}
              </h3>
              <button
                type="button"
                onClick={() => setActiveResourceModal(null)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs leading-relaxed text-gray-700 max-h-[60vh] overflow-y-auto pr-1">
              {activeResourceModal === 'tips' && (
                <>
                  <p className="font-bold text-gray-900">5 Proven Tips for a Standout Resume:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li><b>Use Strong Action Verbs:</b> Begin bullet points with verbs like <i>built, developed, managed, led, architected</i>.</li>
                    <li><b>Quantify Your Results:</b> Add real numbers (e.g. "Increased load speed by 40%", "Managed $50k budget").</li>
                    <li><b>Keep It Concise:</b> Limit resume length to 1-2 pages maximum.</li>
                    <li><b>Match Job Keywords:</b> Include technical skills mentioned in target job descriptions.</li>
                    <li><b>Proofread Carefully:</b> Ensure 100% accurate spelling and consistent dates.</li>
                  </ul>
                </>
              )}

              {activeResourceModal === 'ats' && (
                <>
                  <p className="font-bold text-gray-900">How to Pass ATS Scanners with 100% Rate:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li><b>Use ATS Templates:</b> Select our <b>ATS Graduate</b> template for single-column clean parsing.</li>
                    <li><b>Standard Section Titles:</b> Stick to clear headings like <i>Work Experience</i>, <i>Education</i>, <i>Skills</i>.</li>
                    <li><b>Plain Text Formatting:</b> Avoid tables, images, or floating text boxes inside body text.</li>
                    <li><b>Include Contact Info:</b> Place Email, Phone, LinkedIn, and Location at the top header.</li>
                    <li><b>Export as PDF:</b> Always use our 1-click PDF download for crisp ATS ingestion.</li>
                  </ul>
                </>
              )}

              {activeResourceModal === 'mistakes' && (
                <>
                  <p className="font-bold text-gray-900">Top 5 Resume Mistakes to Avoid:</p>
                  <ul className="list-disc pl-4 space-y-2">
                    <li><b>Vague Descriptions:</b> Avoid generic tasks like "Responsible for daily tasks". Show impact instead!</li>
                    <li><b>Unprofessional Email:</b> Use a clean professional email address (e.g. name@gmail.com).</li>
                    <li><b>Irrelevant Information:</b> Exclude high school details if you have university degrees.</li>
                    <li><b>Typos & Grammar Errors:</b> Run your text through our Groq AI Assistant to catch errors.</li>
                    <li><b>Generic Objective Statements:</b> Replace objective statements with an Executive Summary.</li>
                  </ul>
                </>
              )}

              {activeResourceModal === 'samples' && (
                <>
                  <p className="font-bold text-gray-900">Sample Resume Outlines by Industry:</p>
                  <div className="space-y-3">
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900">Software Engineer / Tech</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">Focus: Tech Stack, System Architecture, GitHub links, Open Source & Key Projects.</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900">Data Analyst / Scientist</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">Focus: Python, SQL, Tableau, Predictive Modeling, Machine Learning Metrics.</p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-xl border border-gray-200">
                      <h4 className="font-bold text-gray-900">Product / Business Analyst</h4>
                      <p className="text-[11px] text-gray-600 mt-0.5">Focus: Strategy, Agile, Stakeholder Management, User Retention %, Business Growth.</p>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setActiveResourceModal(null)}
                className="px-4 py-2 bg-[#051C36] text-white font-bold rounded-xl text-xs hover:bg-[#0d2d52] transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="flex w-[230px] shrink-0 flex-col bg-[#051C36] text-white">
        {/* Brand Logo */}
        <div className="px-6 pt-6 pb-6 border-b border-white/10">
          <img src="/logo-dark-banner.svg" alt="ResUme NoW" className="w-full h-auto" />
        </div>

        {/* Navigation Options */}
        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSidebarClick(item)}
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

        {/* User Footer Profile */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-[#0d2d52]"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover border border-white/20"
              />
            ) : (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#fc4a27] text-xs font-bold text-white">
                {initial}
              </div>
            )}
            <div className="flex min-w-0 flex-1 flex-col text-left">
              <span className="truncate text-xs font-semibold text-white">
                {displayName}
              </span>
              <span className="truncate text-[10px] text-[#8ca0b8]">{email}</span>
            </div>
            {userMenuOpen ? (
              <ChevronUp className="h-3.5 w-3.5 shrink-0 text-[#8ca0b8]" />
            ) : (
              <ChevronDown className="h-3.5 w-3.5 shrink-0 text-[#8ca0b8]" />
            )}
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="mt-2.5 rounded-xl border border-white/10 bg-[#0d2d52] py-1 shadow-lg">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-4 py-2.5 text-xs text-[#ff6b52] font-semibold transition-colors hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main Dashboard Area ─────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Header Bar */}
        <header className="flex h-14 items-center justify-end gap-3 border-b border-gray-200/80 bg-white px-8 shrink-0">
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
          </button>

          <div className="h-6 w-px bg-gray-200" />

          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-700 hover:text-gray-900"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 rounded-full object-cover border border-gray-200"
              />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#051C36] text-xs font-bold text-white">
                {initial}
              </div>
            )}
            <span>{displayName}</span>
            <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          </button>
        </header>

        {/* Scrollable Dashboard Body */}
        <main className="flex-1 overflow-y-auto p-8 space-y-8">
          {/* Greeting Title */}
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {greeting}, {displayName}! <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Create, manage and improve your resumes all in one place.
            </p>
          </div>

          {/* Hero Banner Card: Create a New Resume */}
          <div
            onClick={() => navigate('/templates')}
            className="group flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-6 shadow-sm hover:shadow-md hover:border-[#fc4a27]/30 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#fc4a27] group-hover:scale-105 transition-transform">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="2" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M8 7h6M8 11h6M8 15h3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="17" cy="17" r="4" fill="currentColor"/>
                  <path d="M17 15v4M15 17h4" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 group-hover:text-[#fc4a27] transition-colors">
                  Create a New Resume
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Start building your professional resume in minutes.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                navigate('/templates');
              }}
              className="flex items-center gap-2 rounded-xl bg-[#fc4a27] px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#e0401f] active:scale-95 shrink-0"
            >
              <Plus className="h-4 w-4" />
              Create Resume
            </button>
          </div>

          {/* ── Quick Actions Section ─────────────────────────── */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Choose Template */}
              <div
                onClick={() => navigate('/templates')}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer min-h-[140px]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 group-hover:scale-105 transition-transform">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                      Choose Template
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Pick from 20+ ATS-friendly templates
                    </p>
                  </div>
                </div>
              </div>

              {/* Import Resume */}
              <div
                onClick={() => fileImportRef.current?.click()}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-emerald-300 transition-all cursor-pointer min-h-[140px]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-105 transition-transform">
                    <UploadCloud className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-emerald-600 transition-colors">
                      Import Resume
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Upload and enhance your existing resume
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Resume Review */}
              <div
                onClick={handleRunAIReview}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-sky-300 transition-all cursor-pointer min-h-[140px]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-sky-600 group-hover:scale-105 transition-transform">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-sky-600 transition-colors">
                      AI Resume Review
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Get AI-powered feedback and suggestions
                    </p>
                  </div>
                </div>
              </div>

              {/* Download Resume */}
              <div
                onClick={() => navigate('/builder')}
                className="group flex flex-col justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md hover:border-orange-300 transition-all cursor-pointer min-h-[140px]"
              >
                <div className="flex items-start gap-3.5">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#fc4a27] group-hover:scale-105 transition-transform">
                    <Download className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900 group-hover:text-[#fc4a27] transition-colors">
                      Download Resume
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      Export your resume in PDF format
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Resources & Insights Section ─────────────────── */}
          <div>
            <h2 className="text-base font-bold text-gray-900 mb-4">Resources & Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Resume Writing Tips */}
              <div
                onClick={() => setActiveResourceModal('tips')}
                className="group flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
                    <GraduationCap className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">Resume Writing Tips</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      Expert tips to write a perfect resume
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors ml-2" />
              </div>

              {/* ATS Guidelines */}
              <div
                onClick={() => setActiveResourceModal('ats')}
                className="group flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-500">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">ATS Guidelines</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      Make your resume ATS-friendly
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors ml-2" />
              </div>

              {/* Common Mistakes */}
              <div
                onClick={() => setActiveResourceModal('mistakes')}
                className="group flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
                    <AlertCircle className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">Common Mistakes</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      Avoid these resume mistakes
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors ml-2" />
              </div>

              {/* Sample Resumes */}
              <div
                onClick={() => setActiveResourceModal('samples')}
                className="group flex items-center justify-between rounded-2xl border border-gray-200/80 bg-white p-5 shadow-sm hover:shadow-md transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-gray-900 truncate">Sample Resumes</h3>
                    <p className="text-[11px] text-gray-500 mt-0.5 truncate">
                      View sample resumes by role
                    </p>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-gray-400 group-hover:text-gray-700 transition-colors ml-2" />
              </div>
            </div>
          </div>

          {/* ── Your Saved Resumes (Preserved Functionality) ── */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-base font-bold text-gray-900">Your Resumes</h2>
              <select className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#fc4a27]/30">
                <option>Newest First</option>
                <option>Oldest First</option>
                <option>A–Z</option>
              </select>
            </div>

            {existingResume ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex flex-col justify-between rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:border-[#fc4a27]/40 transition">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-[#fc4a27] bg-orange-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
                        {existingResume.template_key || 'modern-blue'}
                      </span>
                      <span className="text-[10px] text-gray-400">
                        Updated {new Date(existingResume.updated_at || Date.now()).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-gray-900 truncate">
                      {existingResume.title || 'My Resume'}
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {(existingResume.resume_data as any)?.personal?.fullName || displayName}'s Resume
                    </p>
                  </div>
                  <div className="mt-5 flex items-center gap-2 pt-3 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => navigate(`/builder?template=${existingResume.template_key || 'modern-blue'}`)}
                      className="flex-1 rounded-xl bg-[#fc4a27] px-4 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#e0401f] transition text-center"
                    >
                      Edit Resume
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate('/templates')}
                      className="rounded-xl border border-gray-200 px-3 py-2 text-xs font-semibold text-gray-700 hover:bg-gray-50 transition"
                    >
                      Change Template
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-12 shadow-sm">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50">
                  <FolderOpen className="h-7 w-7 text-[#fc4a27]/60" />
                </div>
                <h3 className="mt-3 text-sm font-semibold text-gray-900">No resumes saved yet</h3>
                <p className="mt-1 text-center text-xs text-gray-500">
                  Start by clicking "Create a New Resume" above!
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-200/60 bg-white px-8 py-3 text-center text-xs text-gray-400 shrink-0">
          ResUme NoW © 2026 &bull; All rights reserved &nbsp;
          <span className="text-emerald-500 font-medium">🔒 Your data is secure and encrypted</span>
        </footer>
      </div>

      {/* ── AI Resume Review Modal ──────────────────────────────── */}
      {aiReviewModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setAiReviewModalOpen(false)}
        >
          <div
            className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#051C36] px-6 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <Sparkles className="h-5 w-5 text-[#fc4a27]" />
                <h2 className="text-base font-bold">Groq AI Resume Audit & Review</h2>
              </div>
              <button
                type="button"
                onClick={() => setAiReviewModalOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {isAuditingResume ? (
                <div className="flex flex-col items-center justify-center py-12 space-y-3">
                  <Loader2 className="h-10 w-10 text-[#fc4a27] animate-spin" />
                  <p className="text-sm font-semibold text-gray-700">Analyzing your resume with Llama-3.3-70B AI...</p>
                  <p className="text-xs text-gray-400">Evaluating ATS compatibility, bullet impact, and formatting strength.</p>
                </div>
              ) : aiReviewData ? (
                <div className="space-y-6">
                  {/* Score Card */}
                  <div className="flex items-center justify-between p-5 bg-gradient-to-r from-[#051C36] to-[#0f3460] rounded-2xl text-white">
                    <div>
                      <span className="text-xs font-semibold text-[#fc4a27] uppercase tracking-wider">Overall AI Score</span>
                      <h3 className="text-3xl font-extrabold mt-0.5">{aiReviewData.score} / 100</h3>
                      <p className="text-xs text-gray-300 mt-1">{aiReviewData.atsCheck}</p>
                    </div>
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/10 border-4 border-[#fc4a27]">
                      <span className="text-lg font-black text-white">{aiReviewData.score}%</span>
                    </div>
                  </div>

                  {/* Key Strengths */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Key Strengths
                    </h4>
                    <div className="space-y-1.5">
                      {aiReviewData.strengths.map((s, i) => (
                        <div key={i} className="p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl text-xs text-emerald-900 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4" /> Recommended Enhancements
                    </h4>
                    <div className="space-y-1.5">
                      {aiReviewData.improvements.map((imp, i) => (
                        <div key={i} className="p-3 bg-amber-50/60 border border-amber-100 rounded-xl text-xs text-amber-900 font-medium flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          {imp}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* Modal Footer */}
            <div className="flex justify-end gap-2 border-t border-gray-100 bg-gray-50 px-6 py-3">
              <button
                type="button"
                onClick={() => navigate('/builder')}
                className="rounded-xl bg-[#fc4a27] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#e0401f] transition"
              >
                Apply Suggestions in Builder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── AI Assistant Chat Drawer / Modal ───────────────────── */}
      {aiAssistantOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setAiAssistantOpen(false)}
        >
          <div
            className="flex h-full w-full max-w-md flex-col bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-[#051C36] px-5 py-4 text-white">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fc4a27]">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">AI Resume Assistant</h3>
                  <p className="text-[10px] text-emerald-400">Powered by Groq Llama-3.3-70B</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiAssistantOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#fc4a27] text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isSendingChat && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-4 py-2.5 text-xs text-gray-500 shadow-xs">
                    <Loader2 className="h-3.5 w-3.5 animate-spin text-[#fc4a27]" />
                    AI is thinking...
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="border-t border-gray-200 bg-white p-3 flex gap-2">
              <input
                type="text"
                placeholder="Ask AI anything about your resume..."
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                className="flex-1 rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isSendingChat}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#fc4a27] text-white hover:bg-[#e0401f] transition disabled:opacity-40 shrink-0"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
