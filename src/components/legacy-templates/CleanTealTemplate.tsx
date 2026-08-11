/**
 * CleanTealTemplate.tsx
 *
 * Restored exact component layout from uni-module-resume-builder-main - Copy/components/resume-builder/resume-preview.tsx
 * (template === "clean-teal" / "drew-feig" / "clean teal").
 */

import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface LegacyTemplateProps {
  data: {
    personal?: {
      fullName?: string;
      jobTitle?: string;
      phone?: string;
      email?: string;
      address?: string;
    };
    summary?: { text?: string };
    education_list?: any[];
    experience?: any[];
    projects?: any[];
    skills?: string[];
    languages?: any[];
    certificates?: any[];
  };
}

const hasData = (arr: any[]) =>
  Array.isArray(arr) &&
  arr.length > 0 &&
  Object.values(arr[0] || {}).some((v) => Boolean(v));

export function CleanTealTemplate({ data }: LegacyTemplateProps) {
  const skills = data.skills || [];
  const experiences = data.experience || [];
  const educations = data.education_list || [];
  const projects = data.projects || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];

  return (
    <div className="min-h-[1123px] w-full bg-white p-12 shadow-none text-black font-sans aspect-[1/1.414]">
      {/* Header Section */}
      <header className="flex justify-between items-center mb-12 border-b-2 border-gray-50 pb-6">
        <h1 className="text-4xl font-bold text-[#2c7a7b] tracking-tight">
          {data.personal?.fullName?.toUpperCase() || 'DREW FEIG'}
        </h1>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-gray-500">
          {data.personal?.jobTitle || 'Marketing Specialist'}
        </p>
      </header>

      {/* Contact Section */}
      <div className="flex justify-between text-[10px] text-gray-600 mb-10 border-b border-gray-100 pb-4">
        {data.personal?.email && (
          <span className="flex items-center gap-1">
            <Mail className="h-3 w-3 text-[#2c7a7b]" /> {data.personal.email}
          </span>
        )}
        {data.personal?.phone && (
          <span className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-[#2c7a7b]" /> {data.personal.phone}
          </span>
        )}
        {data.personal?.address && (
          <span className="flex items-center gap-1">
            <MapPin className="h-3 w-3 text-[#2c7a7b]" /> {data.personal.address}
          </span>
        )}
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
                  <h3 className="text-xs font-bold">{exp.role || 'Marketing Strategist'}</h3>
                  <span className="text-[10px] italic text-[#2c7a7b]">
                    {exp.from} {exp.from && exp.to ? '-' : ''} {exp.to || 'Present'}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-gray-800 mb-2">{exp.company || 'Company Name'}</p>
                <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-600 leading-relaxed">
                  <li>{exp.desc}</li>
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
                    {proj.from} {proj.from && proj.to ? '-' : ''} {proj.to || 'Present'}
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
    </div>
  );
}
