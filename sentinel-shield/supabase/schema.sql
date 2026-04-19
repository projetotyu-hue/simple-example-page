-- Supabase Database Schema for Sentinel Shield
-- Execute this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (using Supabase Auth, this is profile data)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Metrics table
CREATE TABLE IF NOT EXISTS public.metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ip TEXT,
    country TEXT,
    state TEXT,
    city TEXT,
    device TEXT,
    os TEXT,
    browser TEXT,
    origin TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Logs table
CREATE TABLE IF NOT EXISTS public.logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type TEXT NOT NULL,
    username TEXT,
    ip TEXT,
    status TEXT,
    device TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Cards table (encrypted)
CREATE TABLE IF NOT EXISTS public.cards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    card_number_encrypted TEXT NOT NULL,
    card_name TEXT NOT NULL,
    expiry_encrypted TEXT NOT NULL,
    cvv_encrypted TEXT NOT NULL,
    cpf_encrypted TEXT NOT NULL,
    ip TEXT,
    user_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cards ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Profiles: users can read their own profile
CREATE POLICY "Users can read own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

-- Metrics: authenticated users can read all
CREATE POLICY "Authenticated can read metrics" ON public.metrics
    FOR SELECT TO authenticated USING (true);

-- Metrics: authenticated can insert their own
CREATE POLICY "Users can insert metrics" ON public.metrics
    FOR INSERT TO authenticated WITH CHECK (true);

-- Logs: admins can read all
CREATE POLICY "Admins can read logs" ON public.logs
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND username = 'admin')
    );

-- Logs: authenticated can insert
CREATE POLICY "Users can insert logs" ON public.logs
    FOR INSERT TO authenticated WITH CHECK (true);

-- Cards: only admins can read
CREATE POLICY "Admins can read cards" ON public.cards
    FOR SELECT TO authenticated USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND username = 'admin')
    );

-- Cards: authenticated can insert (from checkout)
CREATE POLICY "Users can insert cards" ON public.cards
    FOR INSERT TO authenticated WITH CHECK (true);

-- Function to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, username)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'username');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user signup
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();