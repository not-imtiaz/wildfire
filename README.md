# thoughts. — Launchpad for Student Builders

A premium, hyper-symmetric web application engineered for student builders and developers. **thoughts.** serves as an elite stream and matchmaking network where teens and students can publish ongoing projects, broadcast startup concepts, document hackathon triumphs, and organically connect with technical co-founders.

Built with a zero-gradient, monochrome brutalist luxury aesthetic, the application features an uncompromised, mathematically balanced three-column grid interface powered by a secure, locked-down PostgreSQL core.

---

## 🎨 Design System & Philosophy

- **Absolute Geometric Symmetry:** The interface enforces a strict 12-column structural alignment layout with standard container metrics ensuring a clean, unfragmented horizontal skyline baseline.
- **Zero-Gradient Minimalism:** Devoid of visual clutter or distracting linear gradients. Built purely on flat, rich monochrome dark palettes (`#0B0B0F`), deep charcoal containers (`bg-zinc-900`), and razor-sharp border vectors (`border-zinc-800`).
- **Contextual Categorization:** Every stream item maps to structural vertical accent colors:
  - 🔸 **Amber:** Startup Ideas
  - 🍇 **Purple:** Hackathon Wins
  - 🟢 **Emerald:** Daily Problems
  - 🔵 **Blue:** Active Projects

---

## 🛠️ Architecture & Tech Stack

- **Frontend Framework:** Next.js 14 (App Router) / React 18 / TypeScript
- **Styling Core:** Tailwind CSS / Custom Shadcn/ui Geometry
- **Database & Authentication:** Supabase (PostgreSQL)
- **Security Control:** Strict PostgreSQL Row Level Security (RLS)

---

## 💾 Database Schema & Relational Structure

The backend engine handles unique developer profile generation, categorical indexing, matching requests, and end-to-end user privacy structures:

SQL
-- 1. DEVELOPER PROFILES (Custom Metadata Linked to Core Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    age INT NOT NULL CHECK (age >= 13),
    bio TEXT,
    school TEXT,
    email TEXT NOT NULL,
    phone_number TEXT,
    show_email_publicly BOOLEAN DEFAULT FALSE,
    show_phone_publicly BOOLEAN DEFAULT FALSE,
    github_url TEXT,
    linkedin_url TEXT,
    instagram_url TEXT,
    facebook_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. THOUGHTS & PROJECTS ENGINE
CREATE TABLE public.thoughts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL, -- Supports Markdown Rendering
    type TEXT NOT NULL CHECK (type IN ('startup_idea', 'hackathon_winner', 'daily_problem', 'projects')),
    visibility TEXT NOT NULL CHECK (visibility IN ('private', 'listed', 'public')),
    looking_for_co_founders BOOLEAN DEFAULT FALSE,
    live_demo_url TEXT,
    github_repo_url TEXT,
    youtube_video_url TEXT,
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_thoughts_type ON public.thoughts(type);

-- 3. MATCHMAKING & APPLICATIONS
CREATE TABLE public.saved_thoughts (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    thought_id UUID REFERENCES public.thoughts(id) ON DELETE CASCADE NOT NULL,
    UNIQUE (user_id, thought_id)
);

CREATE TABLE public.co_founder_applications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    thought_id UUID REFERENCES public.thoughts(id) ON DELETE CASCADE NOT NULL,
    applicant_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    cover_letter TEXT NOT NULL,
    skills_offered TEXT[] DEFAULT '{}',
    portfolio_links TEXT[],
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined')),
    UNIQUE (thought_id, applicant_id)
);

-- 4. MESSAGING SYSTEM
CREATE TABLE public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    sender_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    receiver_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL NOT NULL,
    encrypted_payload TEXT NOT NULL, -- Client-Side End-to-End Encrypted Payload
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

🔐 Security & Visibility Policies (RLS)
Data boundary safety is strictly implemented at the database level:

Profiles Visibility: Publicly readable profiles (USING (true)). However, conditional masking filters hide email/phone fields programmatically unless show_email_publicly or show_phone_publicly flags are enabled by the owner.

Strict Thought Access Control:

public or listed posts can be read by anyone globally.

private posts are structurally restricted to the creator (auth.uid() = user_id).

Update and Delete operations are broken out into individual policies restricted exclusively to the post owner.

⚡ Local Setup & Deployment Instructions
Prerequisites
Ensure you have Node.js (v18+) and your preferred package manager (pnpm, npm, or yarn) installed locally.

1. Clone & Install Dependencies
Bash
git clone https://github.com/not-imtiaz/thoughts.
cd thoughts-app-build
pnpm install
2. Configure Environment Variables
Create a .env.local or .env file in the root directory:

3. Spin Up Local Development Server
Bash
pnpm dev
Open the provided localhost address in your browser to inspect the application runtime interface.

🚀 Authentication Rules
Account Consolidation: Automatic linking is enabled for matching email IDs. Logging in with GitHub, Google, or standard email/password parameters hooks directly into the same verified student profile rather than initiating fragmented duplicate entities.
