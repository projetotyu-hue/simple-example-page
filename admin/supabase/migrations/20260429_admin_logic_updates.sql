-- 1. Update settings table to include cart_recommendations
ALTER TABLE public.settings ADD COLUMN IF NOT EXISTS cart_recommendations UUID[] DEFAULT '{}';

-- 2. Ensure all fields exist in settings
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='shop_name') THEN
        ALTER TABLE public.settings ADD COLUMN shop_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='cnpj') THEN
        ALTER TABLE public.settings ADD COLUMN cnpj TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='address') THEN
        ALTER TABLE public.settings ADD COLUMN address TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='phone') THEN
        ALTER TABLE public.settings ADD COLUMN phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='settings' AND column_name='email') THEN
        ALTER TABLE public.settings ADD COLUMN email TEXT;
    END IF;
END $$;
