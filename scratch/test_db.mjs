import { createClient } from '@supabase/supabase-js';

const url = 'https://ealxpaifxqfdmqqqnoqp.supabase.co';
const anonKey = 'sb_publishable_jOrLUmdR_agusgLFa5t5tg_vV5w_Kki';

const supabase = createClient(url, anonKey);

async function testUpdate() {
  const userId = "1f7f7944-3e4f-48bb-aaf4-837d85a2658c";
  const row = {
    user_id: userId,
    full_name: "Nirmal Kollipara",
    job_title: "AI & Machine Learning Engineer",
    email: "nirmalkollipara8688@gmail.com",
    phone: "+919985804504",
    location: "Visakhapatnam, Andhra Pradesh, India",
    street_address: "Visakhapatnam, Andhra Pradesh, India",
    country: "India",
    website: "nirmalkollipara.dev",
    profile_image: "data:image/png;base64,sample...",
    summary: "Experienced AI & ML Engineer...",
    template_id: "modern-blue",
    education: JSON.stringify([{ university: "Stanford", degree: "B.S. CS" }]),
    experience: JSON.stringify([{ company: "Google", role: "Software Engineer" }]),
    projects: JSON.stringify([{ name: "AI Resume Builder" }]),
    skills: JSON.stringify(["React", "TypeScript", "Python"]),
    languages: JSON.stringify(["English", "Hindi", "Telugu"]),
    courses_certificates: JSON.stringify([{ title: "AWS Certified" }]),
  };

  const { data, error } = await supabase
    .from('user_profiles')
    .update(row)
    .eq('user_id', userId)
    .select();

  console.log('Update result:', { data, error: error?.message });
}

testUpdate();
