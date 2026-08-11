import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';

export type AuthResult = { success: true } | { success: false; error: string };

export type Profile = {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  provider: string;
  created_at: string;
  updated_at: string;
  last_login_at: string;
};

function friendlyError(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('invalid login credentials') || lower.includes('invalid credentials') || lower.includes('wrong password') || lower.includes('incorrect password')) {
    return 'Invalid email or password. Please check your credentials and try again.';
  }
  if (lower.includes('email not confirmed') || lower.includes('email_not_confirmed')) {
    return 'Email not confirmed. Please check your email inbox for the confirmation link, or disable email confirmation in Supabase Auth settings.';
  }
  if (lower.includes('already registered') || lower.includes('already exists') || lower.includes('user_already_exists')) {
    return 'An account with this email address already exists. Please sign in instead.';
  }
  if (lower.includes('rate limit') || lower.includes('rate_limit') || lower.includes('too many')) {
    return 'Too many requests. Please wait a moment and try again.';
  }
  if (lower.includes('expired')) {
    return 'Link or session has expired. Please try again.';
  }
  if (lower.includes('network') || lower.includes('fetch')) {
    return 'Connection problem. Please check your internet and try again.';
  }
  return message;
}

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    return { success: false, error: friendlyError(error.message) };
  }
  if (data.user) {
    await initializeUserProfile(data.user);
  }
  return { success: true };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName: string
): Promise<AuthResult & { requiresConfirmation?: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });
  if (error) {
    return { success: false, error: friendlyError(error.message) };
  }
  if (data.user) {
    await initializeUserProfile(data.user);
  }
  const requiresConfirmation = Boolean(data.user && !data.session);
  return { success: true, requiresConfirmation };
}

export async function sendForgotPasswordReset(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + '/dashboard',
  });
  return error ? { success: false, error: friendlyError(error.message) } : { success: true };
}

export async function sendEmailOtp(email: string): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true,
      emailRedirectTo: window.location.origin + '/dashboard',
    },
  });
  return error ? { success: false, error: friendlyError(error.message) } : { success: true };
}

export async function verifyEmailOtp(email: string, token: string): Promise<AuthResult> {
  const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
  return error ? { success: false, error: friendlyError(error.message) } : { success: true };
}

export async function resendEmailOtp(email: string): Promise<AuthResult> {
  return sendEmailOtp(email);
}

export async function signInWithGoogle(): Promise<AuthResult> {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin + '/dashboard',
    },
  });
  return error ? { success: false, error: friendlyError(error.message) } : { success: true };
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, user_id, email, full_name, avatar_url, provider, created_at, updated_at, last_login_at')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) return null;
  return data as Profile | null;
}

type ProviderMeta = {
  email: string | undefined;
  fullName: string | null;
  avatarUrl: string | null;
  provider: string;
};

function extractProviderMeta(user: User): ProviderMeta {
  const isGoogle = user.app_metadata?.provider === 'google';
  const meta = user.user_metadata ?? {};
  return {
    email: user.email,
    fullName: meta.full_name ?? meta.name ?? null,
    avatarUrl: meta.avatar_url ?? meta.picture ?? null,
    provider: isGoogle ? 'google' : 'email',
  };
}

export async function initializeUserProfile(user: User): Promise<Profile | null> {
  const meta = extractProviderMeta(user);
  if (!meta.email) return null;

  // 1. Primary profiles table
  let profileResult: Profile | null = null;
  try {
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id, user_id, email, full_name, avatar_url, provider, created_at, updated_at, last_login_at')
      .eq('user_id', user.id)
      .maybeSingle();

    if (existingProfile) {
      const { data, error } = await supabase
        .from('profiles')
        .update({
          email: meta.email,
          full_name: meta.fullName || meta.email.split('@')[0],
          avatar_url: meta.avatarUrl,
          provider: meta.provider,
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id)
        .select('id, user_id, email, full_name, avatar_url, provider, created_at, updated_at, last_login_at')
        .maybeSingle();

      if (error) console.error('[authService] profiles update error:', error.message);
      profileResult = (data || existingProfile) as Profile;
    } else {
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: user.id,
          email: meta.email,
          full_name: meta.fullName || meta.email.split('@')[0],
          avatar_url: meta.avatarUrl,
          provider: meta.provider,
        })
        .select('id, user_id, email, full_name, avatar_url, provider, created_at, updated_at, last_login_at')
        .maybeSingle();

      if (error) console.error('[authService] profiles insert error:', error.message);
      profileResult = data as Profile;
    }
  } catch (e) {
    console.error('[authService] profiles exception:', e);
  }

  // 2. Also populate user_profiles table in Supabase (SELECT -> UPDATE or INSERT)
  try {
    const { data: existingUserProf } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('user_id', user.id)
      .maybeSingle();

    const userProfData = {
      user_id: user.id,
      full_name: meta.fullName || meta.email.split('@')[0],
      email: meta.email,
    };

    if (existingUserProf) {
      const { error: updErr } = await supabase
        .from('user_profiles')
        .update(userProfData)
        .eq('user_id', user.id);
      if (updErr) console.error('[authService] user_profiles update error:', updErr.message);
    } else {
      const { error: insErr } = await supabase
        .from('user_profiles')
        .insert(userProfData);
      if (insErr) console.error('[authService] user_profiles insert error:', insErr.message);
    }
  } catch (e) {
    console.error('[authService] user_profiles exception:', e);
  }

  return profileResult;
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session);
  });
  return data.subscription;
}
