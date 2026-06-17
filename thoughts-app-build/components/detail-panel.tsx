'use client'

import { Thought, Profile, SavedThought, CofounderApplication } from '@/lib/supabase'
import { BookmarkIcon, Share2, Play, Code } from 'lucide-react'
import { CofounderForm } from './cofounder-form'
import { useState } from 'react'

interface DetailPanelProps {
  thought: (Thought & { profiles: Profile }) | null
  isSaved?: boolean
  onSaveToggle?: () => void
  onCofounderSubmit?: (data: {
    applicant_name: string
    applicant_email: string
    applicant_skills: string[]
    message: string
  }) => Promise<void>
  isLoadingSubmit?: boolean
  submitSuccess?: boolean
}

const typeLabels: Record<string, string> = {
  startup_idea: 'Startup Idea',
  hackathon_winner: 'Hackathon Win',
  daily_problem: 'Daily Problem',
  projects: 'Project',
}

export function DetailPanel({
  thought,
  isSaved = false,
  onSaveToggle,
  onCofounderSubmit,
  isLoadingSubmit = false,
  submitSuccess = false,
}: DetailPanelProps) {
  if (!thought) {
    return (
      <div className="thoughts-detail bg-background border-l border-border rounded-xl p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-card border border-border rounded-xl mx-auto mb-4 flex items-center justify-center">
            <span className="text-xl">→</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Select a thought to explore details
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="thoughts-detail bg-background border-l border-border rounded-xl overflow-hidden flex flex-col">
      <div className="flex-1 overflow-y-auto thoughts-scrollbar">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <span className="text-xs font-bold px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
                {typeLabels[thought.type] || thought.type}
              </span>
              <button
                onClick={onSaveToggle}
                className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-accent transition-colors"
              >
                <BookmarkIcon
                  className={`w-5 h-5 ${isSaved ? 'fill-accent stroke-accent' : ''}`}
                />
              </button>
            </div>

            <h1 className="text-2xl font-bold text-foreground">{thought.title}</h1>
            <p className="text-base text-muted-foreground">{thought.description}</p>
          </div>

          {/* Author */}
          <div className="pt-3 border-t border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center">
                <span className="text-xs font-bold">
                  {thought.profiles?.display_name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {thought.profiles?.display_name}
                </p>
                <p className="text-xs text-muted-foreground">
                  @{thought.profiles?.username}
                </p>
                {thought.profiles?.school && (
                  <p className="text-xs text-muted-foreground">
                    {thought.profiles.school}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Full Content */}
          {thought.content && (
            <div className="pt-3 border-t border-border">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Full Details
              </h2>
              <div className="prose prose-invert max-w-none">
                <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                  {thought.content}
                </p>
              </div>
            </div>
          )}

          {/* Tags */}
          {thought.tags && thought.tags.length > 0 && (
            <div className="pt-3 border-t border-border">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {thought.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-3 py-1 bg-card border border-border text-foreground rounded-lg"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Resources */}
          {(thought.live_demo_link ||
            thought.github_repo_link ||
            thought.youtube_video_link) && (
            <div className="pt-3 border-t border-border">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
                Resources
              </h2>
              <div className="space-y-2">
                {thought.live_demo_link && (
                  <a
                    href={thought.live_demo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-card border border-border hover:border-accent rounded-lg text-sm text-foreground transition-colors"
                  >
                    <Share2 className="w-4 h-4" />
                    Live Demo
                  </a>
                )}
                {thought.github_repo_link && (
                  <a
                    href={thought.github_repo_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-card border border-border hover:border-accent rounded-lg text-sm text-foreground transition-colors"
                  >
                    <Code className="w-4 h-4" />
                    GitHub Repository
                  </a>
                )}
                {thought.youtube_video_link && (
                  <a
                    href={thought.youtube_video_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-2 bg-card border border-border hover:border-accent rounded-lg text-sm text-foreground transition-colors"
                  >
                    <Play className="w-4 h-4" />
                    YouTube Video
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Cofounder Section */}
          {thought.looking_for_cofounders && (
            <div className="pt-3 border-t border-border">
              <h2 className="text-xs font-bold text-destructive/80 uppercase tracking-wider mb-3">
                Seeking Co-founders
              </h2>
              {thought.cofounder_roles && thought.cofounder_roles.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Roles needed:</p>
                  <div className="flex flex-wrap gap-2">
                    {thought.cofounder_roles.map((role, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-3 py-1 bg-destructive/10 border border-destructive/20 text-destructive/90 rounded-lg"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="p-6 border-t border-border space-y-3">
        {thought.looking_for_cofounders && onCofounderSubmit ? (
          <CofounderForm
            thought={thought}
            onSubmit={onCofounderSubmit}
            isLoading={isLoadingSubmit}
            isSuccess={submitSuccess}
          />
        ) : thought.looking_for_cofounders ? (
          <button className="w-full px-4 py-3 bg-destructive/20 text-destructive border border-destructive/30 font-bold rounded-lg hover:opacity-90 transition-opacity cursor-not-allowed">
            Sign in to Apply
          </button>
        ) : (
          <button className="w-full px-4 py-3 bg-card border border-border text-foreground font-bold rounded-lg hover:border-accent transition-colors">
            Save Thought
          </button>
        )}
      </div>
    </div>
  )
}
