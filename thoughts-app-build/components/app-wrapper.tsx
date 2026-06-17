'use client'

import { useEffect, useState, useCallback } from 'react'
import { usePathname } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sidebar } from '@/components/sidebar'
import { TopNav } from '@/components/top-nav'

type Category = 'all' | 'startup_idea' | 'hackathon_winner' | 'daily_problem' | 'projects'

interface AppWrapperProps {
  children: React.ReactNode
}

export function AppWrapper({ children }: AppWrapperProps) {
  const pathname = usePathname()
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [userName, setUserName] = useState<string>('Builder')

  const fetchUserProfile = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .single()

      if (data?.display_name) {
        setUserName(data.display_name)
      }
    } catch (err) {
      console.error('[v0] Fetch profile error:', err)
    }
  }, [])

  useEffect(() => {
    fetchUserProfile()
  }, [fetchUserProfile])

  // Only show sidebar and topnav on these pages
  const showLayout = !pathname.startsWith('/login') && !pathname.startsWith('/auth')

  if (!showLayout) {
    return <>{children}</>
  }

  return (
    <div className="thoughts-layout">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={(cat) => {
          setActiveCategory(cat)
          setSearchQuery('')
        }}
        onLogout={() => supabase.auth.signOut()}
        userName={userName}
      />

      <div className="thoughts-feed-container">
        <TopNav onSearch={setSearchQuery} />

        <div className="thoughts-main-content">
          <div className="flex-1 overflow-hidden">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
