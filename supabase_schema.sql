
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'User',
  organization_name TEXT,
  workspace_id TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile."
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. PROJECTS TABLE
CREATE TABLE public.projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  client_name TEXT,
  case_number TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS for Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects."
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create projects."
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects."
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects."
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- 3. ASSISTANTS TABLE (Custom user assistants)
CREATE TABLE public.assistants (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  system_prompt TEXT,
  tags TEXT[],
  image_url TEXT,
  is_public BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- RLS for Assistants
ALTER TABLE public.assistants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public assistants are viewable by everyone."
  ON public.assistants FOR SELECT
  USING (is_public = true);

CREATE POLICY "Users can view own assistants."
  ON public.assistants FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create assistants."
  ON public.assistants FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assistants."
  ON public.assistants FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own assistants."
  ON public.assistants FOR DELETE
  USING (auth.uid() = user_id);

-- 4. STORAGE BUCKET SETUP
-- Note: You must create the 'attachments' bucket in the Supabase Dashboard manually if this script fails (SQL bucket creation is sometimes restricted).

INSERT INTO storage.buckets (id, name, public) 
VALUES ('attachments', 'attachments', true)
ON CONFLICT (id) DO NOTHING;

-- Storage Policies
CREATE POLICY "Avatar images are publicly accessible."
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'attachments' );

CREATE POLICY "Anyone can upload an avatar."
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'attachments' AND auth.role() = 'authenticated' );

CREATE POLICY "Anyone can update their own avatar."
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'attachments' AND auth.uid() = owner )
  WITH CHECK ( bucket_id = 'attachments' AND auth.uid() = owner );

-- 5. TRIGGER FOR NEW USERS
-- Automatically create a profile entry when a new user signs up via Auth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (new.id, new.email, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
