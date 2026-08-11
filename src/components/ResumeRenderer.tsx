import React from 'react';
import { ResumePreview } from './ResumePreview';

interface ResumeRendererProps {
  data: any;
  templateKey: string;
}

export function adaptResumeData(data: any) {
  if (!data) return {};

  const personal = data.personal || {};
  const isUniFormat = Boolean(data.education_list || personal.jobTitle || (data.summary && typeof data.summary === 'object'));

  if (isUniFormat) {
    return {
      ...data,
      personal: {
        ...personal,
        jobTitle: personal.jobTitle || personal.professionalTitle || '',
        address: personal.address || personal.location || '',
        skillsText: personal.skillsText || (Array.isArray(data.skills) ? data.skills.join(', ') : ''),
      },
      summary: typeof data.summary === 'string' ? { text: data.summary } : data.summary || { text: '' },
    };
  }

  // Convert ResumeEditor format to Uni-module preview format
  return {
    personal: {
      fullName: personal.fullName || '',
      jobTitle: personal.professionalTitle || personal.jobTitle || '',
      phone: personal.phone || '',
      email: personal.email || '',
      address: personal.location || personal.address || '',
      skillsText: Array.isArray(data.skills) ? data.skills.join(', ') : '',
      profileImage: personal.profileImage || null,
    },
    summary: {
      text: typeof data.summary === 'string' ? data.summary : data.summary?.text || '',
    },
    experience: (data.experience || []).map((exp: any) => ({
      id: exp.id,
      company: exp.company || '',
      role: exp.role || '',
      from: exp.startDate || exp.from || '',
      to: exp.current ? 'Present' : exp.endDate || exp.to || '',
      desc: exp.description || exp.desc || '',
    })),
    education_list: (data.education || data.education_list || []).map((edu: any) => ({
      id: edu.id,
      university: edu.institution || edu.university || '',
      degree: (edu.degree || '') + (edu.fieldOfStudy ? ` in ${edu.fieldOfStudy}` : ''),
      from: edu.startDate || edu.from || '',
      to: edu.endDate || edu.to || '',
      gpa: edu.gpa || '',
    })),
    projects: (data.projects || []).map((proj: any) => ({
      id: proj.id,
      name: proj.name || '',
      role: proj.technologies || proj.role || '',
      from: proj.startDate || proj.from || '',
      to: proj.endDate || proj.to || '',
      desc: proj.description || proj.desc || '',
    })),
    certificates: (data.certifications || data.certificates || []).map((cert: any) => ({
      id: cert.id,
      title: cert.name || cert.title || '',
      name: cert.name || cert.title || '',
      issuer: cert.issuer || cert.org || '',
      date: cert.issueDate || cert.date || '',
    })),
    languages: data.languages || [],
    skills: data.skills || [],
  };
}

export function normalizeTemplateKey(key: string): string {
  const k = (key || '').toLowerCase().trim();
  if (k === 'ats-6') return 'ats-6';
  if (k === 'richard-sanchez' || k === 'executive-navy' || k === 'executive navy') {
    return 'modern-blue';
  }
  if (k === 'zola-bekker' || k === 'warm-terracotta' || k === 'warm terracotta') {
    return 'minimalist-orange';
  }
  if (k === 'drew-feig' || k === 'clean-modern' || k === 'clean teal') {
    return 'clean-teal';
  }
  if (k === 'laurice-moretti' || k === 'bold-minimal' || k === 'bold systems') {
    return 'bold-black';
  }
  if (k === 'minimal') return 'minimal';
  if (k === 'academic') return 'academic';
  return 'modern';
}

export function ResumeRenderer({ data, templateKey }: ResumeRendererProps) {
  const adapted = adaptResumeData(data);
  const normalizedKey = normalizeTemplateKey(templateKey);

  return <ResumePreview data={adapted} template={normalizedKey} />;
}
