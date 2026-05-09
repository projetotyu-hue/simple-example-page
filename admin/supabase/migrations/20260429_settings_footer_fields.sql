-- Add missing columns to settings table
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS hours TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS followers TEXT;
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS rating TEXT;
