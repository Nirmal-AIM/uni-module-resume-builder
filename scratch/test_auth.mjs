import { createClient } from '@supabase/supabase-js';

const url = 'https://ealxpaifxqfdmqqqnoqp.supabase.co';
const key = 'sb_publishable_jOrLUmdR_agusgLFa5t5tg_vV5w_Kki';
const supabase = createClient(url, key);

async function test() {
  console.log('--- Database & Single-Record Constraint Check ---');
  
  // Query user_profiles table
  const { data: userProfiles, error: upErr } = await supabase
    .from('user_profiles')
    .select('id, user_id, full_name, email, updated_at');
    
  console.log('user_profiles records count:', userProfiles?.length, upErr?.message || '');
  console.log('user_profiles sample records:', userProfiles?.slice(0, 5));

  // Query profiles table
  const { data: profiles, error: pErr } = await supabase
    .from('profiles')
    .select('id, user_id, full_name, email, updated_at');

  console.log('profiles records count:', profiles?.length, pErr?.message || '');
  console.log('profiles sample records:', profiles?.slice(0, 5));

  // Query resumes table
  const { data: resumes, error: rErr } = await supabase
    .from('resumes')
    .select('id, user_id, title, updated_at');

  console.log('resumes records count:', resumes?.length, rErr?.message || '');
  console.log('resumes sample records:', resumes?.slice(0, 5));
}

test();
