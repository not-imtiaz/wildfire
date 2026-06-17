'use client'

import { Search, X, Plus } from 'lucide-react'
import { useState, useCallback } from 'react'
import Link from 'next/link'

interface TopNavProps {
  onSearch: (query: string) => void
}

export function TopNav({ onSearch }: TopNavProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value
      setSearchQuery(value)
      onSearch(value)
    },
    [onSearch]
  )

  const handleClear = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <div className="thoughts-topbar">
      {/* Logo */}
      <div className="flex-shrink-0">
        <h1 className="text-lg font-bold">thoughts</h1>
        <p className="text-xs text-muted-foreground leading-tight">launchpad for builders</p>
      </div>

      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search thoughts..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
          />
          {searchQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Publish Button */}
      <Link
        href="/publish"
        className="flex items-center gap-2 px-4 py-2 bg-foreground text-background rounded-lg text-sm font-medium hover:bg-accent transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Publish</span>
      </Link>
    </div>
  )
}
