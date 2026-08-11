/*
# Create resumes table for ResUme NoW

## Purpose
Stores one resume record per authenticated user.
`user_id` is UNIQUE — this is the critical constraint that prevents
duplicate resume rows even if the frontend calls save multiple times.

## New Table: `resumes`
  - `id`            uuid primary key
  - `user_id`       uuid NOT NULL UNIQUE → auth.users(id) ON DELETE CASCADE
  - `title`         text  (resume title / name)
  - `template_key`  text  (selected template)
  - `resume_data`   jsonb (full resume JSON payload)
  - `created_at`    timestamptz
  - `updated_at`    timestamptz (auto-maintained by trigger)

## Security
- RLS enabled: owner-scoped policies on SELECT/INSERT/UPDATE/DELETE
- Backend derives identity from auth.uid() — frontend cannot spoof userId

## Upsert pattern (used by resumeService.ts)
  INSERT INTO resumes (user_id, ...) VALUES (auth.uid(), ...)
  ON CONFLICT (user_id) DO UPDATE SET ...
  This guarantees ONE row per user regardless of how many times save is called.
*/

-- ── Table ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL UNIQUE DEFAULT auth.uid()
                           REFERENCES auth.users(id) ON DELETE CASCADE,
  title        text        NOT NULL DEFAULT 'My Resume',
  template_key text        NOT NULL DEFAULT 'ats-6',
  resume_data  jsonb       NOT NULL DEFAULT '{}'::jsonb,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ── Row Level Security ────────────────────────────────────────────────────────
ALTER TABLE resumes ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "resumes_select_own" ON resumes;
CREATE POLICY "resumes_select_own"
  ON resumes FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "resumes_insert_own" ON resumes;
CREATE POLICY "resumes_insert_own"
  ON resumes FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "resumes_update_own" ON resumes;
CREATE POLICY "resumes_update_own"
  ON resumes FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "resumes_delete_own" ON resumes;
CREATE POLICY "resumes_delete_own"
  ON resumes FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- ── Auto-update updated_at ────────────────────────────────────────────────────
DROP TRIGGER IF EXISTS resumes_set_updated_at ON resumes;

CREATE OR REPLACE FUNCTION resumes_set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER resumes_set_updated_at
  BEFORE UPDATE ON resumes
  FOR EACH ROW
  EXECUTE FUNCTION resumes_set_updated_at();
