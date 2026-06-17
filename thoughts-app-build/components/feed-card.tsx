'use client'

import { Thought, Profile } from '@/lib/supabase'
import { BookmarkIcon, Users2 } from 'lucide-react'

interface FeedCardProps {
  thought: Thought & { profiles: Profile }
  isSelected: boolean
  onSelect: () => void
  isSaved?: boolean
  onSaveToggle?: () => void
}

const typeLabels: Record<string, string> = {
  startup_idea: 'Startup Idea',
  hackathon_winner: 'Hackathon Win',
  daily_problem: 'Daily Problem',
  projects: 'Project',
}

export function FeedCard({
  thought,
  isSelected,
  onSelect,
  isSaved = false,
  onSaveToggle,
}: FeedCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`thoughts-card w-full p-5 text-left transition-all duration-200 ${
        isSelected ? 'border-accent bg-card' : 'hover:border-accent/40'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-1 bg-secondary text-secondary-foreground rounded-md">
            {typeLabels[thought.type] || thought.type}
          </span>
          {thought.looking_for_cofounders && (
            <span className="text-xs font-bold px-2 py-1 bg-destructive/20 text-destructive rounded-md flex items-center gap-1">
              <Users2 className="w-3 h-3" />
              Seeking Co-founders
            </span>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            onSaveToggle?.()
          }}
          className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-accent transition-colors"
        >
          <BookmarkIcon
            className={`w-4 h-4 ${isSaved ? 'fill-accent stroke-accent' : ''}`}
          />
        </button>
      </div>

      <h3 className="font-bold text-foreground mb-2 line-clamp-2">{thought.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{thought.description}</p>

      <div className="flex items-center justify-between pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground">
          by <span className="font-semibold text-foreground">{thought.profiles?.display_name}</span>
        </span>
        <time className="text-xs text-muted-foreground">
          {new Date(thought.created_at).toLocaleDateString()}
        </time>
      </div>

      {thought.tags && thought.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {thought.tags.slice(0, 3).map((tag, idx) => (
            <span key={idx} className="text-xs px-2 py-0.5 bg-background text-muted-foreground rounded border border-border">
              #{tag}
            </span>
          ))}
          {thought.tags.length > 3 && (
            <span className="text-xs px-2 py-0.5 text-muted-foreground">+{thought.tags.length - 3}</span>
          )}
        </div>
      )}
    </button>
  )
}
