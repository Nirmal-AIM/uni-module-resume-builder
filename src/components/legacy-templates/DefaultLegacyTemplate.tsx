/**
 * DefaultLegacyTemplate.tsx
 *
 * Restored fallback template layout from uni-module-resume-builder-main - Copy/components/resume-builder/resume-preview.tsx
 * (templates === "modern", "minimal", "academic").
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
  variant?: 'modern' | 'minimal' | 'academic';
}

const hasData = (arr: any[]) =>
  Array.isArray(arr) &&
  arr.length > 0 &&
  Object.values(arr[0] || {}).some((v) => Boolean(v));

export function DefaultLegacyTemplate({ data, variant = 'modern' }: LegacyTemplateProps) {
  const skills = data.skills || [];
  const experiences = data.experience || [];
  const educations = data.education_list || [];
  const projects = data.projects || [];
  const certificates = data.certificates || [];
  const languages = data.languages || [];

  const isMinimal = variant === 'minimal';
  const isModern = variant === 'modern';

  return (
    <div className="min-h-[1123px] w-full bg-white p-12 shadow-none overflow-y-auto text-black aspect-[1/1.414]">
      <div className={`max-w-[800px] mx-auto ${isMinimal ? 'text-center' : ''}`}>
        {/* Header Section */}
        <header
          className={`mb-8 pb-6 ${
            isModern ? 'border-b-2 border-gray-900' : 'border-b border-gray-200'
          }`}
        >
          <h1
            className={`font-bold uppercase tracking-tight ${
              isModern ? 'text-4xl text-gray-900' : 'text-3xl'
            }`}
          >
            {data.personal?.fullName || 'Your Name'}
          </h1>
          <p
            className={`text-lg font-medium mt-1 uppercase tracking-wide ${
              isModern ? 'text-gray-700' : 'text-gray-700'
            }`}
          >
            {data.personal?.jobTitle || 'Job Title'}
          </p>
          <div
            className={`text-gray-600 mt-2 flex flex-wrap gap-x-4 gap-y-1 ${
              isMinimal ? 'justify-center' : 'justify-start'
            }`}
          >
            {data.personal?.email && <span className="text-sm">{data.personal.email}</span>}
            {data.personal?.phone && <span className="text-sm">{data.personal.phone}</span>}
            {data.personal?.address && <span className="text-sm">{data.personal.address}</span>}
          </div>
        </header>

        {/* Summary */}
        {data.summary?.text && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Summary
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">{data.summary.text}</p>
          </section>
        )}

        {/* Education Section */}
        {hasData(educations) && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Education
            </h2>
            <div className="space-y-4">
              {educations.map((edu: any, idx: number) => (
                <div
                  key={idx}
                  className={`flex justify-between items-baseline ${
                    isMinimal ? 'flex-col items-center' : ''
                  }`}
                >
                  <div className={isMinimal ? 'text-center' : ''}>
                    <h3 className="font-bold text-gray-900">{edu.university || 'University Name'}</h3>
                    <p className="text-sm text-gray-600">{edu.degree}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {edu.from} {edu.from && edu.to ? '-' : ''} {edu.to || 'Present'}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience Section */}
        {hasData(experiences) && (
          <section className="mb-8 text-left">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Experience
            </h2>
            <div className="space-y-6">
              {experiences.map((exp: any, idx: number) => (
                <div key={idx} className={isMinimal ? 'text-center' : ''}>
                  <div
                    className={`flex justify-between items-baseline ${
                      isMinimal ? 'flex-col items-center' : ''
                    }`}
                  >
                    <h3 className="font-bold text-gray-900">{exp.company || 'Company'}</h3>
                    <span className="text-sm text-gray-500 font-medium uppercase tracking-tighter">
                      {exp.from} {exp.from && exp.to ? '-' : ''} {exp.to || 'Present'}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-700">{exp.role || 'Job Title'}</p>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{exp.desc}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Skills
            </h2>
            <div
              className={`flex flex-wrap gap-2 ${isMinimal ? 'justify-center' : 'justify-start'}`}
            >
              {skills.map((skill: string, idx: number) => (
                <span key={idx} className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-xs font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {hasData(projects) && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Projects
            </h2>
            <div
              className={`flex flex-wrap gap-2 ${isMinimal ? 'justify-center' : 'justify-start'}`}
            >
              {projects.map((proj: any, idx: number) => (
                <div key={idx} className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-xs font-medium">
                  {proj.name} ({proj.from} {proj.from && proj.to ? '-' : ''} {proj.to || 'Present'})
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Languages Section */}
        {hasData(languages) && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Languages
            </h2>
            <div
              className={`flex flex-wrap gap-2 ${isMinimal ? 'justify-center' : 'justify-start'}`}
            >
              {languages.map((lang: any, idx: number) => (
                <div key={idx} className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-xs font-medium">
                  {lang.name} ({lang.level})
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certificates Section */}
        {hasData(certificates) && (
          <section>
            <h2 className="text-lg font-bold mb-4 uppercase tracking-widest text-gray-900 border-b border-gray-200 pb-1">
              Certificates
            </h2>
            <div
              className={`flex flex-wrap gap-2 ${isMinimal ? 'justify-center' : 'justify-start'}`}
            >
              {certificates.map((cert: any, idx: number) => (
                <div key={idx} className="bg-gray-100 text-gray-800 px-2.5 py-1 rounded text-xs font-medium">
                  {cert.title || cert.name}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
