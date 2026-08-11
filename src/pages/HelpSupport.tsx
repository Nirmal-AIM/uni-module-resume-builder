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
  Search,
  BookOpen,
  MessageSquare,
  FileText,
  CheckCircle2,
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

const faqs = [
  {
    q: 'How do I export my resume as a PDF?',
    a: 'Click "Print / Export PDF" in the top bar of the Resume Builder. Ensure your browser print settings have "Background graphics" enabled and margins set to "None" or "Default".',
  },
  {
    q: 'How does the Groq AI Resume Assistant work?',
    a: 'Our AI utilizes Groq Llama-3.3-70B model to generate tailored executive summaries, rewrite bullet points into action-oriented metrics, and review your resume for ATS compatibility.',
  },
  {
    q: 'Is my resume data saved automatically?',
    a: 'Yes! All changes made in the survey form are saved automatically to your Supabase cloud database record in real-time.',
  },
  {
    q: 'Can I customize the resume templates?',
    a: 'Yes, you can select from our list of ATS-friendly templates anytime in the Templates section or directly within the Builder.',
  },
];

import { useAIAssistant } from '@/context/AIAssistantContext';

export function HelpSupport() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { openAIAssistant } = useAIAssistant();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const [contactMsg, setContactMsg] = useState('');
  const [contactSent, setContactSent] = useState(false);

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMsg.trim()) return;
    setContactSent(true);
    setContactMsg('');
    setTimeout(() => setContactSent(false), 4000);
  };

  const fullName = profile?.full_name || user?.email?.split('@')[0] || 'User';
  const initial = fullName.charAt(0).toUpperCase();

  const filteredFaqs = faqs.filter(
    (f) => f.q.toLowerCase().includes(searchQuery.toLowerCase()) || f.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            const isActive = item.id === 'help-support';
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
            <HelpCircle className="h-5 w-5 text-[#fc4a27]" />
            <h1 className="text-base font-bold text-gray-900">Help Center & Support</h1>
          </div>
          <Bell className="h-4.5 w-4.5 text-gray-500 cursor-pointer" />
        </header>

        <main className="flex-1 overflow-y-auto p-8 space-y-8 max-w-5xl">
          {/* Hero Search Box */}
          <div className="p-8 bg-gradient-to-r from-[#051C36] to-[#0d2d52] rounded-2xl text-white text-center space-y-4 shadow-sm">
            <h2 className="text-2xl font-black">How can we help you today?</h2>
            <div className="max-w-xl mx-auto relative">
              <Search className="h-4 w-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQs, guide topics, PDF print tips..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl text-xs text-white placeholder-gray-300 focus:outline-none focus:bg-white/20"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* FAQ Accordions */}
            <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-[#fc4a27]" /> Frequently Asked Questions
              </h3>

              <div className="space-y-3">
                {filteredFaqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-gray-200/80 rounded-xl overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-4 text-left font-bold text-xs text-gray-900 flex items-center justify-between hover:bg-gray-50 transition"
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <ChevronUp className="h-4 w-4 text-gray-500" /> : <ChevronDown className="h-4 w-4 text-gray-500" />}
                      </button>
                      {isOpen && (
                        <div className="p-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Direct Support Form */}
            <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-[#fc4a27]" /> Contact Support
              </h3>

              {contactSent && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-800 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  Your message has been sent! Our team will respond shortly.
                </div>
              )}

              <form onSubmit={handleContactSubmit} className="space-y-3">
                <div>
                  <label className="text-xs font-bold text-gray-700">Your Message</label>
                  <textarea
                    rows={5}
                    required
                    value={contactMsg}
                    onChange={(e) => setContactMsg(e.target.value)}
                    placeholder="Describe your question or feedback..."
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs mt-1 leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#fc4a27] hover:bg-[#e0401f] text-white font-bold rounded-xl text-xs shadow-sm transition"
                >
                  Send Support Ticket
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
