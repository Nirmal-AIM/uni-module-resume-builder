/**
 * ExecutiveNavyTemplate.tsx
 *
 * Restored exact component layout from uni-module-resume-builder-main - Copy/components/resume-builder/resume-preview.tsx
 * (template === "modern-blue" / "executive-navy" / "richard-sanchez").
 *
 * EXACT DESIGN SPECIFICATION:
 * - Two-column layout: 35% dark blue sidebar (#1a365d), 65% white main area
 * - Aspect ratio: A4 (min-h-[1123px] w-full aspect-[1/1.414])
 * - Sidebar contains: Avatar, Contact info (Phone, Mail, MapPin), Education, Skills
 * - Main area contains: Two-part name header (Bold first name, Light last name), Title, Profile Summary, Work Experience with timeline dots, Projects, Certificates
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
      profileImage?: string | null;
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

export function ExecutiveNavyTemplate({ data }: LegacyTemplateProps) {
  const skills = data.skills || [];
  const experiences = data.experience || [];
  const educations = data.education_list || [];
  const projects = data.projects || [];
  const certificates = data.certificates || [];

  return (
    <div className="min-h-[1123px] w-full bg-white shadow-none overflow-hidden text-black p-0 flex flex-row aspect-[1/1.414]">
      {/* Left Sidebar - Blue */}
      <div className="w-[35%] shrink-0 bg-[#1a365d] text-white p-8 flex flex-col gap-8 min-h-full">
        <div className="flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-white/10 mb-4 overflow-hidden flex items-center justify-center">
            {data.personal?.profileImage ? (
              <img
                src={data.personal.profileImage}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-4xl opacity-20 font-bold">
                {data.personal?.fullName?.[0] || 'U'}
              </span>
            )}
          </div>
        </div>

        <section>
          <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">
            Contact
          </h2>
          <ul className="space-y-3 text-xs opacity-90">
            {data.personal?.phone && (
              <li className="flex items-center gap-2">
                <Phone className="h-3 w-3 shrink-0" /> {data.personal.phone}
              </li>
            )}
            {data.personal?.email && (
              <li className="flex items-center gap-2">
                <Mail className="h-3 w-3 shrink-0" /> {data.personal.email}
              </li>
            )}
            {data.personal?.address && (
              <li className="flex items-center gap-2">
                <MapPin className="h-3 w-3 shrink-0" /> {data.personal.address}
              </li>
            )}
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
                    {edu.from} {edu.from && edu.to ? '-' : ''} {edu.to || 'Present'}
                  </p>
                  <p className="text-xs font-bold uppercase">{edu.university || 'University Name'}</p>
                  <p className="text-[10px] opacity-80">{edu.degree || 'Degree Title'}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {skills.length > 0 && (
          <section>
            <h2 className="text-sm font-bold uppercase tracking-widest border-b border-white/20 pb-2 mb-4">
              Skills
            </h2>
            <ul className="grid grid-cols-1 gap-2 text-[10px] opacity-90 list-disc pl-4">
              {skills.map((skill: string, idx: number) => (
                <li key={idx}>{skill}</li>
              ))}
            </ul>
          </section>
        )}
      </div>

      {/* Right Side - White Main Content */}
      <div className="w-[65%] shrink-0 p-10 bg-white">
        <header className="mb-10">
          <h1 className="text-5xl font-bold text-[#2d3748] mb-1">
            <span className="font-extrabold">
              {data.personal?.fullName?.split(' ')[0] || 'RICHARD'}
            </span>{' '}
            <span className="font-light">
              {data.personal?.fullName?.split(' ').slice(1).join(' ') || 'SANCHEZ'}
            </span>
          </h1>
          <p className="text-xl tracking-[0.2em] text-gray-500 uppercase">
            {data.personal?.jobTitle || 'Marketing Manager'}
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
                    <h3 className="font-bold text-gray-800">{exp.company || 'Company Name'}</h3>
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {exp.from} {exp.from && exp.to ? '-' : ''} {exp.to || 'Present'}
                    </span>
                  </div>
                  <p className="text-[10px] font-semibold text-gray-500 mb-2 uppercase">
                    {exp.role || 'Job Position'}
                  </p>
                  <p className="text-[10px] leading-relaxed text-gray-600">
                    {exp.desc}
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
                      {proj.from} {proj.from && proj.to ? '-' : ''} {proj.to || 'Present'}
                    </span>
                  </div>
                  {proj.role && (
                    <p className="text-[10px] font-semibold text-gray-500 mb-2 italic">{proj.role}</p>
                  )}
                  {proj.desc && (
                    <p className="text-[10px] leading-relaxed text-gray-600">{proj.desc}</p>
                  )}
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
    </div>
  );
}
