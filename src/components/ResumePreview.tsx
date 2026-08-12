import React from "react";
import { Mail, Phone, MapPin } from "lucide-react";

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>;
}

export function ResumePreview({ data = {}, template = "modern" }: { data: any; template?: string }) {
  const safeData = data || {};
  const personal = safeData.personal || {};

  const skills = personal.skillsText
    ? personal.skillsText.split(",").map((s: string) => s.trim()).filter(Boolean)
    : Array.isArray(safeData.skills)
    ? safeData.skills
    : [];
  
  const experiences = Array.isArray(safeData.experience) ? safeData.experience : [];
  const educations = Array.isArray(safeData.education_list)
    ? safeData.education_list
    : Array.isArray(safeData.education)
    ? safeData.education.map((e: any) => ({
        university: e.institution || e.university || '',
        degree: e.degree + (e.fieldOfStudy ? ` in ${e.fieldOfStudy}` : ''),
        from: e.startDate || e.from || '',
        to: e.current ? 'Present' : (e.endDate || e.to || ''),
        gpa: e.gpa || '',
      }))
    : [];
  
  const projects = Array.isArray(safeData.projects) ? safeData.projects : [];
  const languages = Array.isArray(safeData.languages) ? safeData.languages : [];
  const certificates = Array.isArray(safeData.certificates)
    ? safeData.certificates
    : Array.isArray(safeData.certifications)
    ? safeData.certifications.map((c: any) => ({
        title: c.name || c.title || '',
        issuer: c.issuer || '',
        date: c.issueDate || c.date || '',
      }))
    : [];

  const summaryText = typeof safeData.summary === 'string'
    ? safeData.summary
    : safeData.summary?.text || '';

  // Helper to render sections only if they have data
  const hasData = (arr: any[]) => arr && arr.length > 0 && Object.values(arr[0] || {}).some((v) => v !== "" && v !== null && v !== undefined);

  // Template Styles: modern-blue (Executive Navy / Richard Sanchez)
  if (template === "modern-blue" || template === "executive-navy" || template === "executive navy" || template === "richard-sanchez") {
    const fullNameVal = (personal.fullName || personal.name || personal.full_name || personal.title || "RICHARD SANCHEZ").trim();
    const nameParts = fullNameVal.split(" ");
    const firstName = nameParts[0] || "RICHARD";
    const lastName = nameParts.slice(1).join(" ") || (fullNameVal !== "RICHARD SANCHEZ" ? "" : "SANCHEZ");
    const jobTitleVal = personal.jobTitle || personal.professionalTitle || personal.job_title || personal.role || "Marketing Manager";

    return (
      <Card className="min-h-[1123px] w-full bg-white shadow-none overflow-hidden text-black p-0 grid grid-cols-[35%_65%] aspect-[1/1.414]" key={JSON.stringify(safeData)}>
        {/* Left Sidebar - Blue */}
        <div className="bg-[#1a365d] text-white p-8 flex flex-col gap-8 min-h-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-white/10 mb-4 overflow-hidden flex items-center justify-center">
              {personal.profileImage ? (
                <img
                  src={personal.profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl opacity-20 font-bold">{firstName[0] || "U"}</span>
              )}
            </div>
          </div>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">Contact</h2>
            <ul className="space-y-3 text-xs opacity-90">
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 shrink-0" /> {personal.phone || "+123-456-7890"}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 shrink-0" /> {personal.email || "hello@reallygreatsite.com"}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3 w-3 shrink-0" /> {personal.address || personal.location || "123 Anywhere St., Any City"}
              </li>
            </ul>
          </section>

          {hasData(educations) && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">
                Education
              </h2>
              <div className="space-y-4">
                {educations.map((edu: any, idx: number) => (
                  <div key={idx}>
                    <p className="text-xs font-bold">
                      {edu.from} - {edu.to || "Present"}
                    </p>
                    <p className="text-xs font-bold uppercase">{edu.university || "University Name"}</p>
                    <p className="text-[10px] opacity-80">{edu.degree || "Degree Title"}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">Skills</h2>
              <ul className="grid grid-cols-1 gap-2 text-[10px] opacity-90 list-disc pl-4">
                {skills.map((skill: string, idx: number) => (
                  <li key={idx}>{skill}</li>
                ))}
              </ul>
            </section>
          )}

          {hasData(languages) && (
            <section>
              <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">
                Languages
              </h2>
              <ul className="space-y-1 text-[10px] opacity-90">
                {languages.map((lang: any, idx: number) => (
                  <li key={idx} className="flex justify-between">
                    <span>{lang.name}</span>
                    <span className="opacity-60 italic">({lang.level})</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Side - White Main Content */}
        <div className="p-10 bg-white">
          <header className="mb-10">
            <h1 className="text-5xl font-bold text-[#2d3748] mb-1">
              <span className="font-extrabold">{firstName}</span>{" "}
              <span className="font-light">{lastName}</span>
            </h1>
            <p className="text-xl tracking-[0.2em] text-gray-500 uppercase">
              {jobTitleVal}
            </p>
            <div className="w-16 h-1 bg-gray-400 mt-4"></div>
          </header>

          {summaryText && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#1a365d] uppercase tracking-wider mb-2 border-b-2 border-gray-100 pb-1">
                Profile
              </h2>
              <p className="text-xs leading-relaxed text-gray-600 italic">{summaryText}</p>
            </section>
          )}

          {hasData(experiences) && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#1a365d] uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-1">
                Work Experience
              </h2>
              <div className="space-y-6 relative border-l-2 border-gray-100 pl-6 ml-1">
                {experiences.map((exp: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full bg-[#1a365d] border-4 border-white"></div>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-800">{exp.company || "Company Name"}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {exp.from || exp.startDate} - {exp.to || (exp.current ? "Present" : exp.endDate) || "Present"}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                      {exp.role || "Job Position"}
                    </p>
                    <p className="text-[10px] leading-relaxed text-gray-600">
                      {exp.desc || exp.description || "Developed and executed comprehensive strategies to achieve business objectives."}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasData(projects) && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#1a365d] uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-800">{proj.name}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {proj.from || proj.startDate} - {proj.to || proj.endDate || "Present"}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-2 italic">{proj.role || proj.technologies}</p>
                    <p className="text-[10px] leading-relaxed text-gray-600">{proj.desc || proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasData(certificates) && (
            <section>
              <h2 className="text-lg font-bold text-[#1a365d] uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-1">
                Certificates
              </h2>
              <div className="space-y-3">
                {certificates.map((cert: any, idx: number) => (
                  <div key={idx}>
                    <h3 className="font-bold text-gray-800 text-xs">{cert.title || cert.name}</h3>
                    {cert.issuer && <p className="text-[10px] text-gray-500">{cert.issuer}</p>}
                    {cert.date && <p className="text-[10px] text-gray-400">{cert.date}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </Card>
    );
  }

  // Template Styles: minimalist-orange (Warm Terracotta / Zola Bekker)
  if (template === "minimalist-orange" || template === "warm-terracotta" || template === "warm terracotta" || template === "zola-bekker") {
    return (
      <Card className="min-h-[1123px] w-full bg-white p-16 shadow-none text-black flex flex-col gap-10 font-serif aspect-[1/1.414]">
        {/* Header Section */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl text-[#c05621] font-medium italic">{personal.fullName || "Zola Bekker"}</h1>
            <p className="text-xs tracking-[0.2em] uppercase mt-2 font-sans font-bold text-gray-700">
              {personal.jobTitle || personal.professionalTitle || "Marketing Strategist"}
            </p>
          </div>
          <div className="text-[10px] text-right space-y-1 font-sans">
            <p><strong>Phone:</strong> {personal.phone || "+123-456-7890"}</p>
            <p><strong>Email:</strong> {personal.email || "hello@reallygreatsite.com"}</p>
            <p><strong>Address:</strong> {personal.address || personal.location || "123 Anywhere St., Any City"}</p>
          </div>
        </header>

        {summaryText && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Professional Summary</h2>
            <p className="text-xs leading-relaxed font-sans text-gray-800">{summaryText}</p>
          </section>
        )}

        {hasData(experiences) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Work Experience</h2>
            <div className="space-y-6 font-sans">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xs font-bold">
                      {exp.role || "Role"} | {exp.from || exp.startDate} - {exp.to || (exp.current ? "Present" : exp.endDate) || "Present"}
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-2">{exp.company || "Company Name"}</p>
                  <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-medium leading-relaxed">
                    <li>
                      {exp.desc || exp.description || "Led the development and implementation of key strategies that increased efficiency and performance."}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(educations) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Academic History</h2>
            <div className="grid grid-cols-2 gap-8 font-sans">
              {educations.map((edu: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {edu.university || "University Name"} | {edu.from} - {edu.to || "Present"}
                  </h3>
                  <p className="text-[10px] text-gray-600 mb-2">{edu.degree || "Master of Marketing"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(projects) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Projects</h2>
            <div className="space-y-6 font-sans">
              {projects.map((proj: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {proj.name} | {proj.from || proj.startDate} - {proj.to || proj.endDate || "Present"}
                  </h3>
                  <p className="text-[10px] text-gray-600 mb-2">{proj.role || proj.technologies}</p>
                  <p className="text-[10px] leading-relaxed text-gray-800">{proj.desc || proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(certificates) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Certificates</h2>
            <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-sans">
              {certificates.map((cert: any, idx: number) => (
                <li key={idx}>{cert.title || cert.name}</li>
              ))}
            </ul>
          </section>
        )}
      </Card>
    );
  }

  // Template Styles: clean-teal (Drew Feig / Clean Modern)
  if (template === "clean-teal" || template === "clean-modern" || template === "clean teal" || template === "drew-feig") {
    return (
      <Card className="min-h-[1123px] w-full bg-white p-12 shadow-none text-black font-sans aspect-[1/1.414]">
        <header className="flex justify-between items-center mb-12 border-b-2 border-gray-50 pb-6">
          <h1 className="text-4xl font-bold text-[#2c7a7b] tracking-tight">
            {(personal.fullName || "DREW FEIG").toUpperCase()}
          </h1>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            {personal.jobTitle || personal.professionalTitle || "Marketing Specialist"}
          </p>
        </header>

        <div className="flex justify-between text-[10px] text-gray-600 mb-10 border-b border-gray-100 pb-4">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-[#2c7a7b]" /> {personal.email || "hello@reallygreatsite.com"}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-[#2c7a7b]" /> {personal.phone || "+123-456-7890"}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#2c7a7b]" /> {personal.address || personal.location || "123 Anywhere St., Any City"}
          </span>
        </div>

        {summaryText && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Profile Summary</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <p className="text-xs leading-relaxed text-gray-700">{summaryText}</p>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Professional Skills</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <ul className="grid grid-cols-2 gap-y-2 text-xs">
              {skills.map((skill: string, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#2c7a7b]"></div>
                  {skill}
                </li>
              ))}
            </ul>
          </section>
        )}

        {hasData(experiences) && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Work Experience</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <div className="space-y-6">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xs font-bold">{exp.role || "Marketing Strategist"}</h3>
                    <span className="text-[10px] italic text-[#2c7a7b]">
                      {exp.from || exp.startDate} - {exp.to || (exp.current ? "Present" : exp.endDate) || "Present"}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-800 mb-2">{exp.company || "Company Name"}</p>
                  <p className="text-[10px] leading-relaxed text-gray-600">
                    {exp.desc || exp.description || "Propel works with clients to create effective strategies."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(projects) && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Projects</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <div className="space-y-6">
              {projects.map((proj: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xs font-bold">{proj.name}</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {proj.from || proj.startDate} - {proj.to || proj.endDate || "Present"}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 mb-2 italic">{proj.role || proj.technologies}</p>
                  <p className="text-[10px] leading-relaxed text-gray-600">{proj.desc || proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(certificates) && (
          <section>
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Certificates</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <ul className="grid grid-cols-2 gap-y-2 text-xs">
              {certificates.map((cert: any, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#2c7a7b]"></div>
                  {cert.title || cert.name}
                </li>
              ))}
            </ul>
          </section>
        )}
      </Card>
    );
  }

  // Template Styles: bold-black (Laurice Moretti / Bold Minimal)
  if (template === "bold-black" || template === "bold-minimal" || template === "bold systems" || template === "laurice-moretti") {
    return (
      <Card className="min-h-[1123px] w-full bg-white p-16 shadow-none text-black font-sans aspect-[1/1.414]">
        <header className="mb-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">
            {(personal.fullName || "LAURICE MORETTI").toUpperCase()}
          </h1>
          <p className="text-xl font-bold uppercase tracking-[0.2em] text-gray-800">
            {personal.jobTitle || personal.professionalTitle || "Systems Designer"}
          </p>
        </header>

        {summaryText && (
          <section className="mb-10">
            <h2 className="text-base font-black uppercase tracking-wider mb-3">Professional Summary</h2>
            <p className="text-xs leading-relaxed text-gray-800 font-medium">{summaryText}</p>
          </section>
        )}

        {hasData(educations) && (
          <section className="mb-10">
            <h2 className="text-base font-black uppercase tracking-wider mb-4 border-t-2 border-black pt-4">
              Academic History
            </h2>
            <div className="space-y-4">
              {educations.map((edu: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {edu.university || "North State University"} | {edu.from} - {edu.to || "Present"}
                  </h3>
                  <p className="text-[10px] font-medium text-gray-600">{edu.degree || "Master of Systems Design"}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(projects) && (
          <section className="mb-10">
            <h2 className="text-base font-black uppercase tracking-wider mb-4 border-t-2 border-black pt-4">
              Projects
            </h2>
            <div className="space-y-6">
              {projects.map((proj: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {proj.name} | {proj.from || proj.startDate} - {proj.to || proj.endDate || "Present"}
                  </h3>
                  <p className="text-[10px] font-medium text-gray-600 mb-1">{proj.role || proj.technologies}</p>
                  <p className="text-[10px] leading-relaxed text-gray-800">{proj.desc || proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(certificates) && (
          <section>
            <h2 className="text-base font-black uppercase tracking-wider mb-4 border-t-2 border-black pt-4">
              Certificates
            </h2>
            <div className="flex flex-wrap gap-x-8 gap-y-2">
              {certificates.map((cert: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">{cert.title || cert.name}</h3>
                </div>
              ))}
            </div>
          </section>
        )}
      </Card>
    );
  }

  // ── ATS-6: ATS Graduate / Student Resume Template ──
  if (template === "ats-6" || template === "ats6") {
    const fullNameVal = (personal.fullName || personal.name || personal.full_name || "Your Full Name").trim();
    const jobTitleVal = personal.jobTitle || personal.professionalTitle || "Software Engineer / Student";

    return (
      <Card className="min-h-[1123px] w-full bg-white p-12 shadow-none text-gray-900 font-sans aspect-[1/1.414]">
        <header className="border-b-2 border-indigo-900 pb-4 mb-6 text-center">
          <h1 className="text-3xl font-extrabold text-indigo-950 uppercase tracking-tight">{fullNameVal}</h1>
          <p className="text-sm font-bold text-indigo-700 tracking-wider uppercase mt-1">{jobTitleVal}</p>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs text-gray-600 mt-2 font-medium">
            {personal.email && <span>Email: {personal.email}</span>}
            {personal.phone && <span>Phone: {personal.phone}</span>}
            {personal.github && <span>GitHub: {personal.github}</span>}
            {personal.linkedin && <span>LinkedIn: {personal.linkedin}</span>}
          </div>
        </header>

        {/* Profile / Professional Summary */}
        {Boolean(summaryText || safeData.summary?.text || safeData.summary?.summary || (typeof safeData.summary === 'string' ? safeData.summary : '')) && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-2">
              Professional Summary
            </h2>
            <p className="text-xs text-gray-700 leading-relaxed font-normal">
              {summaryText || safeData.summary?.text || safeData.summary?.summary || (typeof safeData.summary === 'string' ? safeData.summary : '')}
            </p>
          </section>
        )}

        {/* Education First for College Students */}
        {hasData(educations) && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-2">
              Education & Academic Background
            </h2>
            <div className="space-y-2">
              {educations.map((edu: any, idx: number) => (
                <div key={idx} className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-xs font-bold text-gray-900">{edu.university || "College / University Name"}</h3>
                    <p className="text-xs text-gray-700">{edu.degree} {edu.gpa ? `| GPA: ${edu.gpa}` : ''}</p>
                  </div>
                  <span className="text-[11px] font-bold text-indigo-700">{edu.from} – {edu.to || "Present"}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-2">
              Technical & Core Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((s: string, idx: number) => (
                <span key={idx} className="bg-indigo-50 border border-indigo-100 text-indigo-900 px-2 py-0.5 rounded text-[11px] font-semibold">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasData(projects) && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-3">
              Academic & Personal Projects
            </h2>
            <div className="space-y-3">
              {projects.map((proj: any, idx: number) => (
                <div key={idx} className="p-3 bg-gray-50 border border-gray-200 rounded-xl">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-indigo-950">{proj.name}</h3>
                    <span className="text-[10px] text-gray-500 font-bold">{proj.from || proj.startDate} – {proj.to || proj.endDate || "Present"}</span>
                  </div>
                  {proj.role && <p className="text-[10px] font-bold text-indigo-600">{proj.role}</p>}
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">{proj.desc || proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(experiences) && (
          <section className="mb-6">
            <h2 className="text-xs font-bold uppercase tracking-wider text-indigo-950 border-b border-indigo-200 pb-1 mb-3">
              Internship & Work Experience
            </h2>
            <div className="space-y-3">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-xs font-bold text-gray-900">{exp.role} <span className="font-normal text-gray-500">at</span> {exp.company}</h3>
                    <span className="text-[11px] font-semibold text-gray-600">{exp.from} – {exp.to || "Present"}</span>
                  </div>
                  <p className="text-xs text-gray-700 mt-1 leading-relaxed">{exp.desc || exp.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}
      </Card>
    );
  }

  // Fallback / Standard Templates: modern, minimal, academic
  const isMinimal = template === "minimal";
  const isModern = template === "modern";

  return (
    <Card className="min-h-[1123px] w-full bg-white p-12 shadow-none overflow-y-auto text-black aspect-[1/1.414]">
      <div className={`max-w-[800px] mx-auto ${isMinimal ? "text-center" : ""}`}>
        <header className={`mb-8 pb-6 ${isModern ? "border-b-2 border-blue-600" : "border-b border-gray-200"}`}>
          <h1 className={`font-bold uppercase tracking-tight ${isModern ? "text-4xl text-blue-600" : "text-3xl"}`}>
            {personal.fullName || "Your Name"}
          </h1>
          <p className={`text-lg font-medium mt-1 uppercase tracking-wide ${isModern ? "text-blue-700" : "text-gray-700"}`}>
            {personal.jobTitle || personal.professionalTitle || "Job Title"}
          </p>
          <div className={`text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1 ${isMinimal ? "justify-center" : "justify-start"}`}>
            {personal.email && <span className="text-sm">{personal.email}</span>}
            {personal.phone && <span className="text-sm">{personal.phone}</span>}
            {(personal.location || personal.address) && <span className="text-sm">{personal.location || personal.address}</span>}
          </div>
        </header>

        {summaryText && (
          <section className="mb-8">
            <h2 className={`text-lg font-bold mb-2 uppercase tracking-widest ${isModern ? "text-blue-600 border-b border-blue-200 pb-1" : "text-gray-900 border-b pb-1"}`}>
              Professional Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{summaryText}</p>
          </section>
        )}

        {hasData(educations) && (
          <section className="mb-8">
            <h2 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isModern ? "text-blue-600 border-b border-blue-200 pb-1" : "text-gray-900 border-b pb-1"}`}>
              Education
            </h2>
            <div className="space-y-4">
              {educations.map((edu: any, idx: number) => (
                <div key={idx} className={isMinimal ? "text-center" : ""}>
                  <div className={`flex justify-between items-baseline ${isMinimal ? "flex-col items-center" : ""}`}>
                    <h3 className="font-bold">{edu.university || "University Name"}</h3>
                    <span className="text-sm text-gray-500">
                      {edu.from} - {edu.to || "Present"}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{edu.degree}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(experiences) && (
          <section className="mb-8 text-left">
            <h2 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isModern ? "text-blue-600 border-b border-blue-200 pb-1" : "text-gray-900 border-b pb-1"}`}>
              Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx} className={isMinimal ? "text-center" : ""}>
                  <div className={`flex justify-between items-baseline ${isMinimal ? "flex-col items-center" : ""}`}>
                    <h3 className="font-bold">{exp.company || "Company"}</h3>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-tighter">
                      {exp.from || exp.startDate} - {exp.to || (exp.current ? "Present" : exp.endDate) || "Present"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{exp.role || "Job Title"}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                    {exp.desc || exp.description || "Description of key achievements and responsibilities."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isModern ? "text-blue-600 border-b border-blue-200 pb-1" : "text-gray-900 border-b pb-1"}`}>
              Skills
            </h2>
            <div className={`flex flex-wrap gap-2 ${isMinimal ? "justify-center" : "justify-start"}`}>
              {skills.map((skill: string, idx: number) => (
                <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {hasData(projects) && (
          <section className="mb-8">
            <h2 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isModern ? "text-blue-600 border-b border-blue-200 pb-1" : "text-gray-900 border-b pb-1"}`}>
              Projects
            </h2>
            <div className="space-y-4">
              {projects.map((proj: any, idx: number) => (
                <div key={idx} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <h3 className="font-bold text-xs">{proj.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{proj.desc || proj.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {hasData(certificates) && (
          <section>
            <h2 className={`text-lg font-bold mb-4 uppercase tracking-widest ${isModern ? "text-blue-600 border-b border-blue-200 pb-1" : "text-gray-900 border-b pb-1"}`}>
              Certificates
            </h2>
            <div className="space-y-2">
              {certificates.map((cert: any, idx: number) => (
                <div key={idx} className="text-xs font-medium text-gray-800">
                  {cert.title || cert.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Card>
  );
}
