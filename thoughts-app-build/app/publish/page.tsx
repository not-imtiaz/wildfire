'use client'

import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function PublishPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border p-6">
        <Link href="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Link>
        <h1 className="text-2xl font-bold">Publish Your Thought</h1>
        <p className="text-sm text-muted-foreground mt-2">Share your ideas, projects, and wins with the community</p>
      </div>

      <div className="flex-1 p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium">Title</label>
            <input
              type="text"
              placeholder="Give your thought a compelling title..."
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Category</label>
            <select className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground focus:outline-none focus:border-accent">
              <option>Startup Idea</option>
              <option>Hackathon Winner</option>
              <option>Daily Problem</option>
              <option>Project</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              placeholder="Write a brief description of your thought..."
              rows={3}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Full Content</label>
            <textarea
              placeholder="Tell the full story..."
              rows={8}
              className="w-full px-4 py-3 bg-card border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div className="pt-6 flex gap-3">
            <button className="px-6 py-3 bg-foreground text-background rounded-lg font-medium hover:bg-accent transition-colors">
              Publish
            </button>
            <Link
              href="/"
              className="px-6 py-3 border border-border rounded-lg text-foreground hover:bg-card/50 transition-colors"
            >
              Cancel
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
