/*
# Create profiles table for ResUme NoW

## Purpose
Stores application-level profile data for each authenticated user, keyed by
their Supabase auth user id. One row per user (user_id is unique). Used by both
the Email OTP and Google OAuth login flows to persist profile information
(email, full name, avatar, provider) and track last login time.

## New Tables
- `profiles`
  - `id`           uuid primary key (default gen_random_uuid)
  - `user_id`      uuid NOT NULL, unique, references auth.users(id) ON DELETE CASCADE,
                   defaults to auth.uid() so inserts from the authenticated client
                   succeed even when user_id is omitted.
  - `email`        text NOT NULL
  - `full_name`    text, nullable (Google supplies it; email OTP may not)
  - `avatar_url`   text, nullable
  - `provider`     text NOT NULL (e.g. 'email', 'google')
  - `created_at`   timestamptz default now()
  - `updated_at`   timestamptz default now()
  - `last_login_at` timestamptz default now()

## Security
- Row Level Security enabled on `profiles`.
- Four owner-scoped policies (SELECT/INSERT/UPDATE/DELETE) restricted to
  `authenticated` using `auth.uid() = user_id`.
- No public/anon access.
- Updated_at is auto-maintained by a trigger on UPDATE.

## Notes
1. Idempotent: safe to re-run.
2. user_id has DEFAULT auth.uid() so the frontend can insert a profile without
   explicitly passing user_id; the database fills it from the session.
3. ON DELETE CASCADE means deleting the auth.users row removes the profile.
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text,
  avatar_url text,
  provider text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  last_login_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile"
ON profiles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile"
ON profiles FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile"
ON profiles FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile"
ON profiles FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- Auto-update updated_at on row update
DROP TRIGGER IF EXISTS profiles_set_updated_at ON profiles;
CREATE OR REPLACE FUNCTION profiles_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_set_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION profiles_set_updated_at();
