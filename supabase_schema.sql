-- =============================================================================
--  💕 Will You Go on a Date With Me? — Supabase Database Schema
-- =============================================================================
--  How to run this:
--  1. Go to your Supabase Dashboard: https://supabase.com/dashboard
--  2. Select your project: vzortbasdabwcixefyww
--  3. Click "SQL Editor" in the left sidebar
--  4. Paste this entire script into a "New query" and click "Run" (or Ctrl + Enter)
-- =============================================================================

-- 1. Create the `date_responses` table
CREATE TABLE IF NOT EXISTS public.date_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT,
    accepted BOOLEAN NOT NULL DEFAULT true,
    free_day TEXT,
    vibe TEXT,
    food TEXT,
    perfect_date TEXT,
    date TEXT,
    time TEXT,
    location TEXT,
    message TEXT
);

-- 2. Add helpful column comments
COMMENT ON TABLE public.date_responses IS 'Stores date invitation responses and choices submitted by your date';
COMMENT ON COLUMN public.date_responses.name IS 'Name of the recipient from URL query param ?name=... or manual entry';
COMMENT ON COLUMN public.date_responses.accepted IS 'Whether she/he said YES (always true in this app!)';
COMMENT ON COLUMN public.date_responses.free_day IS 'Selected free day (e.g. Saturday, Friday, etc.)';
COMMENT ON COLUMN public.date_responses.vibe IS 'Chosen date vibe (e.g. Dinner, Movie, Chill, Walk)';
COMMENT ON COLUMN public.date_responses.food IS 'Chosen food type (e.g. Pizza, Restaurant, Coffee, etc.)';
COMMENT ON COLUMN public.date_responses.perfect_date IS 'What makes a perfect date (e.g. Good conversation, Lots of laughs)';
COMMENT ON COLUMN public.date_responses.date IS 'Chosen calendar date (YYYY-MM-DD)';
COMMENT ON COLUMN public.date_responses.time IS 'Chosen time (HH:MM)';
COMMENT ON COLUMN public.date_responses.location IS 'Chosen location or custom venue';
COMMENT ON COLUMN public.date_responses.message IS 'Sweet custom message / note left by your date';

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.date_responses ENABLE ROW LEVEL SECURITY;

-- 4. Policies for anon/public access via the web app
-- Allow anyone to submit a date response
DROP POLICY IF EXISTS "Allow public inserts to date_responses" ON public.date_responses;
CREATE POLICY "Allow public inserts to date_responses"
ON public.date_responses
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Allow the admin dashboard to read all responses
DROP POLICY IF EXISTS "Allow public reads from date_responses" ON public.date_responses;
CREATE POLICY "Allow public reads from date_responses"
ON public.date_responses
FOR SELECT
TO anon, authenticated
USING (true);

-- Allow deleting entries from the admin dashboard
DROP POLICY IF EXISTS "Allow public deletes on date_responses" ON public.date_responses;
CREATE POLICY "Allow public deletes on date_responses"
ON public.date_responses
FOR DELETE
TO anon, authenticated
USING (true);

-- 5. Enable Supabase Realtime (optional, allows live dashboard updates)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
      AND schemaname = 'public' 
      AND tablename = 'date_responses'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.date_responses;
  END IF;
END $$;

-- 6. Quick verification query
SELECT * FROM public.date_responses ORDER BY created_at DESC;
