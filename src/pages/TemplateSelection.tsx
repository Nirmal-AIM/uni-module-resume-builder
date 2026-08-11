import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  LayoutDashboard,
  FileText,
  LayoutTemplate,
  Settings,
  Bell,
  ChevronDown,
  ArrowLeft,
  Check,
  Search,
  LogOut,
  ChevronUp,
  RefreshCw,
  AlertCircle,
  Eye,
  X,
  Briefcase,
  Filter,
  Sparkles,
  Mail,
  TrendingUp,
  User,
  HelpCircle,
} from 'lucide-react';
import { useAIAssistant } from '@/context/AIAssistantContext';

export type TemplateRecord = {
  id: string | number;
  key: string;
  name: string;
  description: string;
  category: string;
  badge?: string;
  best_suited_for?: string;
  preview_url: string;
  is_active: boolean;
  sort_order?: number;
  created_at?: string;
};

// Target audience mapping per template_id / key
const SUITED_MAPPING: Record<string, { suited: string; badge: string }> = {
  'ats-6': { suited: 'Students, freshers & college grads', badge: '⭐ Recommended for Students' },
  'richard-sanchez': { suited: 'Marketing, sales & executive managers', badge: 'Popular' },
  'zola-bekker': { suited: 'Designers, strategists & creative roles', badge: 'Serif' },
  'laurice-moretti': { suited: 'Systems designers, IT & tech architects', badge: 'High Contrast' },
  'drew-feig': { suited: 'Corporate specialists & mid-level roles', badge: 'ATS Friendly' },
  'ats-1': { suited: 'General professional applications', badge: 'ATS 100%' },
  'ats-2': { suited: 'Experienced professionals with projects', badge: 'Projects & Career' },
  'ats-3': { suited: 'Experienced / corporate roles', badge: 'Corporate ATS' },
  'ats-4': { suited: 'Engineering & technical roles', badge: 'Tech & Engineering' },
  'ats-5': { suited: 'Experienced professionals & leadership', badge: 'Leadership ATS' },
};

// Fallback list of 10 templates matching Supabase DB schema
const ALL_10_TEMPLATES: TemplateRecord[] = [
  {
    id: 1,
    key: 'ats-6',
    name: 'ATS Graduate',
    description: '100% ATS-optimized resume template specifically tailored for college students, freshers, and interns.',
    category: 'ATS Optimized',
    badge: '⭐ Recommended for Students',
    best_suited_for: 'Students, freshers & college grads',
    preview_url: '/templates/ATS6.jpg',
    is_active: true,
  },
  {
    id: 2,
    key: 'richard-sanchez',
    name: 'Executive Navy',
    description: 'Dark navy sidebar layout with avatar, timeline experience, and reference section.',
    category: 'Executive',
    badge: 'Popular',
    best_suited_for: 'Marketing, sales & executive managers',
    preview_url: '/templates/richard-sanchez.png',
    is_active: true,
  },
  {
    id: 3,
    key: 'zola-bekker',
    name: 'Warm Terracotta',
    description: 'Elegant terracotta serif typography with horizontal dividers and academic history grid.',
    category: 'Creative',
    badge: 'Serif',
    best_suited_for: 'Designers, strategists & creative roles',
    preview_url: '/templates/zola-bekker.png',
    is_active: true,
  },
  {
    id: 4,
    key: 'laurice-moretti',
    name: 'Bold Systems',
    description: 'High-contrast bold sans-serif header with clean single-column corporate bullet sections.',
    category: 'Minimal',
    badge: 'High Contrast',
    best_suited_for: 'Systems designers, IT & tech architects',
    preview_url: '/templates/laurice-moretti.png',
    is_active: true,
  },
  {
    id: 5,
    key: 'drew-feig',
    name: 'Clean Teal',
    description: 'Teal header accents with horizontal pipe contact bar and right-aligned italic dates.',
    category: 'Modern',
    badge: 'ATS Friendly',
    best_suited_for: 'Corporate specialists & mid-level roles',
    preview_url: '/templates/drew-feig.png',
    is_active: true,
  },
  {
    id: 6,
    key: 'ats-1',
    name: 'ATS Classic',
    description: 'Clean ATS-optimized single-column layout for maximum scanner parsing rate.',
    category: 'ATS Optimized',
    badge: 'ATS 100%',
    best_suited_for: 'General professional applications',
    preview_url: '/templates/ATS1.jpg',
    is_active: true,
  },
  {
    id: 7,
    key: 'ats-2',
    name: 'ATS Career',
    description: 'Structured ATS template with high-density experience and key project sections.',
    category: 'ATS Optimized',
    badge: 'Projects & Career',
    best_suited_for: 'Experienced professionals with projects',
    preview_url: '/templates/ATS2.jpg',
    is_active: true,
  },
  {
    id: 8,
    key: 'ats-3',
    name: 'ATS Professional',
    description: 'Corporate ATS resume format tailored for experienced and corporate industry roles.',
    category: 'ATS Optimized',
    badge: 'Corporate ATS',
    best_suited_for: 'Experienced / corporate roles',
    preview_url: '/templates/ATS3.jpg',
    is_active: true,
  },
  {
    id: 9,
    key: 'ats-4',
    name: 'ATS Engineering',
    description: 'High-parser ATS template designed specifically for technical and engineering positions.',
    category: 'ATS Optimized',
    badge: 'Tech & Engineering',
    best_suited_for: 'Engineering & technical roles',
    preview_url: '/templates/ATS4.jpg',
    is_active: true,
  },
  {
    id: 10,
    key: 'ats-5',
    name: 'ATS Executive',
    description: 'Refined ATS structure tailored for senior management, leadership, and executive roles.',
    category: 'ATS Optimized',
    badge: 'Leadership ATS',
    best_suited_for: 'Experienced professionals & leadership',
    preview_url: '/templates/ATS5.jpg',
    is_active: true,
  },
];

// Role Filter Categories
const ROLE_FILTERS = [
  { id: 'all', label: 'All Roles', keywords: [] },
  { id: 'students', label: 'Students & Freshers', keywords: ['students & freshers', 'freshers'] },
  { id: 'engineering', label: 'Engineering & Tech', keywords: ['engineering & technical roles', 'tech & it', 'systems designers'] },
  { id: 'corporate', label: 'Corporate & Experienced', keywords: ['corporate roles', 'experienced professionals with projects', 'corporate specialists'] },
  { id: 'executive', label: 'Leadership & Executive', keywords: ['leadership', 'executive managers', 'management'] },
  { id: 'creative', label: 'Creative & Design', keywords: ['designers', 'creative roles'] },
  { id: 'general', label: 'General Professional', keywords: ['general professional'] },
];

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard', active: false },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate, path: '/templates', active: true },
  { id: 'ai-assistant', label: 'AI Assistant', icon: Sparkles, path: '/dashboard?ai=open', active: false },
  { id: 'cover-letters', label: 'Cover Letters', icon: Mail, path: '/cover-letters', active: false },
  { id: 'resume-analytics', label: 'Resume Analytics', icon: TrendingUp, path: '/resume-analytics', active: false },
  { id: 'job-tracker', label: 'Job Tracker', icon: Briefcase, path: '/job-tracker', active: false },
  { id: 'profile', label: 'Profile', icon: User, path: '/profile', active: false },
  { id: 'help-support', label: 'Help & Support', icon: HelpCircle, path: '/help-support', active: false },
];

function getInitial(name: string, email: string) {
  const src = name && name !== '—' ? name : email;
  return src ? src.charAt(0).toUpperCase() : '?';
}

// Actual Image Preview Component with hover overlay button
function TemplateVisualPreview({
  previewUrl,
  name,
  onOpenFullPreview,
}: {
  previewUrl?: string;
  name: string;
  onOpenFullPreview: () => void;
}) {
  return (
    <div className="group/preview relative h-64 w-full overflow-hidden rounded-lg bg-gray-100 p-1.5 flex items-center justify-center border border-gray-200/80">
      <img
        src={previewUrl || '/templates/richard-sanchez.png'}
        alt={name}
        className="h-full w-full object-cover object-top rounded transition-transform duration-300 group-hover/preview:scale-[1.02]"
        loading="lazy"
      />
      {/* Hover Overlay Button */}
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-200 group-hover/preview:opacity-100 rounded-lg">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenFullPreview();
          }}
          className="flex items-center gap-1.5 rounded-lg bg-white px-3.5 py-2 text-xs font-semibold text-gray-900 shadow-md transition hover:bg-gray-100 active:scale-95"
        >
          <Eye className="h-3.5 w-3.5 text-[#fc4a27]" />
          View Full Preview
        </button>
      </div>
    </div>
  );
}

// Skeleton card while loading database templates
function TemplateSkeletonCard() {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-xs animate-pulse">
      <div className="h-64 w-full rounded-lg bg-gray-200" />
      <div className="mt-3.5 space-y-2">
        <div className="h-4 w-3/4 rounded bg-gray-200" />
        <div className="h-3 w-full rounded bg-gray-100" />
        <div className="h-3 w-5/6 rounded bg-gray-100" />
        <div className="flex gap-1.5 pt-1">
          <div className="h-4 w-16 rounded bg-gray-200" />
          <div className="h-4 w-20 rounded bg-gray-200" />
        </div>
        <div className="mt-3 flex gap-2">
          <div className="h-9 flex-1 rounded-xl bg-gray-200" />
          <div className="h-9 flex-1 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function TemplateSelection() {
  const { user, profile, logout } = useAuth();
  const navigate = useNavigate();
  const { openAIAssistant } = useAIAssistant();

  const [templates, setTemplates] = useState<TemplateRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>('ats-6');
  const [previewModalTemplate, setPreviewModalTemplate] = useState<TemplateRecord | null>(null);

  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'Recommended' | 'Newest' | 'A–Z'>('Recommended');
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Fetch templates directly from Supabase database and map database fields
  const fetchTemplatesFromDatabase = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: dbData, error: fetchErr } = await supabase
        .from('resume_templates')
        .select('*')
        .eq('is_active', true)
        .order('id', { ascending: true });

      if (!fetchErr && dbData && dbData.length > 0) {
        // Map database columns to component properties
        const mappedRecords: TemplateRecord[] = dbData.map((row: any) => {
          const tKey = row.template_id || row.key || `tpl_${row.id}`;
          const mapping = SUITED_MAPPING[tKey] || { suited: row.category || 'General', badge: row.category || 'Standard' };
          return {
            id: row.id,
            key: tKey,
            name: row.name,
            description: row.description,
            category: row.category,
            badge: row.badge || mapping.badge,
            best_suited_for: row.best_suited_for || mapping.suited,
            preview_url: row.preview_image || row.preview_url || '/templates/richard-sanchez.png',
            is_active: row.is_active ?? true,
            created_at: row.created_at,
          };
        });
        const sortedMapped = mappedRecords.sort((a, b) => {
          if (a.key === 'ats-6') return -1;
          if (b.key === 'ats-6') return 1;
          return Number(a.id) - Number(b.id);
        });
        setTemplates(sortedMapped);
      } else {
        setTemplates(ALL_10_TEMPLATES);
      }
    } catch (err) {
      setTemplates(ALL_10_TEMPLATES);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplatesFromDatabase();
  }, []);

  // ESC key listener to close full preview modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setPreviewModalTemplate(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/', { replace: true });
  };

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

  // Filter templates by search query AND role filter
  const filteredTemplates = (templates || []).filter(Boolean).filter((tpl) => {
    if (!tpl) return false;
    const query = searchQuery.toLowerCase().trim();
    const tplName = (tpl.name || '').toLowerCase();
    const tplDesc = (tpl.description || '').toLowerCase();
    const tplCat = (tpl.category || '').toLowerCase();
    const tplSuited = (tpl.best_suited_for || '').toLowerCase();

    const matchesSearch =
      !query ||
      tplName.includes(query) ||
      tplDesc.includes(query) ||
      tplCat.includes(query) ||
      tplSuited.includes(query);

    let matchesRole = true;
    if (selectedRoleFilter !== 'all') {
      const activeRoleObj = ROLE_FILTERS.find((r) => r.id === selectedRoleFilter);
      if (activeRoleObj && activeRoleObj.keywords.length > 0) {
        matchesRole = activeRoleObj.keywords.some(
          (kw) => tplSuited.includes(kw) || tplCat.includes(kw)
        );
      }
    }

    return matchesSearch && matchesRole;
  });

  // Sort logic: Keep ats-6 ALWAYS at #1 top position with safe null checks
  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (!a || !b) return 0;
    if (a.key === 'ats-6') return -1;
    if (b.key === 'ats-6') return 1;
    if (sortBy === 'A–Z') {
      return (a.name || '').localeCompare(b.name || '');
    }
    if (sortBy === 'Newest') {
      return (b.created_at || '').localeCompare(a.created_at || '');
    }
    return Number(a.id || 0) - Number(b.id || 0);
  });

  const handleSelectTemplate = (key: string) => {
    setSelectedTemplateKey(key);
  };

  const handleUseTemplate = (key: string) => {
    setSelectedTemplateKey(key);
    setPreviewModalTemplate(null);
    navigate(`/builder?template=${key}`);
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className="flex w-[230px] shrink-0 flex-col bg-[#051C36] text-white">
        {/* Brand Logo */}
        <div className="px-6 pt-6 pb-6 border-b border-white/10">
          <img src="/logo-dark-banner.svg" alt="ResUme NoW" className="w-full h-auto" />
        </div>

        {/* Navigation Options */}
        <nav className="flex flex-1 flex-col gap-1.5 px-3 py-6 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = item.active;
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

        {/* User Footer Profile */}
        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={() => setUserMenuOpen((o) => !o)}
            className="flex w-full items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-[#0d2d52]"
          >
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={displayName}
                className="h-8 w-8 shrink-0 rounded-full object-cover"
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

          {userMenuOpen && (
            <div className="mt-1 rounded-lg border border-white/10 bg-[#0d2d52] py-1">
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 px-3 py-2 text-xs text-[#ff6b52] transition-colors hover:bg-white/5"
              >
                <LogOut className="h-3.5 w-3.5" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main area ────────────────────────────────────────── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-14 items-center justify-between border-b border-gray-200 bg-white px-6">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-sm font-medium text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-4.5 w-4.5" />
            </button>

            <button
              type="button"
              onClick={() => setUserMenuOpen((o) => !o)}
              className="flex items-center gap-1.5"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#051C36] text-xs font-bold text-white">
                  {initial}
                </div>
              )}
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">
          {/* Section Header */}
          <div className="mb-5">
            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">Templates</h1>
            <p className="mt-1 text-sm text-gray-500">
              Choose a professional resume template tailored for your role and industry.
            </p>
          </div>

          {/* Role Filter Tabs */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-gray-700">
              <Filter className="h-3.5 w-3.5 text-[#fc4a27]" />
              <span>Filter by Target Role / Experience Level:</span>
            </div>
            <div className="flex overflow-x-auto gap-2 pb-1 no-scrollbar">
              {ROLE_FILTERS.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRoleFilter(role.id)}
                  className={`shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                    selectedRoleFilter === role.id
                      ? 'bg-[#051C36] text-white shadow-xs'
                      : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clean Toolbar: Search & Sort */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-4 border-b border-gray-200">
            {/* Search */}
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs text-gray-800 shadow-2xs placeholder:text-gray-400 focus:border-[#fc4a27] focus:outline-none focus:ring-1 focus:ring-[#fc4a27]"
              />
            </div>

            {/* Sort & Count */}
            <div className="flex items-center gap-4 text-xs text-gray-600">
              <span className="text-gray-400">
                Showing <strong className="text-gray-800 font-semibold">{sortedTemplates.length}</strong> template{sortedTemplates.length !== 1 ? 's' : ''} loaded from database
              </span>
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-700 shadow-2xs focus:border-[#fc4a27] focus:outline-none"
                >
                  <option value="Recommended">Recommended</option>
                  <option value="Newest">Newest</option>
                  <option value="A–Z">A–Z</option>
                </select>
              </div>
            </div>
          </div>

          {/* Loading State: Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <TemplateSkeletonCard key={idx} />
              ))}
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-red-200 bg-red-50/50 py-12 text-center">
              <AlertCircle className="h-8 w-8 text-red-500" />
              <h3 className="mt-3 text-base font-semibold text-gray-900">Unable to load templates</h3>
              <p className="mt-1 text-xs text-gray-500">Please check your database connection and try again.</p>
              <button
                type="button"
                onClick={fetchTemplatesFromDatabase}
                className="mt-4 flex items-center gap-2 rounded-lg bg-[#051C36] px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-[#0d2d52]"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Retry
              </button>
            </div>
          )}

          {/* Search Empty State */}
          {!loading && !error && sortedTemplates.length === 0 && (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-gray-200 bg-white py-16 text-center shadow-xs">
              <Search className="h-8 w-8 text-gray-300" />
              <h3 className="mt-3 text-base font-semibold text-gray-900">No templates match your filter</h3>
              <p className="mt-1 text-xs text-gray-500">Try selecting another role filter or clear your search input.</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedRoleFilter('all');
                }}
                className="mt-4 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Reset Filters
              </button>
            </div>
          )}

          {/* Desktop 3 Columns Grid */}
          {!loading && !error && sortedTemplates.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTemplates.map((tpl) => {
                const isSelected = selectedTemplateKey === tpl.key;
                return (
                  <div
                    key={tpl.id}
                    onClick={() => handleSelectTemplate(tpl.key)}
                    className={`group relative flex flex-col justify-between rounded-xl border bg-[#ffffff] p-3.5 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-[#fc4a27] ring-2 ring-[#fc4a27]/20 shadow-md'
                        : 'border-gray-200 hover:border-[#fc4a27]/60 hover:shadow-md'
                    }`}
                  >
                    {/* Template Image Preview */}
                    <div className="relative">
                      <TemplateVisualPreview
                        previewUrl={tpl.preview_url}
                        name={tpl.name}
                        onOpenFullPreview={() => setPreviewModalTemplate(tpl)}
                      />

                      {/* Selected Checkmark Badge */}
                      {isSelected && (
                        <div className="absolute right-4 top-4 flex h-6 w-6 items-center justify-center rounded-full bg-[#fc4a27] text-white shadow-sm z-10">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Metadata & Description */}
                    <div className="mt-3.5 flex flex-col flex-1 justify-between gap-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="text-base font-bold text-[#051C36] group-hover:text-[#fc4a27] transition-colors">
                            {tpl.name}
                          </h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                          {tpl.description}
                        </p>

                        {/* Best Suited For Pill */}
                        {tpl.best_suited_for && (
                          <div className="flex items-center gap-1 text-[11px] text-[#051C36] font-medium pt-0.5">
                            <Briefcase className="h-3 w-3 text-[#fc4a27] shrink-0" />
                            <span className="truncate">Best for: <strong className="font-semibold text-gray-900">{tpl.best_suited_for}</strong></span>
                          </div>
                        )}

                        {/* Category & Badge */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-600">
                            {tpl.category}
                          </span>
                          {tpl.badge && (
                            <span className="rounded-md bg-orange-50 px-2 py-0.5 text-[11px] font-semibold text-[#fc4a27] border border-orange-100">
                              {tpl.badge}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewModalTemplate(tpl);
                          }}
                          className="flex items-center justify-center gap-1.5 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-xs font-semibold text-gray-700 transition hover:bg-gray-100 hover:border-gray-300 shrink-0"
                          title="View Full Preview"
                        >
                          <Eye className="h-3.5 w-3.5 text-[#051C36]" />
                          View Full
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleUseTemplate(tpl.key);
                          }}
                          className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all duration-200 ${
                            isSelected
                              ? 'bg-[#fc4a27] text-[#ffffff] shadow-xs hover:bg-[#e0401f] active:scale-[0.98]'
                              : 'border border-gray-200 bg-gray-50 text-gray-700 hover:bg-[#fc4a27] hover:border-[#fc4a27] hover:text-[#ffffff]'
                          }`}
                        >
                          {isSelected ? '✓ Selected' : 'Use Template'}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white px-8 py-3 text-center text-xs text-gray-400">
          ResUme NoW © 2026 &bull; All rights reserved &nbsp;
          <span className="text-emerald-500 font-medium">🔒 Your data is secure and encrypted</span>
        </footer>
      </div>

      {/* ── Full Resume Preview Modal ──────────────────────── */}
      {previewModalTemplate && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setPreviewModalTemplate(null)}
        >
          <div
            className="relative flex max-h-[92vh] w-full max-w-4xl flex-col rounded-2xl bg-white shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-gray-200 bg-gray-50 px-6 py-4">
              <div className="flex items-center gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#051C36]">
                    {previewModalTemplate.name}
                  </h2>
                  {previewModalTemplate.best_suited_for && (
                    <p className="text-xs text-[#fc4a27] font-semibold">
                      Best suited for: {previewModalTemplate.best_suited_for}
                    </p>
                  )}
                </div>
                <span className="rounded-md bg-orange-50 px-2.5 py-1 text-xs font-semibold text-[#fc4a27] border border-orange-100">
                  {previewModalTemplate.category}
                </span>
              </div>

              {/* Modal Top Actions */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleUseTemplate(previewModalTemplate.key)}
                  className="rounded-xl bg-[#fc4a27] px-4 py-2 text-xs font-semibold text-white shadow-xs transition hover:bg-[#e0401f] active:scale-95"
                >
                  Use This Template
                </button>

                <button
                  type="button"
                  onClick={() => setPreviewModalTemplate(null)}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 transition hover:bg-gray-300 hover:text-gray-900"
                  aria-label="Close modal"
                  title="Close preview (Esc)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-6 bg-slate-100 flex justify-center">
              <img
                src={previewModalTemplate.preview_url}
                alt={previewModalTemplate.name}
                className="max-w-full rounded-lg shadow-md border border-gray-200 object-contain"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-6 py-3 text-xs text-gray-500">
              <span>Press <kbd className="rounded bg-gray-100 px-1.5 py-0.5 border border-gray-300 font-mono">Esc</kbd> or click outside to close</span>
              <button
                type="button"
                onClick={() => setPreviewModalTemplate(null)}
                className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 font-medium text-gray-700 hover:bg-gray-100"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
