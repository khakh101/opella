-- Opella AI Operating Model (AmplifAI) Database Schema
-- Run this in your Supabase SQL Editor to initialize the database

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

-- Enable Row Level Security (RLS)
ALTER TABLE opella_use_cases ENABLE ROW LEVEL SECURITY;

-- Allow public read/write for demo and internal team usage
-- (Can be restricted to authenticated users with Supabase Auth)
CREATE POLICY "Allow public read access"
  ON opella_use_cases FOR SELECT
  USING (true);

CREATE POLICY "Allow public insert access"
  ON opella_use_cases FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public update access"
  ON opella_use_cases FOR UPDATE
  USING (true);
