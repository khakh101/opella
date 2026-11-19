-- Opella AI Operating Model (AmplifAI) Database Schema
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create the use cases table
CREATE TABLE IF NOT EXISTS opella_use_cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  tier TEXT NOT NULL,
  mode TEXT NOT NULL,
  risk_tier TEXT NOT NULL,
  current_gate TEXT NOT NULL,
  status TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- 2. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_opella_tier ON opella_use_cases(tier);
CREATE INDEX IF NOT EXISTS idx_opella_status ON opella_use_cases(status);
CREATE INDEX IF NOT EXISTS idx_opella_current_gate ON opella_use_cases(current_gate);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE opella_use_cases ENABLE ROW LEVEL SECURITY;

-- 4. Enable Realtime on the table (for live updates across users)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE opella_use_cases;
  END IF;
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- 5. Public access policies for collaboration across team members
DROP POLICY IF EXISTS "Allow public read access" ON opella_use_cases;
DROP POLICY IF EXISTS "Allow public insert access" ON opella_use_cases;
DROP POLICY IF EXISTS "Allow public update access" ON opella_use_cases;
DROP POLICY IF EXISTS "Allow public delete access" ON opella_use_cases;

CREATE POLICY "Allow public read access"
  ON opella_use_cases FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON opella_use_cases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON opella_use_cases FOR UPDATE
  USING (true);

CREATE POLICY "Allow public delete access"
  ON opella_use_cases FOR DELETE
  USING (true);
