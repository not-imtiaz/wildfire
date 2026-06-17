'use client'

import { User, Zap, Trophy, Lightbulb, Code2, ChevronLeft, MessageSquare, Users, TrendingUp, ChevronDown } from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'

type Category = 'all' | 'startup_idea' | 'hackathon_winner' | 'daily_problem' | 'projects'

interface SidebarProps {
  activeCategory: Category
  onCategoryChange: (category: Category) => void
  onLogout?: () => void
  userName?: string
}

const categories = [
  { id: 'all' as Category, label: 'All Neural Feed', icon: Zap },
  { id: 'startup_idea' as Category, label: 'Startup Ideas', icon: Lightbulb },
  { id: 'hackathon_winner' as Category, label: 'Hackathon Wins', icon: Trophy },
  { id: 'daily_problem' as Category, label: 'Daily Problems', icon: Code2 },
  { id: 'projects' as Category, label: 'Projects', icon: Code2 },
]

const community = [
  { id: 'messages', label: 'Messages', icon: MessageSquare, href: '/messages' },
  { id: 'cofounders', label: 'Find Co-Founders', icon: Users, href: '/find-co-founders' },
  { id: 'builders', label: 'Top Builders', icon: TrendingUp, href: '/top-builders' },
]

export function Sidebar({
  activeCategory,
  onCategoryChange,
  onLogout,
  userName,
}: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd+K or Ctrl+K to toggle sidebar
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsCollapsed(!isCollapsed)
      }
      // Escape to close user menu
      if (e.key === 'Escape') {
        setIsUserMenuOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isCollapsed])

  const firstNameOrOnly = userName
    ? userName.split(' ')[0]
    : 'User'

  return (
    <>
      <div className={`thoughts-sidebar-wrapper transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 invisible' : 'w-72 opacity-100 visible'}`}>
        {/* Content */}
        <div className="flex-1 overflow-y-auto pt-6">
          <div className="px-6 space-y-8">
            {/* Navigation */}
            <div className="space-y-2">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Navigation</h2>
              <div className="space-y-1 pt-3">
                {categories.map((cat) => {
                  const Icon = cat.icon
                  const isActive = activeCategory === cat.id
                  return (
                    <button
                      key={cat.id}
                      onClick={() => onCategoryChange(cat.id)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-all duration-200 ${
                        isActive
                          ? 'bg-card border border-accent text-foreground'
                          : 'text-muted-foreground hover:text-foreground hover:bg-card/50 border border-transparent'
                      }`}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{cat.label}</span>
                      {isActive && <span className="w-2 h-2 bg-accent rounded-full" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Community */}
            <div className="pt-6 border-t border-border space-y-2">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Community</h2>
              <div className="space-y-1 pt-3">
                {community.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.id}
                      href={item.href}
                      className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-card/50 border border-transparent transition-all duration-200"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="flex-1 text-left">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - User Menu */}
        <div className="p-6 border-t border-border">
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-foreground hover:bg-card/50 border border-transparent transition-all duration-200"
            >
              <div className="w-8 h-8 border border-foreground rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-bold">{firstNameOrOnly.charAt(0).toUpperCase()}</span>
              </div>
              <span className="flex-1 text-left font-medium">{firstNameOrOnly}</span>
              <ChevronDown className="w-4 h-4 flex-shrink-0 transition-transform" />
            </button>

            {/* User Menu Dropdown */}
            {isUserMenuOpen && (
              <div className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-lg overflow-hidden z-50">
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors border-b border-border">
                  <User className="w-4 h-4" />
                  <span>Your Profile</span>
                </button>
                <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors border-b border-border">
                  <User className="w-4 h-4" />
                  <span>Settings</span>
                </button>
                <button
                  onClick={() => {
                    setIsUserMenuOpen(false)
                    onLogout?.()
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1 pt-4 mt-4 border-t border-border">
            <p>© 2026 thoughts</p>
          </div>
        </div>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="fixed left-0 top-6 z-50 p-2 bg-card border border-border rounded-r-lg text-foreground hover:border-accent transition-all duration-300"
        title="Toggle sidebar (Cmd+K)"
      >
        <ChevronLeft className={`w-4 h-4 transition-transform ${isCollapsed ? 'rotate-180' : ''}`} />
      </button>
    </>
  )
}
