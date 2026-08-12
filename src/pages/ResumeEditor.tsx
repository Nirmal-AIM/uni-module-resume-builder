import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { ResumeSurvey } from "@/components/resume-builder/ResumeSurvey";
import { ResumePreview } from "@/components/ResumePreview";
import { loadResume, saveResume } from "@/services/resumeService";
import {
  User,
  FileText,
  Briefcase,
  GraduationCap,
  Sparkles,
  Code,
  Award,
  Languages,
  Plus,
  Check,
  Pencil,
  ChevronDown,
  Download,
  LogOut,
  ArrowLeft,
  Star,
  Layers,
} from "lucide-react";

const SIDEBAR_SECTIONS = [
  { id: "personal", label: "Personal Information", icon: User },
  { id: "summary", label: "Professional Summary", icon: FileText },
  { id: "experience", label: "Experience", icon: Briefcase },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Sparkles },
  { id: "projects", label: "Projects", icon: Code },
  { id: "certificates", label: "Certifications", icon: Award },
  { id: "languages", label: "Languages", icon: Languages },
];

const TEMPLATE_OPTIONS = [
  { id: "modern-blue", name: "Executive Navy (Richard Sanchez)" },
  { id: "minimalist-orange", name: "Warm Terracotta (Zola Bekker)" },
  { id: "clean-teal", name: "Clean Teal (Drew Feig)" },
  { id: "bold-black", name: "Bold Systems (Laurice Moretti)" },
];

export function ResumeEditor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, profile, logout } = useAuth();
  const initialTemplate = searchParams.get("template") || "ats-6";

  const [activeSection, setActiveSection] = useState<string | null>("personal");
  const [selectedTemplate, setSelectedTemplate] = useState<string>(initialTemplate);
  const [resumeTitle, setResumeTitle] = useState<string>("Software Engineer Resume");
  const [isEditingTitle, setIsEditingTitle] = useState<boolean>(false);
  const [showTemplateDropdown, setShowTemplateDropdown] = useState<boolean>(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [isInitialLoaded, setIsInitialLoaded] = useState<boolean>(false);

  const [resumeData, setResumeData] = useState<any>({
    personal: {
      fullName: profile?.full_name || user?.user_metadata?.full_name || "",
      jobTitle: "",
      email: user?.email || "",
      phone: "",
      address: "",
      skillsText: "",
      profileImage: null,
    },
    education_list: [{}],
    experience: [{}],
    projects: [{}],
    skills: [],
    languages: [],
    summary: { text: "" },
    certificates: [{}],
  });

  // Load user data from Supabase database on mount
  useEffect(() => {
    if (!user) return;
    let active = true;

    (async () => {
      try {
        const record = await loadResume();
        if (!active) return;
        if (record) {
          if (record.title) setResumeTitle(record.title);
          if (record.template_key) setSelectedTemplate(record.template_key);
          if (record.resume_data && typeof record.resume_data === "object") {
            setResumeData((prev: any) => ({
              ...prev,
              ...(record.resume_data as any),
            }));
          }
        }
      } catch (error) {
        console.error("Error loading resume from database:", error);
      } finally {
        if (active) {
          setIsInitialLoaded(true);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [user]);

  // Auto-save when data changes (debounced)
  useEffect(() => {
    if (!isInitialLoaded || !user) return;

    setSaveStatus("saving");
    const timer = setTimeout(async () => {
      try {
        const result = await saveResume({
          title: resumeTitle,
          template_key: selectedTemplate,
          resume_data: resumeData,
        });

        if (result) {
          setSaveStatus("saved");
          setTimeout(() => setSaveStatus("idle"), 2500);
        } else {
          setSaveStatus("error");
        }
      } catch (error) {
        console.error("Error saving resume:", error);
        setSaveStatus("error");
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [resumeData, selectedTemplate, resumeTitle, isInitialLoaded, user]);

  const handleExportPDF = () => {
    document.body.classList.add("printing-resume");
    window.print();
    document.body.classList.remove("printing-resume");
  };

  const handleLogout = async () => {
    await logout();
    navigate("/", { replace: true });
  };

  // Section completion calculator
  const checkSectionCompleted = (id: string): boolean => {
    if (id === "personal") return Boolean(resumeData.personal?.fullName && (resumeData.personal?.email || resumeData.personal?.phone));
    if (id === "summary") return Boolean(typeof resumeData.summary === "string" ? resumeData.summary.trim() : resumeData.summary?.text?.trim());
    if (id === "experience") return Array.isArray(resumeData.experience) && resumeData.experience.length > 0 && Boolean(resumeData.experience[0]?.company || resumeData.experience[0]?.role);
    if (id === "education") return Array.isArray(resumeData.education_list || resumeData.education) && (resumeData.education_list || resumeData.education).length > 0 && Boolean((resumeData.education_list || resumeData.education)[0]?.university || (resumeData.education_list || resumeData.education)[0]?.degree);
    if (id === "skills") return Boolean(resumeData.personal?.skillsText || (Array.isArray(resumeData.skills) && resumeData.skills.length > 0));
    if (id === "projects") return Array.isArray(resumeData.projects) && resumeData.projects.length > 0 && Boolean(resumeData.projects[0]?.name);
    if (id === "certificates") return Array.isArray(resumeData.certificates || resumeData.certifications) && (resumeData.certificates || resumeData.certifications).length > 0 && Boolean((resumeData.certificates || resumeData.certifications)[0]?.title || (resumeData.certificates || resumeData.certifications)[0]?.name);
    if (id === "languages") return Array.isArray(resumeData.languages) && resumeData.languages.length > 0 && Boolean(resumeData.languages[0]?.name);
    return false;
  };

  const completedCount = SIDEBAR_SECTIONS.filter((s) => checkSectionCompleted(s.id)).length;
  const totalCount = SIDEBAR_SECTIONS.length;
  const completenessPercentage = Math.round((completedCount / totalCount) * 100);

  return (
    <div className="flex flex-col h-screen bg-slate-100 text-gray-900 print:bg-white overflow-hidden font-sans">
      {/* ── Top Header Bar ─────────────────────────────────────────── */}
      <header className="border-b border-[#0d2d52] px-4 lg:px-6 py-2.5 flex justify-between items-center bg-[#051C36] text-white sticky top-0 z-50 shadow-md print:hidden">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="p-1.5 rounded-lg hover:bg-white/10 text-[#8ca0b8] hover:text-white transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>

          <img src="/logo-dark-banner.svg" alt="ResUme NoW" className="h-8 object-contain" />

          <div className="h-4 w-px bg-white/15 hidden sm:block mx-2" />

          {/* Editable Resume Title */}
          <div className="relative flex items-center gap-2">
            <Pencil className="h-3.5 w-3.5 text-[#8ca0b8]" />
            {isEditingTitle ? (
              <input
                type="text"
                autoFocus
                value={resumeTitle}
                onChange={(e) => setResumeTitle(e.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(e) => e.key === "Enter" && setIsEditingTitle(false)}
                className="bg-[#0d2d52] border border-[#fc4a27] text-white rounded px-2 py-0.5 text-xs font-semibold focus:outline-none"
              />
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTitle(true)}
                className="text-xs font-bold text-white hover:text-[#fc4a27] transition flex items-center gap-1.5"
              >
                {resumeTitle}
              </button>
            )}

            {/* Template Selector Dropdown Trigger */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTemplateDropdown((v) => !v)}
                className="p-1 rounded text-[#8ca0b8] hover:text-white transition"
                title="Switch Template"
              >
                <ChevronDown className="h-3.5 w-3.5" />
              </button>

              {showTemplateDropdown && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl bg-[#0d2d52] border border-white/10 shadow-xl py-2 z-50">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-[#8ca0b8] uppercase tracking-wider border-b border-white/10 mb-1 flex items-center gap-1">
                    <Layers className="h-3 w-3 text-[#fc4a27]" /> Select Template
                  </div>
                  {TEMPLATE_OPTIONS.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => {
                        setSelectedTemplate(tpl.id);
                        setShowTemplateDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center justify-between hover:bg-white/10 transition ${selectedTemplate === tpl.id ? "text-[#fc4a27] font-bold bg-white/5" : "text-white"
                        }`}
                    >
                      <span>{tpl.name}</span>
                      {selectedTemplate === tpl.id && <Check className="h-3.5 w-3.5 text-[#fc4a27]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 items-center">
          {/* Real-time Save Status Badge */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">
              {saveStatus === "saving" ? "Saving changes..." : "Saved just now"}
            </span>
          </div>

          <button
            type="button"
            onClick={handleExportPDF}
            className="h-9 px-4 bg-[#fc4a27] hover:bg-[#e0401f] text-white rounded-xl font-bold text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
          >
            <Download className="h-4 w-4" />
            <span className="hidden lg:inline">Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="h-9 w-9 flex items-center justify-center rounded-xl text-[#8ca0b8] hover:text-white hover:bg-white/10 transition"
            title="Sign out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ── Main Layout Split ──────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden flex print:block print:overflow-visible">
        {/* ── LEFT PANEL CONTAINER (Dark Sidebar + Form Card) ──────── */}
        <div className="w-[580px] shrink-0 flex h-full print:hidden">
          {/* Subpanel 1: Dark Navy Sidebar (#051C36) */}
          <aside className="w-[240px] shrink-0 bg-[#051C36] p-4 flex flex-col justify-between overflow-y-auto border-r border-[#0d2d52]">
            <div className="space-y-4">
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-[#fc4a27] px-2 pt-1">
                Resume Sections
              </h2>

              <nav className="space-y-1">
                {SIDEBAR_SECTIONS.map((sec) => {
                  const Icon = sec.icon;
                  const isActive = activeSection === sec.id;
                  const isCompleted = checkSectionCompleted(sec.id);

                  return (
                    <button
                      key={sec.id}
                      type="button"
                      onClick={() => setActiveSection(sec.id)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                        ? "bg-[#0d2d52] text-white border-l-[3px] border-[#fc4a27] shadow-xs"
                        : "text-[#8ca0b8] hover:bg-[#0d2d52]/60 hover:text-white"
                        }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`h-4 w-4 shrink-0 ${isActive ? "text-[#fc4a27]" : "text-[#8ca0b8]"}`} />
                        <span className="truncate">{sec.label}</span>
                      </div>
                      {isCompleted ? (
                        <div className="h-4 w-4 rounded-full bg-[#fc4a27]/20 flex items-center justify-center shrink-0">
                          <Check className="h-3 w-3 text-[#fc4a27]" />
                        </div>
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-white/20 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </nav>

              <button
                type="button"
                onClick={() => setActiveSection("personal")}
                className="w-full py-2.5 px-3 rounded-xl border border-dashed border-[#fc4a27]/60 bg-[#0d2d52]/40 text-[#fc4a27] hover:bg-[#0d2d52] transition text-xs font-bold flex items-center justify-center gap-2"
              >
                <Plus className="h-4 w-4" /> Add Custom Section
              </button>
            </div>

            {/* RESUME COMPLETENESS Card Widget */}
            <div className="mt-6 rounded-2xl border border-white/10 bg-[#0d2d52]/80 p-4 space-y-2.5">
              <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#fc4a27]">
                Resume Completeness
              </h3>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-white">{completenessPercentage}%</span>
                <span className="text-[10px] text-[#8ca0b8] font-medium">{completedCount} of {totalCount} completed</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full bg-[#fc4a27] rounded-full transition-all duration-500"
                  style={{ width: `${completenessPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-[#8ca0b8] leading-tight pt-1 flex items-start gap-1">
                <Star className="h-3 w-3 text-[#fc4a27] shrink-0 mt-0.5" />
                Great! Fill in all sections to maximize ATS resume performance.
              </p>
            </div>
          </aside>

          {/* Subpanel 2: White Form Card Panel (flex-1 bg-slate-50) */}
          <div className="flex-1 bg-slate-50 p-5 overflow-y-auto border-r border-gray-200">
            <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs">
              <ResumeSurvey
                data={resumeData}
                updateData={setResumeData}
                selectedTemplate={selectedTemplate}
                activeSection={activeSection}
                setActiveSection={setActiveSection}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL CONTAINER (UNTOUCHED Live Preview) ──────── */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-200/60 flex items-start justify-center print:p-0 print:bg-white print:w-full print:block">
          <div className="w-full max-w-[850px] print:max-w-none">
            <div id="resume-content" className="bg-white rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:border-none">
              <ResumePreview data={resumeData} template={selectedTemplate} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
