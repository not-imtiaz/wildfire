'use client'

import { useEffect, useState, useCallback, useMemo } from 'react'
import { supabase, Thought, Profile } from '@/lib/supabase'
import { FeedCard } from '@/components/feed-card'
import { DetailPanel } from '@/components/detail-panel'
import { useSearchParams } from 'next/navigation'

type Category = 'all' | 'startup_idea' | 'hackathon_winner' | 'daily_problem' | 'projects'

export default function Home() {
  const [thoughts, setThoughts] = useState<(Thought & { profiles: Profile })[]>([])
  const [selectedThoughtId, setSelectedThoughtId] = useState<string | null>(null)
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [savedThoughts, setSavedThoughts] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingCofounder, setIsSubmittingCofounder] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const searchParams = useSearchParams()
  const searchQuery = searchParams.get('q') || ''

  // Fetch thoughts
  const fetchThoughts = useCallback(async () => {
    try {
      setIsLoading(true)
      let query = supabase
        .from('thoughts')
        .select('*, profiles(*)')

      if (activeCategory !== 'all') {
        query = query.eq('type', activeCategory)
      }

      const { data, error } = await query.order('created_at', { ascending: false })

      if (error) {
        console.error('[v0] Error fetching thoughts:', error)
        return
      }

      setThoughts(data || [])
    } catch (err) {
      console.error('[v0] Fetch thoughts error:', err)
    } finally {
      setIsLoading(false)
    }
  }, [activeCategory])

  // Fetch saved thoughts
  const fetchSavedThoughts = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data, error } = await supabase
        .from('saved_thoughts')
        .select('thought_id')
        .eq('user_id', user.id)

      if (!error && data) {
        setSavedThoughts(new Set(data.map((s) => s.thought_id)))
      }
    } catch (err) {
      console.error('[v0] Fetch saved thoughts error:', err)
    }
  }, [])

  // Initial load
  useEffect(() => {
    fetchThoughts()
    fetchSavedThoughts()
  }, [fetchThoughts, fetchSavedThoughts])

  // Filter thoughts based on search
  const filteredThoughts = useMemo(() => {
    if (!searchQuery.trim()) return thoughts

    const query = searchQuery.toLowerCase()
    return thoughts.filter(
      (thought) =>
        thought.title.toLowerCase().includes(query) ||
        thought.description.toLowerCase().includes(query) ||
        thought.tags.some((tag) => tag.toLowerCase().includes(query))
    )
  }, [thoughts, searchQuery])

  const selectedThought = filteredThoughts.find(
    (t) => t.id === selectedThoughtId
  )

  const handleSaveToggle = async (thoughtId: string) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log('[v0] User not authenticated')
        return
      }

      const isSaved = savedThoughts.has(thoughtId)

      if (isSaved) {
        // Remove from saved
        const { error } = await supabase
          .from('saved_thoughts')
          .delete()
          .eq('user_id', user.id)
          .eq('thought_id', thoughtId)

        if (!error) {
          setSavedThoughts((prev) => {
            const newSet = new Set(prev)
            newSet.delete(thoughtId)
            return newSet
          })
        }
      } else {
        // Add to saved
        const { error } = await supabase
          .from('saved_thoughts')
          .insert({
            user_id: user.id,
            thought_id: thoughtId,
          })

        if (!error) {
          setSavedThoughts((prev) => new Set([...prev, thoughtId]))
        }
      }
    } catch (err) {
      console.error('[v0] Save toggle error:', err)
    }
  }

  const handleCofounderSubmit = async (data: {
    applicant_name: string
    applicant_email: string
    applicant_skills: string[]
    message: string
  }) => {
    if (!selectedThought) return

    try {
      setIsSubmittingCofounder(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        console.log('[v0] User not authenticated')
        return
      }

      const { error } = await supabase
        .from('co_founder_applications')
        .insert({
          thought_id: selectedThought.id,
          applicant_id: user.id,
          applicant_name: data.applicant_name,
          applicant_email: data.applicant_email,
          applicant_skills: data.applicant_skills,
          message: data.message || null,
        })

      if (!error) {
        setSubmitSuccess(true)
        setTimeout(() => setSubmitSuccess(false), 3000)
      } else {
        console.error('[v0] Submit error:', error)
      }
    } catch (err) {
      console.error('[v0] Cofounder submit error:', err)
    } finally {
      setIsSubmittingCofounder(false)
    }
  }

  return (
    <>
      <div className="thoughts-center thoughts-scrollbar h-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto border border-border rounded-xl animate-pulse" />
              <p className="text-sm text-muted-foreground">Loading thoughts...</p>
            </div>
          </div>
        ) : filteredThoughts.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-3">
              <div className="w-12 h-12 mx-auto bg-card border border-border rounded-xl flex items-center justify-center">
                <span className="text-xl">∅</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {searchQuery
                  ? 'No thoughts match your search'
                  : 'No thoughts in this category yet'}
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3 p-6">
            {filteredThoughts.map((thought) => (
              <FeedCard
                key={thought.id}
                thought={thought}
                isSelected={selectedThoughtId === thought.id}
                onSelect={() => setSelectedThoughtId(thought.id)}
                isSaved={savedThoughts.has(thought.id)}
                onSaveToggle={() => handleSaveToggle(thought.id)}
              />
            ))}
          </div>
        )}
      </div>

      <DetailPanel
        thought={selectedThought || null}
        isSaved={selectedThought ? savedThoughts.has(selectedThought.id) : false}
        onSaveToggle={() =>
          selectedThought && handleSaveToggle(selectedThought.id)
        }
        onCofounderSubmit={handleCofounderSubmit}
        isLoadingSubmit={isSubmittingCofounder}
        submitSuccess={submitSuccess}
      />
    </>
  )
}
