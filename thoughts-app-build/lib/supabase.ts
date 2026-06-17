import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Profile = {
  id: string
  username: string
  display_name: string
  bio: string | null
  age: number | null
  school: string | null
  twitter_link: string | null
  linkedin_link: string | null
  github_link: string | null
  show_email_publicly: boolean
  show_phone_publicly: boolean
  created_at: string
  updated_at: string
}

export type Thought = {
  id: string
  user_id: string
  title: string
  description: string
  content: string | null
  type: 'startup_idea' | 'hackathon_winner' | 'daily_problem' | 'projects'
  tags: string[]
  looking_for_cofounders: boolean
  cofounder_roles: string[]
  live_demo_link: string | null
  github_repo_link: string | null
  youtube_video_link: string | null
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type SavedThought = {
  id: string
  user_id: string
  thought_id: string
  created_at: string
}

export type CofounderApplication = {
  id: string
  thought_id: string
  applicant_id: string
  applicant_name: string
  applicant_email: string
  applicant_skills: string[]
  message: string | null
  status: 'pending' | 'accepted' | 'rejected'
  created_at: string
  updated_at: string
}
