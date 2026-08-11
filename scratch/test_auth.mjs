import { createClient } from '@supabase/supabase-js';

const url = 'https://ealxpaifxqfdmqqqnoqp.supabase.co';
const key = 'sb_publishable_jOrLUmdR_agusgLFa5t5tg_vV5w_Kki';
const supabase = createClient(url, key);

async function test() {
  const email = `instant_${Date.now()}@test.com`;
  const password = 'TestPassword123!';

  console.log(`Signing up ${email}...`);
  const { data: su, error: suErr } = await supabase.auth.signUp({ email, password });
  console.log('SignUp User ID:', su?.user?.id);
  console.log('SignUp Session:', Boolean(su?.session));
  console.log('Email confirmed at:', su?.user?.email_confirmed_at);
  console.log('SignUp Error:', suErr?.message);

  console.log(`Attempting immediate login for ${email}...`);
  const { data: si, error: siErr } = await supabase.auth.signInWithPassword({ email, password });
  console.log('SignIn Session:', Boolean(si?.session));
  console.log('SignIn Error:', siErr?.message);
}

test();
