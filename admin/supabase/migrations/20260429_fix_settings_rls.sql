-- Fix RLS policies and initialization for settings table
-- Date: 2026-04-29

-- 1. Ensure RLS is enabled
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Anyone can view settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can update settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can insert settings" ON public.settings;
DROP POLICY IF EXISTS "Admins can delete settings" ON public.settings;

-- 3. Create comprehensive policies
-- Allow anyone (including anonymous users) to read settings (needed for storefront)
CREATE POLICY "Anyone can view settings"
ON public.settings FOR SELECT
USING (true);

-- Allow authenticated admins to manage settings
CREATE POLICY "Admins can insert settings"
ON public.settings FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update settings"
ON public.settings FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete settings"
ON public.settings FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 4. Ensure there is at least one row in the settings table
-- This prevents .single() from failing with 406 Not Acceptable
INSERT INTO public.settings (shop_name, sold_count, rating, followers)
SELECT 'Achadinhos do Momento', '140.292', '98%', '3.2M'
WHERE NOT EXISTS (SELECT 1 FROM public.settings);

-- 5. Ensure all columns mentioned in admin.configuracoes.tsx exist
-- (Some might have been added in previous migrations, but we ensure here)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='logo_url') THEN
        ALTER TABLE public.settings ADD COLUMN logo_url TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='sold_count') THEN
        ALTER TABLE public.settings ADD COLUMN sold_count TEXT DEFAULT '0';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='tracking_link') THEN
        ALTER TABLE public.settings ADD COLUMN tracking_link TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='head_script') THEN
        ALTER TABLE public.settings ADD COLUMN head_script TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='rating') THEN
        ALTER TABLE public.settings ADD COLUMN rating TEXT DEFAULT '98%';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='followers') THEN
        ALTER TABLE public.settings ADD COLUMN followers TEXT DEFAULT '0';
    END IF;
END $$;
