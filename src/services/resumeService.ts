/**
 * resumeService.ts
 *
 * Full CRUD Supabase operations for user resumes & user profiles.
 * Synchronizes with exact Supabase database column names:
 * `user_profiles` (id, user_id, template_id, full_name, job_title, phone, email,
 *                  location, website, country, street_address, profile_image,
 *                  summary, education, experience, projects, skills, languages,
 *                  courses_certificates)
 */

import { supabase } from '@/lib/supabase';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface ResumeRecord {
  id: string;
  user_id: string;
  title: string;
  template_key: string;
  resume_data: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ResumeSavePayload {
  title: string;
  template_key: string;
  resume_data: Record<string, unknown>;
}

// ── 1. READ (Load) ─────────────────────────────────────────────────────────────

export async function loadResume(): Promise<ResumeRecord | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Primary read: `resumes` table
  const { data: resumeRow } = await supabase
    .from('resumes')
    .select('id, user_id, title, template_key, resume_data, created_at, updated_at')
    .eq('user_id', user.id)
    .maybeSingle();

  // Secondary read: `user_profiles` table
  const { data: up } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!resumeRow && !up) {
    return null;
  }

  const baseData = (resumeRow?.resume_data as any) || {};

  const parseJson = (val: any, fallback: any) => {
    if (!val) return fallback;
    if (typeof val === 'object') return val;
    try {
      return JSON.parse(val);
    } catch (e) {
      return fallback;
    }
  };

  const mergedPersonal = {
    fullName: baseData.personal?.fullName || up?.full_name || '',
    jobTitle: baseData.personal?.jobTitle || up?.job_title || '',
    email: baseData.personal?.email || up?.email || user.email || '',
    phone: baseData.personal?.phone || up?.phone || '',
    address: baseData.personal?.address || up?.street_address || up?.location || '',
    location: baseData.personal?.location || up?.location || '',
    country: baseData.personal?.country || up?.country || '',
    website: baseData.personal?.website || up?.website || '',
    portfolio: baseData.personal?.portfolio || up?.website || '',
    profileImage: baseData.personal?.profileImage || up?.profile_image || null,
    linkedin: baseData.personal?.linkedin || up?.linkedin || '',
    github: baseData.personal?.github || up?.github || '',
    skillsText: baseData.personal?.skillsText || (Array.isArray(parseJson(up?.skills, [])) ? parseJson(up?.skills, []).join(', ') : up?.skills || ''),
  };

  const finalResumeData = {
    personal: mergedPersonal,
    education_list: baseData.education_list || parseJson(up?.education, [{}]),
    experience: baseData.experience || parseJson(up?.experience, [{}]),
    projects: baseData.projects || parseJson(up?.projects, [{}]),
    skills: baseData.skills || parseJson(up?.skills, []),
    languages: baseData.languages || parseJson(up?.languages, []),
    summary: baseData.summary || { text: up?.summary || '' },
    certificates: baseData.certificates || parseJson(up?.courses_certificates, [{}]),
  };

  return {
    id: resumeRow?.id || up?.id?.toString() || user.id,
    user_id: user.id,
    title: resumeRow?.title || (up?.full_name ? `${up.full_name}'s Resume` : 'My Resume'),
    template_key: resumeRow?.template_key || up?.template_id || 'modern-blue',
    resume_data: finalResumeData,
    created_at: resumeRow?.created_at || up?.created_at || new Date().toISOString(),
    updated_at: resumeRow?.updated_at || up?.updated_at || new Date().toISOString(),
  };
}

// ── 2. CREATE / UPDATE (Save) ──────────────────────────────────────────────────

export async function saveResume(payload: ResumeSavePayload): Promise<ResumeRecord | null> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('[resumeService] saveResume: User not authenticated');
    return null;
  }

  let savedRecord: ResumeRecord | null = null;

  // 1. Save to `resumes` table
  try {
    const { data: existingResume } = await supabase
      .from('resumes')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingResume) {
      const { data, error } = await supabase
        .from('resumes')
        .update({
          title: payload.title,
          template_key: payload.template_key,
          resume_data: payload.resume_data,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select('id, user_id, title, template_key, resume_data, created_at, updated_at')
        .maybeSingle();

      if (error) console.error('[resumeService] resumes update error:', error.message);
      savedRecord = data as ResumeRecord;
    } else {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: user.id,
          title: payload.title,
          template_key: payload.template_key,
          resume_data: payload.resume_data,
        })
        .select('id, user_id, title, template_key, resume_data, created_at, updated_at')
        .maybeSingle();

      if (error) console.error('[resumeService] resumes insert error:', error.message);
      savedRecord = data as ResumeRecord;
    }
  } catch (e) {
    console.error('[resumeService] resumes operation failed:', e);
  }

  // 2. Save to `user_profiles` table with exact column names!
  try {
    const p = (payload.resume_data?.personal as any) || {};
    const summaryText = typeof payload.resume_data?.summary === 'string'
      ? payload.resume_data?.summary
      : (payload.resume_data?.summary as any)?.text || '';

    const eduList = payload.resume_data?.education_list || payload.resume_data?.education || [];
    const expList = payload.resume_data?.experience || [];
    const projList = payload.resume_data?.projects || [];
    const skillList = payload.resume_data?.skills || (p.skillsText ? p.skillsText.split(',').map((s: string) => s.trim()) : []);
    const langList = payload.resume_data?.languages || [];
    const certList = payload.resume_data?.certificates || payload.resume_data?.certifications || [];

    const profileRow: Record<string, any> = {
      user_id: user.id,
      template_id: payload.template_key || 'modern-blue',
      full_name: p.fullName || payload.title || '',
      job_title: p.jobTitle || '',
      phone: p.phone || '',
      email: p.email || user.email || '',
      location: p.address || p.location || '',
      website: p.website || p.portfolio || '',
      portfolio: p.portfolio || p.website || '',
      linkedin: p.linkedin || '',
      github: p.github || '',
      country: p.country || '',
      street_address: p.address || p.location || '',
      profile_image: p.profileImage || '',
      summary: summaryText,
      education: typeof eduList === 'string' ? eduList : JSON.stringify(eduList),
      experience: typeof expList === 'string' ? expList : JSON.stringify(expList),
      projects: typeof projList === 'string' ? projList : JSON.stringify(projList),
      skills: typeof skillList === 'string' ? skillList : JSON.stringify(skillList),
      languages: typeof langList === 'string' ? langList : JSON.stringify(langList),
      courses_certificates: typeof certList === 'string' ? certList : JSON.stringify(certList),
      updated_at: new Date().toISOString(),
    };

    const { data: existingUserProf } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingUserProf) {
      const { error: updErr } = await supabase
        .from('user_profiles')
        .update(profileRow)
        .eq('user_id', user.id);
      if (updErr) console.error('[resumeService] user_profiles update error:', updErr.message);
    } else {
      const { error: insErr } = await supabase
        .from('user_profiles')
        .insert(profileRow);
      if (insErr) console.error('[resumeService] user_profiles insert error:', insErr.message);
    }
  } catch (e) {
    console.error('[resumeService] user_profiles sync exception:', e);
  }

  return savedRecord;
}

// ── 3. DELETE ──────────────────────────────────────────────────────────────────

export async function deleteResume(): Promise<boolean> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return false;

  try {
    await supabase.from('resumes').delete().eq('user_id', user.id);
    await supabase.from('user_profiles').delete().eq('user_id', user.id);
    return true;
  } catch (e) {
    console.error('[resumeService] deleteResume exception:', e);
    return false;
  }
}
