-- Migration: Add job details columns to job_applications table
-- Run this in Supabase SQL Editor to add missing columns

-- Add description column
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS description TEXT;

-- Add requirements column (array of strings)
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS requirements TEXT[];

-- Add match_reasons column (array of strings)
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS match_reasons TEXT[];

-- Add job_url column
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS job_url TEXT;

-- Add job_type column
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS job_type TEXT DEFAULT 'Full-time';

-- Add tags column (array of strings)
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Add posted_at column
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS posted_at TIMESTAMPTZ;

-- Add source column
ALTER TABLE public.job_applications 
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'CareerAI';

-- Update existing rows to have default values
UPDATE public.job_applications 
SET 
  description = COALESCE(description, 'No description available'),
  requirements = COALESCE(requirements, ARRAY[]::TEXT[]),
  match_reasons = COALESCE(match_reasons, ARRAY[]::TEXT[]),
  job_url = COALESCE(job_url, ''),
  job_type = COALESCE(job_type, 'Full-time'),
  tags = COALESCE(tags, ARRAY[]::TEXT[]),
  posted_at = COALESCE(posted_at, created_at),
  source = COALESCE(source, 'CareerAI')
WHERE description IS NULL 
   OR requirements IS NULL 
   OR match_reasons IS NULL 
   OR job_url IS NULL 
   OR job_type IS NULL 
   OR tags IS NULL 
   OR posted_at IS NULL 
   OR source IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_job_applications_match_score 
ON public.job_applications(match_score DESC);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'job_applications'
ORDER BY ordinal_position;
