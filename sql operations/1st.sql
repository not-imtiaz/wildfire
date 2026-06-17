-- ========================================================
-- CLEANUP: Wipe out existing tables to prevent conflicts
-- ========================================================
DROP TABLE IF EXISTS public.upvotes CASCADE;
DROP TABLE IF EXISTS public.saved_thoughts CASCADE;
DROP TABLE IF EXISTS public.co_founder_applications CASCADE;
DROP TABLE IF EXISTS public.messages CASCADE;
DROP TABLE IF EXISTS public.thoughts CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- ========================================================
-- 1. PROFILES TABLE (Custom user data linked to Auth)
-- ========================================================
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 13), -- Enforces teen builder policy
    bio TEXT,
    school TEXT,
    
    -- Contact & Privacy Configurations
    email TEXT NOT NULL,
    phone_number TEXT,
    show_email_publicly BOOLEAN DEFAULT FALSE,
    show_phone_publicly BOOLEAN DEFAULT FALSE,
    
    -- Social Handshakes
    github_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ========================================================
-- 2. THOUGHTS & PROJECTS TABLE (The core feed engine)
-- ========================================================
CREATE TABLE public.thoughts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL, -- Supports full Markdown rendering
    
    -- Categories: startup_idea, hackathon_winner, daily_problem, projects
    type TEXT NOT NULL CHECK (type IN ('startup_idea', 'hackathon_winner', 'daily_problem', 'projects')),
    visibility TEXT NOT NULL CHECK (visibility IN ('private', 'listed', 'public')),
    looking_for_co_founders BOOLEAN DEFAULT FALSE,
    
    -- Optional external reference metrics
    live_demo_url TEXT,
    github_repo_url TEXT,
    youtube_video_url TEXT,
    
    -- Tags for categorization and deep querying
    tags TEXT[] DEFAULT '{}',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Optimization indexing for instant search capabilities
CREATE INDEX idx_thoughts_type ON public.thoughts(type);

-- ========================================================
-- 3. CO-FOUNDER MATCHMAKING & SAVED THOUGHTS
-- ========================================================

-- "Apply Later" table (Saves a thought to review or apply to later)
CREATE TABLE public.saved_thoughts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    thought_id UUID REFERENCES public.thoughts(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (user_id, thought_id)
);

-- "Apply as a Co-Founder" table (Stores formal team applications)
CREATE TABLE public.co_founder_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thought_id UUID REFERENCES public.thoughts(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    
    -- Form application dynamic inputs
    cover_letter TEXT NOT NULL,
    skills_offered TEXT[] DEFAULT '{}',
    portfolio_links TEXT[],
    
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE (thought_id, applicant_id)
);

-- ========================================================
-- 4. END-TO-END ENCRYPTED MESSAGING SCHEMATICS
-- ========================================================
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    
    -- Encrypted payload text blob (handled via client-side keys)
    encrypted_payload TEXT NOT NULL,
    
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_messages_conversation ON public.messages(sender_id, receiver_id);

-- ========================================================
-- 5. ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_thoughts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.co_founder_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Profiles are publicly viewable" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Thoughts Policies (Fixed separate UPDATE and DELETE rules)
CREATE POLICY "Users can create their own thoughts" ON public.thoughts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own thoughts" ON public.thoughts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete their own thoughts" ON public.thoughts FOR DELETE USING (auth.uid() = user_id);
CREATE POLICY "Thoughts read permissions mapping" ON public.thoughts FOR SELECT USING (
    visibility = 'public'                   
    OR visibility = 'listed'               
    OR (auth.uid() = user_id)              
);

-- Messages Policies
CREATE POLICY "Messages are end-to-end private" ON public.messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = receiver_id);
CREATE POLICY "Users can send messages" ON public.messages FOR INSERT WITH CHECK (auth.uid() = sender_id);