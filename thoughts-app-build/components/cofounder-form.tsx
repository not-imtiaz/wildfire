'use client'

import { useState } from 'react'
import { Thought, Profile } from '@/lib/supabase'

interface CofounderFormProps {
  thought: Thought & { profiles: Profile }
  onSubmit: (data: {
    applicant_name: string
    applicant_email: string
    applicant_skills: string[]
    message: string
  }) => Promise<void>
  isLoading?: boolean
  isSuccess?: boolean
}

const skillOptions = [
  'Frontend',
  'Backend',
  'Full Stack',
  'Design',
  'Product',
  'DevOps',
  'AI/ML',
  'Mobile',
  'Data Science',
  'Sales',
  'Marketing',
]

export function CofounderForm({
  thought,
  onSubmit,
  isLoading = false,
  isSuccess = false,
}: CofounderFormProps) {
  const [formData, setFormData] = useState({
    applicant_name: '',
    applicant_email: '',
    applicant_skills: [] as string[],
    message: '',
  })

  const handleSkillToggle = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      applicant_skills: prev.applicant_skills.includes(skill)
        ? prev.applicant_skills.filter((s) => s !== skill)
        : [...prev.applicant_skills, skill],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (
      !formData.applicant_name.trim() ||
      !formData.applicant_email.trim() ||
      formData.applicant_skills.length === 0
    ) {
      return
    }
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {isSuccess && (
        <div className="p-4 bg-green-900/20 border border-green-700 rounded-lg">
          <p className="text-sm text-green-300">
            Application submitted successfully! The founder will review your profile.
          </p>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Full Name
        </label>
        <input
          type="text"
          value={formData.applicant_name}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              applicant_name: e.target.value,
            }))
          }
          placeholder="Your name"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Email
        </label>
        <input
          type="email"
          value={formData.applicant_email}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              applicant_email: e.target.value,
            }))
          }
          placeholder="your@email.com"
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors"
          disabled={isLoading}
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">
          Your Skills
        </label>
        <div className="grid grid-cols-2 gap-2">
          {skillOptions.map((skill) => (
            <button
              key={skill}
              type="button"
              onClick={() => handleSkillToggle(skill)}
              disabled={isLoading}
              className={`px-3 py-2 text-xs rounded-lg border transition-all duration-200 ${
                formData.applicant_skills.includes(skill)
                  ? 'bg-accent text-accent-foreground border-accent'
                  : 'bg-background border-border text-foreground hover:border-accent'
              }`}
            >
              {skill}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
          Message (Optional)
        </label>
        <textarea
          value={formData.message}
          onChange={(e) =>
            setFormData((prev) => ({
              ...prev,
              message: e.target.value,
            }))
          }
          placeholder="Tell them why you&apos;d be a great co-founder..."
          rows={3}
          className="w-full px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent transition-colors resize-none"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        disabled={
          isLoading ||
          !formData.applicant_name.trim() ||
          !formData.applicant_email.trim() ||
          formData.applicant_skills.length === 0
        }
        className="w-full px-4 py-3 bg-accent text-accent-foreground font-bold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {isLoading ? 'Submitting...' : 'Apply as Co-founder'}
      </button>
    </form>
  )
}
