"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { Mail, Phone, MapPin } from "lucide-react"

export function ResumePreview({ data, template = "modern" }: { data: any; template?: string }) {
  const skills = data.personal?.skillsText ? data.personal.skillsText.split(",").map((s: string) => s.trim()) : []
  const experiences = data.experience || []
  const educations = data.education_list || []
  const projects = data.projects || []
  const languages = data.languages || []
  const certificates = data.certificates || []

  // Helper to render sections only if they have data
  const hasData = (arr: any[]) => arr && arr.length > 0 && Object.values(arr[0]).some((v) => v !== "")

  // Template Styles
  if (template === "modern-blue") {
    return (
      <Card className="min-h-[1123px] w-full bg-white shadow-none overflow-hidden text-black p-0 flex aspect-[1/1.414]">
        {/* Left Sidebar */}
        <div className="w-[35%] bg-[#1a365d] text-white p-8 flex flex-col gap-8 min-h-full">
          <div className="flex flex-col items-center text-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-white/10 mb-4 overflow-hidden flex items-center justify-center">
              {data.personal?.profileImage ? (
                <img
                  src={data.personal.profileImage || "/placeholder.svg"}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-4xl opacity-20 font-bold">{data.personal?.fullName?.[0] || "U"}</span>
              )}
            </div>
          </div>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">Contact</h2>
            <ul className="space-y-3 text-xs opacity-90">
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3" /> {data.personal?.phone || "+123-456-7890"}
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3" /> {data.personal?.email || "hello@reallygreatsite.com"}
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3 w-3" /> {data.personal?.address || "123 Anywhere St., Any City"}
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

          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">Skills</h2>
            <ul className="grid grid-cols-1 gap-2 text-[10px] opacity-90 list-disc pl-4">
              {skills.map((skill: string, idx: number) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </section>

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

        {/* Main Content */}
        <div className="flex-1 p-10">
          <header className="mb-10">
            <h1 className="text-5xl font-bold text-[#2d3748] mb-1">
              <span className="font-extrabold">{data.personal?.fullName?.split(" ")[0] || "RICHARD"}</span>{" "}
              <span className="font-light">{data.personal?.fullName?.split(" ").slice(1).join(" ") || "SANCHEZ"}</span>
            </h1>
            <p className="text-xl tracking-[0.2em] text-gray-500 uppercase">
              {data.personal?.jobTitle || "Marketing Manager"}
            </p>
            <div className="w-16 h-1 bg-gray-400 mt-4"></div>
          </header>

          {data.summary?.text && (
            <section className="mb-8">
              <h2 className="text-lg font-bold text-[#1a365d] uppercase tracking-wider mb-2 border-b-2 border-gray-100 pb-1">
                Profile
              </h2>
              <p className="text-xs leading-relaxed text-gray-600 italic">{data.summary.text}</p>
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
                        {exp.from} - {exp.to || "Present"}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                      {exp.role || "Job Position"}
                    </p>
                    <p className="text-[10px] leading-relaxed text-gray-600">
                      {exp.desc || "Developed and executed comprehensive strategies to achieve business objectives."}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {hasData(projects) && (
            <section>
              <h2 className="text-lg font-bold text-[#1a365d] uppercase tracking-wider mb-4 border-b-2 border-gray-100 pb-1">
                Projects
              </h2>
              <div className="space-y-4">
                {projects.map((proj: any, idx: number) => (
                  <div key={idx}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-bold text-gray-800">{proj.name}</h3>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">
                        {proj.from} - {proj.to || "Present"}
                      </span>
                    </div>
                    <p className="text-[10px] font-semibold text-gray-500 mb-2 italic">{proj.role}</p>
                    <p className="text-[10px] leading-relaxed text-gray-600">{proj.desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </Card>
    )
  }

  if (template === "minimalist-orange") {
    return (
      <Card className="min-h-[1123px] w-full bg-white p-16 shadow-none text-black flex flex-col gap-10 font-serif aspect-[1/1.414]">
        {/* Header Section */}
        <header className="flex justify-between items-start">
          <div>
            <h1 className="text-5xl text-[#c05621] font-medium italic">{data.personal?.fullName || "Zola Bekker"}</h1>
            <p className="text-xs tracking-[0.2em] uppercase mt-2 font-sans font-bold text-gray-700">
              {data.personal?.jobTitle || "Marketing Strategist"}
            </p>
          </div>
          <div className="text-[10px] text-right space-y-1 font-sans">
            <p>
              <strong>Phone:</strong> {data.personal?.phone || "+123-456-7890"}
            </p>
            <p>
              <strong>Email:</strong> {data.personal?.email || "hello@reallygreatsite.com"}
            </p>
            <p>
              <strong>Address:</strong> {data.personal?.address || "123 Anywhere St., Any City"}
            </p>
          </div>
        </header>

        {/* Professional Summary Section */}
        {data.summary?.text && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Professional Summary</h2>
            <p className="text-xs leading-relaxed font-sans text-gray-800">{data.summary.text}</p>
          </section>
        )}

        {/* Work Experience Section */}
        {hasData(experiences) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Work Experience</h2>
            <div className="space-y-6 font-sans">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-xs font-bold">
                      {exp.role || "Role"} | {exp.from} - {exp.to || "Present"}
                    </h3>
                  </div>
                  <p className="text-[10px] text-gray-600 mb-2">{exp.company || "Company Name"}</p>
                  <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-medium leading-relaxed">
                    <li>
                      {exp.desc ||
                        "Led the development and implementation of key strategies that increased efficiency and performance."}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Academic History Section */}
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
                  <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800">
                    {edu.courses?.map((course: any, cIdx: number) => (
                      <li key={cIdx}>{course}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {hasData(projects) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Projects</h2>
            <div className="space-y-6 font-sans">
              {projects.map((proj: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {proj.name} | {proj.from} - {proj.to || "Present"}
                  </h3>
                  <p className="text-[10px] text-gray-600 mb-2">{proj.role}</p>
                  <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-medium leading-relaxed">
                    <li>{proj.desc}</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {hasData(languages) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Languages</h2>
            <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800">
              {languages.map((lang: any, idx: number) => (
                <li key={idx} className="flex justify-between">
                  <span>{lang.name}</span>
                  <span className="opacity-60 italic">({lang.level})</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certificates Section */}
        {hasData(certificates) && (
          <section>
            <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4">Certificates</h2>
            <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800">
              {certificates.map((cert: any, idx: number) => (
                <li key={idx}>{cert.title || cert.name}</li>
              ))}
            </ul>
          </section>
        )}
      </Card>
    )
  }

  if (template === "clean-teal") {
    return (
      <Card className="min-h-[1123px] w-full bg-white p-12 shadow-none text-black font-sans aspect-[1/1.414]">
        {/* Header Section */}
        <header className="flex justify-between items-center mb-12 border-b-2 border-gray-50 pb-6">
          <h1 className="text-4xl font-bold text-[#2c7a7b] tracking-tight">
            {data.personal?.fullName?.toUpperCase() || "DREW FEIG"}
          </h1>
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
            {data.personal?.jobTitle || "Marketing Specialist"}
          </p>
        </header>

        {/* Contact Section */}
        <div className="flex justify-between text-[10px] text-gray-600 mb-10 border-b border-gray-100 pb-4">
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-[#2c7a7b]" /> {data.personal?.email || "hello@reallygreatsite.com"}
          </span>
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-[#2c7a7b]" /> {data.personal?.phone || "+123-456-7890"}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#2c7a7b]" /> {data.personal?.address || "123 Anywhere St., Any City"}
          </span>
        </div>

        {/* Profile Summary Section */}
        {data.summary?.text && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Profile Summary</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <p className="text-xs leading-relaxed text-gray-700">{data.summary.text}</p>
          </section>
        )}

        {/* Professional Skills Section */}
        {hasData(skills) && (
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

        {/* Work Experience Section */}
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
                      {exp.from} - {exp.to || "Present"}
                    </span>
                  </div>
                  <p className="text-[10px] font-bold text-gray-800 mb-2">{exp.company || "Company Name"}</p>
                  <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-600 leading-relaxed">
                    <li>
                      {exp.desc ||
                        "Propel works with clients to create effective and unique marketing strategies to help raise their profile."}
                    </li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
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
                      {proj.from} - {proj.to || "Present"}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 mb-2 italic">{proj.role}</p>
                  <p className="text-[10px] leading-relaxed text-gray-600">{proj.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {hasData(languages) && (
          <section className="mb-10">
            <div className="flex items-center gap-4 mb-4">
              <h2 className="text-sm font-bold text-[#2c7a7b] whitespace-nowrap">Languages</h2>
              <div className="w-full h-px bg-[#2c7a7b]/30"></div>
            </div>
            <ul className="grid grid-cols-2 gap-y-2 text-xs">
              {languages.map((lang: any, idx: number) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-[#2c7a7b]"></div>
                  {lang.name} ({lang.level})
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Certificates Section */}
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
    )
  }

  if (template === "bold-black") {
    return (
      <Card className="min-h-[1123px] w-full bg-white p-16 shadow-none text-black font-sans aspect-[1/1.414]">
        {/* Header Section */}
        <header className="mb-12">
          <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">
            {data.personal?.fullName || "LAURICE MORETTI"}
          </h1>
          <p className="text-xl font-bold uppercase tracking-[0.2em] text-gray-800">
            {data.personal?.jobTitle || "Systems Designer"}
          </p>
        </header>

        {/* Professional Summary Section */}
        {data.summary?.text && (
          <section className="mb-10">
            <h2 className="text-base font-black uppercase tracking-wider mb-3">Professional Summary</h2>
            <p className="text-xs leading-relaxed text-gray-800 font-medium">{data.summary.text}</p>
          </section>
        )}

        {/* Academic History Section */}
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

        {/* Projects Section */}
        {hasData(projects) && (
          <section className="mb-10">
            <h2 className="text-base font-black uppercase tracking-wider mb-4 border-t-2 border-black pt-4">
              Projects
            </h2>
            <div className="space-y-6">
              {projects.map((proj: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {proj.name} | {proj.from} - {proj.to || "Present"}
                  </h3>
                  <p className="text-[10px] font-medium text-gray-600 mb-1">{proj.role}</p>
                  <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-medium leading-relaxed">
                    <li>{proj.desc}</li>
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {hasData(languages) && (
          <section className="mb-10">
            <h2 className="text-base font-black uppercase tracking-wider mb-4 border-t-2 border-black pt-4">
              Languages
            </h2>
            <div className="grid grid-cols-2 gap-x-12 gap-y-2">
              {languages.map((lang: any, idx: number) => (
                <div key={idx}>
                  <h3 className="text-xs font-bold">
                    {lang.name} ({lang.level})
                  </h3>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates Section */}
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
    )
  }

  // Fallback to original templates
  const isMinimal = template === "minimal"
  const isModern = template === "modern"
  const isAcademic = template === "academic"

  return (
    <Card className="min-h-[1123px] w-full bg-white p-12 shadow-none overflow-y-auto text-black aspect-[1/1.414]">
      <div className={cn("max-w-[800px] mx-auto", isMinimal && "text-center")}>
        {/* Header Section */}
        <header className={cn("mb-8 pb-6", isModern ? "border-b-2 border-primary" : "border-b border-gray-200")}>
          <h1 className={cn("font-bold uppercase tracking-tight", isModern ? "text-4xl text-primary" : "text-3xl")}>
            {data.personal?.fullName || "Your Name"}
          </h1>
          <p
            className={cn(
              "text-lg font-medium mt-1 uppercase tracking-wide",
              isModern ? "text-primary/80" : "text-gray-700",
            )}
          >
            {data.personal?.jobTitle || "Job Title"}
          </p>
          <div
            className={cn(
              "text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1",
              isMinimal ? "justify-center" : "justify-start",
            )}
          >
            {data.personal?.email && <span className="text-sm">{data.personal.email}</span>}
            {data.personal?.phone && <span className="text-sm">{data.personal.phone}</span>}
          </div>
        </header>

        {/* Education Section */}
        {hasData(educations) && (
          <section className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 uppercase tracking-widest",
                isModern ? "text-primary border-b border-primary/20 pb-1" : "text-gray-900",
              )}
            >
              Education
            </h2>
            <div className={cn("flex justify-between items-baseline mb-1", isMinimal && "flex-col items-center")}>
              {educations.map((edu: any, idx: number) => (
                <div key={idx} className={isMinimal ? "text-center" : ""}>
                  <h3 className="font-bold">{edu.university || "University Name"}</h3>
                  <span className="text-sm text-gray-500">
                    {edu.from} - {edu.to || "Present"}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {hasData(experiences) && (
          <section className="mb-8 text-left">
            <h2
              className={cn(
                "text-lg font-bold mb-4 uppercase tracking-widest",
                isModern ? "text-primary border-b border-primary/20 pb-1" : "text-gray-900",
              )}
            >
              Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx} className={isMinimal ? "text-center" : ""}>
                  <div className={cn("flex justify-between items-baseline", isMinimal && "flex-col items-center")}>
                    <h3 className="font-bold">{exp.company || "Company"}</h3>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-tighter">
                      {exp.from} - {exp.to || "Present"}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{exp.role || "Job Title"}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-[90%] mx-auto lg:mx-0">
                    {exp.desc || "Description of your key achievements and responsibilities."}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {hasData(skills) && (
          <section className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 uppercase tracking-widest",
                isModern ? "text-primary border-b border-primary/20 pb-1" : "text-gray-900",
              )}
            >
              Skills
            </h2>
            <div className={cn("flex flex-wrap gap-2", isMinimal ? "justify-center" : "justify-start")}>
              {skills.map((skill, idx) => (
                <span key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {hasData(projects) && (
          <section className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 uppercase tracking-widest",
                isModern ? "text-primary border-b border-primary/20 pb-1" : "text-gray-900",
              )}
            >
              Projects
            </h2>
            <div className={cn("flex flex-wrap gap-2", isMinimal ? "justify-center" : "justify-start")}>
              {projects.map((proj, idx) => (
                <div key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {proj.name} ({proj.from} - {proj.to || "Present"})
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {hasData(languages) && (
          <section className="mb-8">
            <h2
              className={cn(
                "text-lg font-bold mb-4 uppercase tracking-widest",
                isModern ? "text-primary border-b border-primary/20 pb-1" : "text-gray-900",
              )}
            >
              Languages
            </h2>
            <div className={cn("flex flex-wrap gap-2", isMinimal ? "justify-center" : "justify-start")}>
              {languages.map((lang, idx) => (
                <div key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {lang.name} ({lang.level})
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates Section */}
        {hasData(certificates) && (
          <section>
            <h2
              className={cn(
                "text-lg font-bold mb-4 uppercase tracking-widest",
                isModern ? "text-primary border-b border-primary/20 pb-1" : "text-gray-900",
              )}
            >
              Certificates
            </h2>
            <div className={cn("flex flex-wrap gap-2", isMinimal ? "justify-center" : "justify-start")}>
              {certificates.map((cert, idx) => (
                <div key={idx} className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs font-medium">
                  {cert.title || cert.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </Card>
  )
}
