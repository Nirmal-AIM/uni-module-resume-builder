import React, { useRef } from "react";
import {
  Plus,
  Trash2,
  User,
  GraduationCap,
  Briefcase,
  Code,
  Languages,
  Award,
  FileText,
  Sparkles,
  Building2,
  Phone,
  Mail,
  Upload,
  Check,
  ChevronRight,
  Trophy,
  Loader2,
} from "lucide-react";
import { generateAISummary, enhanceBulletPoint, suggestSkillsForRole } from "@/services/aiService";

export function ResumeSurvey({
  data = {},
  updateData,
  selectedTemplate,
  activeSection: propActiveSection,
  setActiveSection: propSetActiveSection,
}: {
  data: any;
  updateData: (newData: any) => void;
  selectedTemplate?: string;
  activeSection?: string | null;
  setActiveSection?: (sec: string | null) => void;
}) {
  const activeSection = propActiveSection || "personal";
  const setActiveSection = propSetActiveSection || (() => {});
  const fileInputRef = useRef<HTMLInputElement>(null);

  // AI Feature States
  const [isGeneratingSummary, setIsGeneratingSummary] = React.useState(false);
  const [aiSummaries, setAiSummaries] = React.useState<string[]>([]);
  const [enhancingBulletIdx, setEnhancingBulletIdx] = React.useState<number | null>(null);
  const [isSuggestingSkills, setIsSuggestingSkills] = React.useState(false);

  const handleGenerateSummary = async () => {
    const jobTitle = data.personal?.jobTitle || data.personal?.professionalTitle || "Professional";
    const skills = data.personal?.skillsText || (Array.isArray(data.skills) ? data.skills.join(", ") : "");
    setIsGeneratingSummary(true);
    try {
      const results = await generateAISummary(jobTitle, skills);
      setAiSummaries(results);
      if (results[0]) {
        updateData({ ...data, summary: { text: results[0] } });
      }
    } catch (err) {
      console.error("AI Summary error:", err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  const handleEnhanceBullet = async (index: number, exp: any) => {
    const role = exp.role || exp.position || data.personal?.jobTitle || "Professional";
    const company = exp.company || "Company";
    const currentDesc = exp.desc || exp.description || "";
    if (!currentDesc.trim()) return;

    setEnhancingBulletIdx(index);
    try {
      const enhanced = await enhanceBulletPoint(role, company, currentDesc);
      handleArrayChange("experience", index, "desc", enhanced);
      handleArrayChange("experience", index, "description", enhanced);
    } catch (err) {
      console.error("Enhance bullet error:", err);
    } finally {
      setEnhancingBulletIdx(null);
    }
  };

  const handleSuggestSkills = async () => {
    const jobTitle = data.personal?.jobTitle || data.personal?.professionalTitle || "Professional";
    setIsSuggestingSkills(true);
    try {
      const suggested = await suggestSkillsForRole(jobTitle);
      const existing = data.personal?.skillsText ? data.personal.skillsText.split(",").map((s: string) => s.trim()) : [];
      const merged = Array.from(new Set([...existing, ...suggested])).filter(Boolean).join(", ");
      handleChange("personal", "skillsText", merged);
      updateData({
        ...data,
        personal: { ...(data.personal || {}), skillsText: merged },
        skills: merged.split(",").map((s: string) => s.trim()).filter(Boolean),
      });
    } catch (err) {
      console.error("Suggest skills error:", err);
    } finally {
      setIsSuggestingSkills(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    updateData({
      ...data,
      [section]: {
        ...(data[section] || {}),
        [field]: value,
      },
    });
  };

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleChange("personal", "profileImage", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleArrayChange = (section: string, index: number, field: string, value: any) => {
    const currentArray = data[section] || [];
    const newArray = [...currentArray];
    if (!newArray[index]) newArray[index] = {};
    newArray[index] = { ...newArray[index], [field]: value };
    updateData({ ...data, [section]: newArray });
  };

  const addItem = (section: string) => {
    updateData({
      ...data,
      [section]: [...(data[section] || []), {}],
    });
  };

  const removeItem = (section: string, index: number) => {
    const newArray = [...(data[section] || [])];
    newArray.splice(index, 1);
    updateData({ ...data, [section]: newArray });
  };

  const renderHeader = (title: string, subtitle?: string, icon?: React.ReactNode) => (
    <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-100">
      <div className="h-11 w-11 rounded-full bg-[#fc4a27] text-white flex items-center justify-center shrink-0 shadow-sm">
        {icon || <User className="h-5 w-5" />}
      </div>
      <div>
        <h2 className="text-lg font-extrabold text-[#051C36] tracking-tight">{title}</h2>
        {subtitle && <p className="text-xs text-gray-500 font-medium">{subtitle}</p>}
      </div>
    </div>
  );

  const renderBottomActions = (nextSectionId?: string) => (
    <div className="flex items-center justify-between pt-6 border-t border-gray-100 mt-6">
      <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-semibold">
        <Check className="h-4 w-4" />
        <span>Auto-saved just now</span>
      </div>

      <button
        type="button"
        onClick={() => {
          if (nextSectionId) {
            setActiveSection(nextSectionId);
          } else {
            setActiveSection("personal");
          }
        }}
        className="bg-[#fc4a27] hover:bg-[#e0401f] text-white font-bold rounded-xl px-5 py-2.5 text-xs flex items-center gap-2 shadow-sm transition active:scale-95"
      >
        <span>Save & Continue</span>
        <ChevronRight className="h-4 w-4" />
      </button>
    </div>
  );

  return (
    <div className="w-full">
      {/* ── 1. Personal Information ────────────────────────────── */}
      {activeSection === "personal" && (
        <div className="space-y-4">
          {renderHeader("Personal Information", "Add your basic details and contact information.", <User className="h-5 w-5" />)}

          {/* Profile Photo Upload Field */}
          <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-200 flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3 min-w-0">
              {data.personal?.profileImage ? (
                <img
                  src={data.personal.profileImage}
                  alt="Profile"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#fc4a27] shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0 text-[#fc4a27]">
                  <User className="h-6 w-6" />
                </div>
              )}
              <div className="min-w-0">
                <p className="text-xs font-bold text-gray-900">Profile Photo</p>
                <p className="text-[11px] text-gray-500 truncate">Stored safely in database with your resume</p>
              </div>
            </div>
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleProfileImageUpload}
              className="hidden"
            />

            <div className="flex items-center gap-2 shrink-0">
              {data.personal?.profileImage && (
                <button
                  type="button"
                  onClick={() => handleChange("personal", "profileImage", null)}
                  className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg text-xs"
                  title="Remove Photo"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-[#fc4a27] hover:bg-[#e0401f] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-xs transition"
              >
                <Upload className="h-3.5 w-3.5" />
                {data.personal?.profileImage ? "Change" : "Upload"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Full Name</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
                placeholder="e.g. Nirmal Kollipara"
                value={data.personal?.fullName || ""}
                onChange={(e) => handleChange("personal", "fullName", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Professional Title</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
                placeholder="e.g. AI & Machine Learning Engineer"
                value={data.personal?.jobTitle || ""}
                onChange={(e) => handleChange("personal", "jobTitle", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Email</label>
              <input
                type="email"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
                placeholder="nirmal.kollipara@example.com"
                value={data.personal?.email || ""}
                onChange={(e) => handleChange("personal", "email", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">Phone</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
                placeholder="+91 98765 43210"
                value={data.personal?.phone || ""}
                onChange={(e) => handleChange("personal", "phone", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-gray-800">Location</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
              placeholder="Visakhapatnam, Andhra Pradesh, India"
              value={data.personal?.location ?? data.personal?.address ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateData({
                  ...data,
                  personal: {
                    ...(data.personal || {}),
                    location: val,
                    address: val,
                  },
                });
              }}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">LinkedIn URL</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
                placeholder="linkedin.com/in/nirmalkollipara"
                value={data.personal?.linkedin || ""}
                onChange={(e) => handleChange("personal", "linkedin", e.target.value)}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-800">GitHub URL</label>
              <input
                type="text"
                className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
                placeholder="github.com/nirmalkollipara"
                value={data.personal?.github || ""}
                onChange={(e) => handleChange("personal", "github", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-bold text-gray-800">Portfolio / Website</label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:border-[#fc4a27] focus:outline-none transition"
              placeholder="nirmalkollipara.dev"
              value={data.personal?.website ?? data.personal?.portfolio ?? ""}
              onChange={(e) => {
                const val = e.target.value;
                updateData({
                  ...data,
                  personal: {
                    ...(data.personal || {}),
                    website: val,
                    portfolio: val,
                  },
                });
              }}
            />
          </div>

          {renderBottomActions("summary")}
        </div>
      )}

      {/* ── 2. Professional Summary ───────────────────────────── */}
      {activeSection === "summary" && (
        <div className="space-y-4">
          {renderHeader("Professional Summary", "Summarize your career experience and core strengths.", <FileText className="h-5 w-5" />)}

          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-gray-800">Summary Statement</label>
            <button
              type="button"
              onClick={handleGenerateSummary}
              disabled={isGeneratingSummary}
              className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#fc4a27] border border-orange-200/60 hover:bg-orange-100 transition active:scale-95 disabled:opacity-50"
            >
              {isGeneratingSummary ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  Generate with AI
                </>
              )}
            </button>
          </div>

          <textarea
            rows={5}
            className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none transition leading-relaxed shadow-2xs"
            placeholder="Results-driven Engineer with 5+ years of experience building scalable applications..."
            value={typeof data.summary === "string" ? data.summary : data.summary?.text || ""}
            onChange={(e) => {
              handleChange("summary", "text", e.target.value);
              updateData({ ...data, summary: { text: e.target.value } });
            }}
          />

          {/* AI Options Picker */}
          {aiSummaries.length > 1 && (
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-700 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#fc4a27]" /> Select an AI Generated Variation:
              </span>
              <div className="space-y-2">
                {aiSummaries.map((summaryText, idx) => (
                  <div
                    key={idx}
                    onClick={() => updateData({ ...data, summary: { text: summaryText } })}
                    className="p-3 bg-gray-50 hover:bg-orange-50/50 border border-gray-200 hover:border-[#fc4a27]/40 rounded-xl text-xs text-gray-700 cursor-pointer transition flex items-start justify-between gap-2"
                  >
                    <span>{summaryText}</span>
                    <span className="shrink-0 text-[10px] font-bold text-[#fc4a27] bg-white px-2 py-0.5 rounded border border-orange-100">Use</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {renderBottomActions("experience")}
        </div>
      )}

      {/* ── 3. Experience ──────────────────────────────────────── */}
      {activeSection === "experience" && (
        <div className="space-y-4">
          {renderHeader("Work Experience", "Add your relevant professional positions.", <Briefcase className="h-5 w-5" />)}

          <div className="space-y-4">
            {(data.experience || [{}]).map((exp: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                  <h3 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-[#fc4a27]" /> Position {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem("experience", index)}
                    className="text-red-500 p-1 hover:bg-red-50 rounded-lg text-xs"
                    title="Remove position"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Company Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. Google"
                      value={exp.company || ""}
                      onChange={(e) => handleArrayChange("experience", index, "company", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Job Title / Role</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. Senior Software Engineer"
                      value={exp.role || exp.position || ""}
                      onChange={(e) => {
                        handleArrayChange("experience", index, "role", e.target.value);
                        handleArrayChange("experience", index, "position", e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Start Date</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. Jan 2022"
                      value={exp.from || exp.startDate || ""}
                      onChange={(e) => handleArrayChange("experience", index, "from", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">End Date</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. Present"
                      value={exp.to || exp.endDate || ""}
                      onChange={(e) => handleArrayChange("experience", index, "to", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[11px] font-bold text-gray-700">Key Achievements / Description</label>
                    <button
                      type="button"
                      onClick={() => handleEnhanceBullet(index, exp)}
                      disabled={enhancingBulletIdx === index || !(exp.desc || exp.description)}
                      className="flex items-center gap-1 text-[11px] font-bold text-[#fc4a27] hover:text-[#e0401f] bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100 transition disabled:opacity-40"
                    >
                      {enhancingBulletIdx === index ? (
                        <>
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Enhancing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-3 w-3" />
                          Enhance with AI
                        </>
                      )}
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none shadow-2xs"
                    placeholder="Bullet points of key accomplishments..."
                    value={exp.desc || exp.description || ""}
                    onChange={(e) => {
                      handleArrayChange("experience", index, "desc", e.target.value);
                      handleArrayChange("experience", index, "description", e.target.value);
                    }}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("experience")}
              className="w-full py-2.5 border border-dashed border-[#fc4a27] text-[#fc4a27] hover:bg-orange-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" /> Add Work Experience
            </button>
          </div>

          {renderBottomActions("education")}
        </div>
      )}

      {/* ── 4. Education ───────────────────────────────────────── */}
      {activeSection === "education" && (
        <div className="space-y-4">
          {renderHeader("Education", "Add your academic degrees and educational history.", <GraduationCap className="h-5 w-5" />)}

          <div className="space-y-4">
            {(data.education_list || data.education || [{}]).map((edu: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                  <h3 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    <GraduationCap className="h-3.5 w-3.5 text-[#fc4a27]" /> Education {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem("education_list", index)}
                    className="text-red-500 p-1 hover:bg-red-50 rounded-lg text-xs"
                    title="Remove education"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">University / Institution</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                    placeholder="e.g. Stanford University"
                    value={edu.university || edu.institution || ""}
                    onChange={(e) => handleArrayChange("education_list", index, "university", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Degree / Field of Study</label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                    placeholder="e.g. B.S. in Computer Science"
                    value={edu.degree || ""}
                    onChange={(e) => handleArrayChange("education_list", index, "degree", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Start Date</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. 2018"
                      value={edu.from || edu.startDate || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "from", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Graduation Date</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. 2022"
                      value={edu.to || edu.endDate || ""}
                      onChange={(e) => handleArrayChange("education_list", index, "to", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("education_list")}
              className="w-full py-2.5 border border-dashed border-[#fc4a27] text-[#fc4a27] hover:bg-orange-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" /> Add Education
            </button>
          </div>

          {renderBottomActions("skills")}
        </div>
      )}

      {/* ── 5. Skills ──────────────────────────────────────────── */}
      {activeSection === "skills" && (
        <div className="space-y-4">
          {renderHeader("Skills", "List your core technical and professional skills.", <Sparkles className="h-5 w-5" />)}

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-800">Skills (Separated by commas)</label>
              <button
                type="button"
                onClick={handleSuggestSkills}
                disabled={isSuggestingSkills}
                className="flex items-center gap-1.5 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-bold text-[#fc4a27] border border-orange-200/60 hover:bg-orange-100 transition active:scale-95 disabled:opacity-50"
              >
                {isSuggestingSkills ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5" />
                    Suggest AI Skills
                  </>
                )}
              </button>
            </div>
            <textarea
              rows={5}
              className="w-full p-3.5 bg-white border border-gray-200 rounded-xl text-xs text-gray-900 focus:border-[#fc4a27] focus:outline-none transition leading-relaxed shadow-2xs"
              placeholder="e.g. React, TypeScript, Python, Node.js, AWS, System Architecture, Leadership"
              value={data.personal?.skillsText || (Array.isArray(data.skills) ? data.skills.join(", ") : "")}
              onChange={(e) => handleChange("personal", "skillsText", e.target.value)}
            />
          </div>

          {renderBottomActions("projects")}
        </div>
      )}

      {/* ── 6. Projects ────────────────────────────────────────── */}
      {activeSection === "projects" && (
        <div className="space-y-4">
          {renderHeader("Projects", "Add key personal or professional projects.", <Code className="h-5 w-5" />)}

          <div className="space-y-4">
            {(data.projects || [{}]).map((proj: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                  <h3 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    <Code className="h-3.5 w-3.5 text-[#fc4a27]" /> Project {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem("projects", index)}
                    className="text-red-500 p-1 hover:bg-red-50 rounded-lg text-xs"
                    title="Remove project"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Project Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. AI Resume Builder"
                      value={proj.name || ""}
                      onChange={(e) => handleArrayChange("projects", index, "name", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Technologies Used</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. React, Supabase, Tailwind"
                      value={proj.role || proj.technologies || ""}
                      onChange={(e) => handleArrayChange("projects", index, "role", e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-gray-700">Description</label>
                  <textarea
                    rows={3}
                    className="w-full p-3 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                    placeholder="Overview of project features and achievements..."
                    value={proj.desc || proj.description || ""}
                    onChange={(e) => {
                      handleArrayChange("projects", index, "desc", e.target.value);
                      handleArrayChange("projects", index, "description", e.target.value);
                    }}
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("projects")}
              className="w-full py-2.5 border border-dashed border-[#fc4a27] text-[#fc4a27] hover:bg-orange-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" /> Add Project
            </button>
          </div>

          {renderBottomActions("certificates")}
        </div>
      )}

      {/* ── 7. Certifications ──────────────────────────────────── */}
      {activeSection === "certificates" && (
        <div className="space-y-4">
          {renderHeader("Certifications", "Add professional certifications and credentials.", <Award className="h-5 w-5" />)}

          <div className="space-y-4">
            {(data.certificates || [{}]).map((cert: any, index: number) => (
              <div key={index} className="p-4 bg-gray-50/70 border border-gray-200 rounded-2xl space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-gray-200/60">
                  <h3 className="font-bold text-xs text-gray-800 flex items-center gap-1.5">
                    <Award className="h-3.5 w-3.5 text-[#fc4a27]" /> Certification {index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => removeItem("certificates", index)}
                    className="text-red-500 p-1 hover:bg-red-50 rounded-lg text-xs"
                    title="Remove certification"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Certificate Name</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. AWS Certified Solutions Architect"
                      value={cert.title || cert.name || ""}
                      onChange={(e) => handleArrayChange("certificates", index, "title", e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-gray-700">Issuing Organization</label>
                    <input
                      type="text"
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                      placeholder="e.g. Amazon Web Services"
                      value={cert.issuer || cert.org || ""}
                      onChange={(e) => handleArrayChange("certificates", index, "issuer", e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("certificates")}
              className="w-full py-2.5 border border-dashed border-[#fc4a27] text-[#fc4a27] hover:bg-orange-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" /> Add Certification
            </button>
          </div>

          {renderBottomActions("languages")}
        </div>
      )}

      {/* ── 8. Languages ───────────────────────────────────────── */}
      {activeSection === "languages" && (
        <div className="space-y-4">
          {renderHeader("Languages", "List spoken and written languages.", <Languages className="h-5 w-5" />)}

          <div className="space-y-3">
            {(data.languages || [{}]).map((lang: any, index: number) => (
              <div key={index} className="flex gap-3 items-center bg-gray-50/70 p-3 border border-gray-200 rounded-xl">
                <input
                  type="text"
                  className="flex-1 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                  placeholder="Language (e.g. English)"
                  value={lang.name || ""}
                  onChange={(e) => handleArrayChange("languages", index, "name", e.target.value)}
                />
                <input
                  type="text"
                  className="w-32 px-3 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:border-[#fc4a27] focus:outline-none"
                  placeholder="Level (Native/Fluent)"
                  value={lang.level || ""}
                  onChange={(e) => handleArrayChange("languages", index, "level", e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => removeItem("languages", index)}
                  className="text-red-500 p-1.5 hover:bg-red-50 rounded-lg text-xs shrink-0"
                  title="Remove language"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={() => addItem("languages")}
              className="w-full py-2.5 border border-dashed border-[#fc4a27] text-[#fc4a27] hover:bg-orange-50/50 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus className="h-4 w-4" /> Add Language
            </button>
          </div>

          {renderBottomActions("personal")}
        </div>
      )}
    </div>
  );
}
