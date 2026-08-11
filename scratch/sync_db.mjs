import { createClient } from '@supabase/supabase-js';

const url = 'https://ealxpaifxqfdmqqqnoqp.supabase.co';
const anonKey = 'sb_publishable_jOrLUmdR_agusgLFa5t5tg_vV5w_Kki';

const supabase = createClient(url, anonKey);

const templates = [
  {
    id: 1,
    template_id: 'richard-sanchez',
    name: 'Executive Navy',
    description: 'Dark navy sidebar layout with avatar, timeline experience, and reference section.',
    category: 'Executive',
    preview_image: '/templates/richard-sanchez.png',
    is_active: true,
  },
  {
    id: 2,
    template_id: 'zola-bekker',
    name: 'Warm Terracotta',
    description: 'Elegant terracotta serif typography with horizontal dividers and academic history grid.',
    category: 'Creative',
    preview_image: '/templates/zola-bekker.png',
    is_active: true,
  },
  {
    id: 3,
    template_id: 'laurice-moretti',
    name: 'Bold Systems',
    description: 'High-contrast bold sans-serif header with clean single-column corporate bullet sections.',
    category: 'Minimal',
    preview_image: '/templates/laurice-moretti.png',
    is_active: true,
  },
  {
    id: 4,
    template_id: 'drew-feig',
    name: 'Clean Teal',
    description: 'Teal header accents with horizontal pipe contact bar and right-aligned italic dates.',
    category: 'Modern',
    preview_image: '/templates/drew-feig.png',
    is_active: true,
  },
  {
    id: 5,
    template_id: 'ats-1',
    name: 'ATS Classic',
    description: 'Clean ATS-optimized single-column layout for maximum scanner parsing rate.',
    category: 'ATS Optimized',
    preview_image: '/templates/ATS1.jpg',
    is_active: true,
  },
  {
    id: 6,
    template_id: 'ats-2',
    name: 'ATS Career',
    description: 'Structured ATS template with high-density experience and key project sections.',
    category: 'ATS Optimized',
    preview_image: '/templates/ATS2.jpg',
    is_active: true,
  },
  {
    id: 7,
    template_id: 'ats-3',
    name: 'ATS Professional',
    description: 'Corporate ATS resume format tailored for experienced and corporate industry roles.',
    category: 'ATS Optimized',
    preview_image: '/templates/ATS3.jpg',
    is_active: true,
  },
  {
    id: 8,
    template_id: 'ats-4',
    name: 'ATS Engineering',
    description: 'High-parser ATS template designed specifically for technical and engineering positions.',
    category: 'ATS Optimized',
    preview_image: '/templates/ATS4.jpg',
    is_active: true,
  },
  {
    id: 9,
    template_id: 'ats-5',
    name: 'ATS Executive',
    description: 'Refined ATS structure tailored for senior management, leadership, and executive roles.',
    category: 'ATS Optimized',
    preview_image: '/templates/ATS5.jpg',
    is_active: true,
  },
  {
    id: 10,
    template_id: 'ats-6',
    name: 'ATS Graduate',
    description: 'Fresh single-column ATS layout perfectly tailored for students, interns, and freshers.',
    category: 'ATS Optimized',
    preview_image: '/templates/ATS6.jpg',
    is_active: true,
  },
];

async function run() {
  console.log('Upserting 10 templates to Supabase schema...');
  const { data: upserted, error: upsertErr } = await supabase
    .from('resume_templates')
    .upsert(templates, { onConflict: 'id' })
    .select('*');

  if (upsertErr) {
    console.error('Upsert Error:', upsertErr);
  } else {
    console.log('Successfully upserted templates:', upserted.length);
  }

  console.log('\nFetching templates from Supabase database...');
  const { data: fetched, error: fetchErr } = await supabase
    .from('resume_templates')
    .select('*')
    .eq('is_active', true)
    .order('id', { ascending: true });

  if (fetchErr) {
    console.error('Fetch Error:', fetchErr);
  } else {
    console.log('SUCCESS! Fetched database records count:', fetched.length);
    console.log(JSON.stringify(fetched, null, 2));
  }
}

run();
