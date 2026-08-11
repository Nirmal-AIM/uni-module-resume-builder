/**
 * BoldBlackTemplate.tsx
 *
 * Restored exact component layout from uni-module-resume-builder-main - Copy/components/resume-builder/resume-preview.tsx
 * (template === "bold-black" / "laurice-moretti" / "bold systems").
 */

import React from 'react';

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

export function BoldBlackTemplate({ data }: LegacyTemplateProps) {
  const experiences = data.experience || [];
  const educations = data.education_list || [];
  const projects = data.projects || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];

  return (
    <div className="min-h-[1123px] w-full bg-white p-16 shadow-none text-black font-sans aspect-[1/1.414]">
      {/* Header Section */}
      <header className="mb-12">
        <h1 className="text-6xl font-black uppercase tracking-tighter mb-2">
          {data.personal?.fullName || 'LAURICE MORETTI'}
        </h1>
        <p className="text-xl font-bold uppercase tracking-[0.2em] text-gray-800">
          {data.personal?.jobTitle || 'Systems Designer'}
        </p>
      </header>

      {/* Professional Summary Section */}
      {data.summary?.text && (
        <section className="mb-10">
          <h2 className="text-base font-black uppercase tracking-wider mb-3">Professional Summary</h2>
          <p className="text-xs leading-relaxed text-gray-800 font-medium">{data.summary.text}</p>
        </section>
      )}

      {/* Work Experience Section */}
      {hasData(experiences) && (
        <section className="mb-10">
          <h2 className="text-base font-black uppercase tracking-wider mb-4 border-t-2 border-black pt-4">
            Work Experience
          </h2>
          <div className="space-y-6">
            {experiences.map((exp: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-xs font-bold">{exp.role || 'Job Position'}</h3>
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    {exp.from} {exp.from && exp.to ? '-' : ''} {exp.to || 'Present'}
                  </span>
                </div>
                <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                  {exp.company || 'Company Name'}
                </p>
                <p className="text-[10px] leading-relaxed text-gray-800 font-medium">{exp.desc}</p>
              </div>
            ))}
          </div>
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
                  {edu.university || 'University Name'} | {edu.from} {edu.from && edu.to ? '-' : ''} {edu.to || 'Present'}
                </h3>
                <p className="text-[10px] font-medium text-gray-600">{edu.degree || 'Degree Title'}</p>
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
                  {proj.name} {proj.from ? `| ${proj.from} - ${proj.to}` : ''}
                </h3>
                <p className="text-[10px] font-medium text-gray-600 mb-1">{proj.role}</p>
                <p className="text-[10px] leading-relaxed text-gray-800 font-medium">{proj.desc}</p>
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
    </div>
  );
}
