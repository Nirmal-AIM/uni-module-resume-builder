"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, ExternalLink } from "lucide-react"

export function PortfolioView({ data }: { data: any }) {
  const skills = data.personal?.skillsText ? data.personal.skillsText.split(",").map((s: string) => s.trim()) : []
  const experiences = data.experience || []
  const educations = data.education_list || []
  const projects = data.projects || []
  const languages = data.languages || []
  const certificates = data.certificates || []

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Section */}
        <Card className="p-12 text-center bg-white shadow-xl border-none ring-1 ring-slate-200">
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
            {data.personal?.fullName || "Your Professional Identity"}
          </h1>
          <p className="text-2xl text-primary font-bold mb-8 uppercase tracking-widest">
            {data.personal?.jobTitle || "Aspirant"}
          </p>
          <div className="flex justify-center gap-8 text-slate-600">
            {data.personal?.email && (
              <a
                href={`mailto:${data.personal.email}`}
                className="flex items-center gap-1 hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" /> <span className="text-sm">{data.personal.email}</span>
              </a>
            )}
            {data.personal?.phone && (
              <div className="flex items-center gap-1">
                <Phone className="h-4 w-4" /> <span className="text-sm">{data.personal.phone}</span>
              </div>
            )}
          </div>
        </Card>

        {data.summary?.text && (
          <Card className="p-8 bg-white border-none shadow-sm">
            <h2 className="text-xl font-black uppercase tracking-wider mb-4 text-slate-900">About Me</h2>
            <p className="text-lg text-slate-700 leading-relaxed font-medium">{data.summary.text}</p>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {experiences.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                  Experience
                </h2>
                <div className="space-y-12">
                  {experiences.map((exp: any, idx: number) => (
                    <div
                      key={idx}
                      className="relative pl-8 border-l-4 border-primary/20 hover:border-primary transition-colors"
                    >
                      <div className="absolute -left-[10px] top-1 h-4 w-4 rounded-full bg-white border-4 border-primary" />
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-900">{exp.role}</h3>
                        <span className="text-sm font-black text-primary uppercase">
                          {exp.from} — {exp.to || "Present"}
                        </span>
                      </div>
                      <p className="text-lg font-bold text-slate-500 mb-4">{exp.company}</p>
                      <p className="text-slate-600 leading-relaxed text-lg">{exp.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {projects.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-2 uppercase tracking-tighter">
                  Featured Projects
                </h2>
                <div className="grid grid-cols-1 gap-6">
                  {projects.map((proj: any, idx: number) => (
                    <Card key={idx} className="p-6 border-none ring-1 ring-slate-200 hover:shadow-lg transition-shadow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{proj.name}</h3>
                      <p className="text-primary font-bold text-sm mb-4">{proj.role}</p>
                      <p className="text-slate-600 mb-4">{proj.desc}</p>
                      {proj.url && (
                        <a href={proj.url} className="text-primary font-black flex items-center gap-1 hover:underline">
                          VIEW PROJECT <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </Card>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className="space-y-8">
            {/* Education */}
            {educations.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Education</h2>
                {educations.map((edu: any, idx: number) => (
                  <Card key={idx} className="p-4 bg-white border-none ring-1 ring-slate-200">
                    <h3 className="font-bold text-slate-900 text-sm">{edu.university || "University"}</h3>
                    <p className="text-xs text-slate-500 mt-1">{edu.degree}</p>
                    <Badge variant="secondary" className="mt-2 text-[10px] font-bold tracking-wider">
                      CLASS OF {edu.gradYear || "2025"}
                    </Badge>
                  </Card>
                ))}
              </section>
            )}

            {/* Skills */}
            {skills.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Core Skills</h2>
                <div className="flex flex-wrap gap-2">
                  {skills.map((skill, idx) => (
                    <Badge key={idx} variant="outline" className="bg-white border-slate-200 text-slate-700">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Languages */}
            {languages.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang, idx) => (
                    <Badge key={idx} variant="outline" className="bg-white border-slate-200 text-slate-700">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </section>
            )}

            {/* Certificates */}
            {certificates.length > 0 && (
              <section>
                <h2 className="text-lg font-bold text-slate-900 mb-4">Certificates</h2>
                <div className="flex flex-col gap-4">
                  {certificates.map((cert, idx) => (
                    <div key={idx} className="bg-white border-none ring-1 ring-slate-200 p-4">
                      <h3 className="font-bold text-slate-900 text-sm">{cert.name || "Certificate Name"}</h3>
                      <p className="text-xs text-slate-500 mt-1">{cert.issuer || "Issuer"}</p>
                      <p className="text-xs text-slate-500 mt-1">{cert.year || "Year"}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
