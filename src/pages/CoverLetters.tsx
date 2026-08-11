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
  Copy,
  Download,
  Loader2,
  Check,
} from 'lucide-react';
import { askAIAssistant } from '@/services/aiService';

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

export function CoverLetters() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Form State
  const [jobTitle, setJobTitle] = useState('Senior Software Engineer');
  const [companyName, setCompanyName] = useState('Tech Solutions Inc.');
  const [tone, setTone] = useState('Professional & Persuasive');
  const [keyDetails, setKeyDetails] = useState('5+ years building full-stack web applications, React, Node.js, Cloud architecture');

  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState(
    `Dear Hiring Manager at Tech Solutions Inc.,\n\nI am writing to express my strong interest in the Senior Software Engineer position at Tech Solutions Inc. With over 5 years of experience architecting scalable full-stack applications using React, TypeScript, and Node.js, I am confident in my ability to make an immediate impact on your engineering team.\n\nThroughout my career, I have specialized in building high-performance web applications and leading cross-functional projects. At my previous role, I optimized core APIs resulting in a 40% improvement in load times while collaborating closely with product designers to deliver seamless user experiences.\n\nTech Solutions Inc.'s commitment to technical innovation strongly aligns with my professional values. I welcome the opportunity to discuss how my background and technical leadership can support your upcoming growth initiatives.\n\nThank you for your time and consideration.\n\nSincerely,\n${profile?.full_name || user?.email?.split('@')[0] || 'Applicant'}`
  );

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const prompt = `Write a compelling, professional cover letter for the role of "${jobTitle}" at "${companyName}". Tone: ${tone}. Key accomplishments: ${keyDetails}. Applicant name: ${profile?.full_name || 'Applicant'}. Do not include placeholder brackets.`;
      const response = await askAIAssistant(prompt);
      setGeneratedLetter(response);
    } catch (e) {
      console.error('Cover letter generation error:', e);
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName.replace(/\s+/g, '_')}_Cover_Letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
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
            const isActive = item.id === 'cover-letters';
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

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b border-gray-200/80 bg-white px-8 shrink-0">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-[#fc4a27]" />
            <h1 className="text-base font-bold text-gray-900">AI Cover Letter Generator</h1>
          </div>
          <Bell className="h-4.5 w-4.5 text-gray-500 cursor-pointer" />
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Input Form Column */}
            <div className="lg:col-span-5 space-y-5 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
              <h2 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#fc4a27]" /> Cover Letter Details
              </h2>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Target Job Title</label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none"
                  placeholder="e.g. Microsoft"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Tone</label>
                <select
                  value={tone}
                  onChange={(e) => setTone(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none"
                >
                  <option>Professional & Persuasive</option>
                  <option>Enthusiastic & High Energy</option>
                  <option>Executive & Authoritative</option>
                  <option>Creative & Modern</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-700">Key Achievements / Skills to Highlight</label>
                <textarea
                  rows={4}
                  value={keyDetails}
                  onChange={(e) => setKeyDetails(e.target.value)}
                  className="w-full p-3.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none leading-relaxed"
                  placeholder="Mention 2-3 key accomplishments or tools..."
                />
              </div>

              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-[#fc4a27] text-white font-bold rounded-xl text-xs hover:bg-[#e0401f] transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
              >
                {generating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Generating with Groq AI...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" /> Generate Cover Letter
                  </>
                )}
              </button>
            </div>

            {/* Letter Preview Column */}
            <div className="lg:col-span-7 flex flex-col bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm min-h-[500px]">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <span className="text-xs font-bold text-gray-800">Generated Cover Letter Preview</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-xs font-medium text-gray-700 transition"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-50 hover:bg-orange-100 rounded-lg text-xs font-bold text-[#fc4a27] transition border border-orange-200"
                  >
                    <Download className="h-3.5 w-3.5" /> Download TXT
                  </button>
                </div>
              </div>

              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                className="w-full flex-1 p-4 bg-gray-50/50 border border-gray-200 rounded-xl text-xs leading-relaxed text-gray-800 focus:outline-none font-mono"
                rows={18}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
