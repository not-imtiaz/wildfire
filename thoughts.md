thoughts. Project Specs
thoughts. project Specs

The vision: A high-fidelity launchpad for student builders (13-24) to find startup ideas, winning hackathon projects, and real-world problems.

Layout & Interface (Inspired by HALL OF HACKS)

-Top Navbar: Brand name, global search bar, light/dark mode toggle, and a "Publish Thought" button.
-Left Sidebar: Filters for All Neural Feed, Startup Ideas, Hackathon Wins, and Daily Problems.
-Center Feed: Scannable project cards with colored status bars (Purple for Hackathon Wins, Amber for Startup Ideas, Emerald for Daily Problems) and a "Co-Founder Wanted" badge.
-Right Panel: Sticky detailed preview with an aspect-ratio placeholder for video demos, deep-dive descriptions, and an "Apply as Co-Founder" button.

Core Features & Logic

-AI Onboarding: Conversational onboarding flow (3 Questions via Claude or Gemini) to tag user interests and personalize their dashboard feed.
-Privacy Controls: 3 Visibility Tiers: Private (author only), Listed (Direct link only), and Public (open to feed & leaderboard).
-Gamification: A "Neuron Leaderboard" displaying top upvoted projects and active builders.

Tech Stack Blueprint

-Frontend: React + Tailwind CSS (configured for default midnight dark mode and a clean light mode canvas)/Flutter
-Backend: Supabase with Row Level Security (RLS) for privacy control and real-time database capabilities.