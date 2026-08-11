/**
 * WarmTerracottaTemplate.tsx
 *
 * Restored exact component layout from uni-module-resume-builder-main - Copy/components/resume-builder/resume-preview.tsx
 * (template === "minimalist-orange" / "zola-bekker" / "warm terracotta").
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

export function WarmTerracottaTemplate({ data }: LegacyTemplateProps) {
  const skills = data.skills || [];
  const experiences = data.experience || [];
  const educations = data.education_list || [];
  const projects = data.projects || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];

  return (
    <div
      className="min-h-[1123px] w-full bg-white p-16 shadow-none text-black flex flex-col gap-10 aspect-[1/1.414]"
      style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}
    >
      {/* Header Section */}
      <header className="flex justify-between items-start">
        <div>
          <h1 className="text-5xl text-[#c05621] font-medium italic">
            {data.personal?.fullName || 'Zola Bekker'}
          </h1>
          <p className="text-xs tracking-[0.2em] uppercase mt-2 font-sans font-bold text-gray-700">
            {data.personal?.jobTitle || 'Marketing Strategist'}
          </p>
        </div>
        <div className="text-[10px] text-right space-y-1 font-sans">
          {data.personal?.phone && (
            <p>
              <strong>Phone:</strong> {data.personal.phone}
            </p>
          )}
          {data.personal?.email && (
            <p>
              <strong>Email:</strong> {data.personal.email}
            </p>
          )}
          {data.personal?.address && (
            <p>
              <strong>Address:</strong> {data.personal.address}
            </p>
          )}
        </div>
      </header>

      {/* Professional Summary Section */}
      {data.summary?.text && (
        <section>
          <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4 text-[#c05621]">
            Professional Summary
          </h2>
          <p className="text-xs leading-relaxed font-sans text-gray-800">{data.summary.text}</p>
        </section>
      )}

      {/* Work Experience Section */}
      {hasData(experiences) && (
        <section>
          <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4 text-[#c05621]">
            Work Experience
          </h2>
          <div className="space-y-6 font-sans">
            {experiences.map((exp: any, idx: number) => (
              <div key={idx}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="text-xs font-bold">
                    {exp.role || 'Role'} | {exp.from} {exp.from && exp.to ? '-' : ''} {exp.to || 'Present'}
                  </h3>
                </div>
                <p className="text-[10px] text-gray-600 mb-2">{exp.company || 'Company Name'}</p>
                <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-medium leading-relaxed">
                  <li>{exp.desc}</li>
                </ul>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Academic History Section */}
      {hasData(educations) && (
        <section>
          <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4 text-[#c05621]">
            Academic History
          </h2>
          <div className="grid grid-cols-2 gap-8 font-sans">
            {educations.map((edu: any, idx: number) => (
              <div key={idx}>
                <h3 className="text-xs font-bold">
                  {edu.university || 'University Name'} | {edu.from} {edu.from && edu.to ? '-' : ''} {edu.to || 'Present'}
                </h3>
                <p className="text-[10px] text-gray-600 mb-2">{edu.degree || 'Master of Marketing'}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Projects Section */}
      {hasData(projects) && (
        <section>
          <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4 text-[#c05621]">
            Projects
          </h2>
          <div className="space-y-6 font-sans">
            {projects.map((proj: any, idx: number) => (
              <div key={idx}>
                <h3 className="text-xs font-bold">
                  {proj.name} | {proj.from} {proj.from && proj.to ? '-' : ''} {proj.to || 'Present'}
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
          <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4 text-[#c05621]">
            Languages
          </h2>
          <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-sans">
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
          <h2 className="text-lg font-medium italic border-b border-[#c05621]/30 pb-2 mb-4 text-[#c05621]">
            Certificates
          </h2>
          <ul className="list-disc pl-4 text-[10px] space-y-1 text-gray-800 font-sans">
            {certificates.map((cert: any, idx: number) => (
              <li key={idx}>{cert.title || cert.name}</li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
