import { supabase } from '@/lib/supabase'

// Sample profile data
const sampleProfile = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  username: 'alex_builder',
  display_name: 'Alex Chen',
  bio: 'Building AI products for students',
  age: 22,
  school: 'Stanford University',
  twitter_link: 'https://twitter.com/alexbuilder',
  linkedin_link: 'https://linkedin.com/in/alexchen',
  github_link: 'https://github.com/alexchen',
  show_email_publicly: false,
  show_phone_publicly: false,
}

// Sample thoughts data
const sampleThoughts = [
  {
    user_id: sampleProfile.id,
    title: 'Real-time Collaboration Tool for Remote Teams',
    description: 'A Figma-like tool but designed specifically for technical documentation and architecture design',
    content: `I\'ve been working on this concept for a few months. The core idea is to solve the problem of teams struggling to document and version control their architecture decisions in real-time.

Features:
- Real-time cursor tracking
- Canvas-based architecture diagramming
- AI-powered suggestions for common patterns
- One-click Markdown export
- Git integration for version control

Currently have a MVP with basic features. Looking for co-founders to help scale this into a product people love.`,
    type: 'startup_idea',
    tags: ['collaboration', 'developer-tools', 'saas'],
    looking_for_cofounders: true,
    cofounder_roles: ['Backend Engineer', 'DevOps', 'Product Manager'],
    live_demo_link: 'https://demo.example.com',
    github_repo_link: 'https://github.com/example/collab-tool',
    youtube_video_link: null,
  },
  {
    user_id: sampleProfile.id,
    title: 'Won Best AI Hack at Stanford Hackathon',
    description: 'Built an AI tutor that explains complex concepts in real-time using multi-modal learning',
    content: `This was an incredible 36-hour hackathon experience. We built an AI tutor that:

- Analyzes student confusion in real-time through video
- Adjusts explanation depth based on comprehension signals
- Generates custom practice problems
- Provides instant feedback

The judges were impressed by the UX polish and the educational research behind it. Huge thanks to my teammates!`,
    type: 'hackathon_winner',
    tags: ['ai', 'education', 'hackathon'],
    looking_for_cofounders: false,
    cofounder_roles: [],
    live_demo_link: null,
    github_repo_link: 'https://github.com/example/ai-tutor',
    youtube_video_link: 'https://youtube.com/watch?v=example',
  },
  {
    user_id: sampleProfile.id,
    title: 'How to Implement Efficient Database Indexing',
    description: 'Share your solution to optimizing slow queries in your production database',
    content: `Most developers don\'t think about indexing until their queries are already slow. Here are the key principles I\'ve learned:

1. Analyze query patterns first
2. Index on WHERE, JOIN, and ORDER BY columns
3. Watch out for index bloat
4. Use EXPLAIN ANALYZE religiously
5. Monitor performance metrics continuously

What\'s your approach to indexing? Have you had any horror stories with index decisions that cost you?`,
    type: 'daily_problem',
    tags: ['database', 'performance', 'sql'],
    looking_for_cofounders: false,
    cofounder_roles: [],
    live_demo_link: null,
    github_repo_link: null,
    youtube_video_link: null,
  },
  {
    user_id: sampleProfile.id,
    title: 'Next.js Full-Stack Framework with AI Integration',
    description: 'Open source project combining Next.js 16, Supabase, and Claude API for rapid prototyping',
    content: `I created a framework that helps developers build full-stack applications with AI built-in from day one.

Stack:
- Next.js 16 (App Router)
- Supabase for auth and real-time
- Claude API integration
- TailwindCSS + shadcn/ui
- TypeScript throughout

Currently used by 50+ projects in our community. Would love feedback and contributions!`,
    type: 'projects',
    tags: ['next.js', 'ai', 'framework', 'open-source'],
    looking_for_cofounders: false,
    cofounder_roles: [],
    live_demo_link: 'https://framework-example.com',
    github_repo_link: 'https://github.com/example/nextai-framework',
    youtube_video_link: null,
  },
  {
    user_id: sampleProfile.id,
    title: 'Building a Sustainable Freelance Business Model',
    description: 'Startup idea: A platform connecting indie developers with meaningful long-term projects',
    content: `Current freelance platforms (Upwork, Fiverr) are transactional. They optimize for speed, not quality relationships.

My hypothesis: Developers want:
- Meaningful work
- Predictable income
- Skill growth
- Long-term partnerships

Solution: A subscription-based platform where companies maintain a team of vetted developers for ongoing projects.

Revenue model: 30% commission on developer rates. Target: 1000 developers by year 2.

Seeking: Co-founder with enterprise sales experience.`,
    type: 'startup_idea',
    tags: ['freelance', 'saas', 'developer-community'],
    looking_for_cofounders: true,
    cofounder_roles: ['Sales/Business Development', 'Marketing'],
    live_demo_link: null,
    github_repo_link: null,
    youtube_video_link: null,
  },
]

export async function seedDatabase() {
  try {
    console.log('Starting database seed...')

    // Insert profile (skip if already exists)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', sampleProfile.id)
      .single()

    if (!existingProfile) {
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([sampleProfile])

      if (profileError) {
        console.error('Error inserting profile:', profileError)
        return false
      }
      console.log('Profile inserted successfully')
    } else {
      console.log('Profile already exists, skipping...')
    }

    // Insert thoughts (skip if already exist)
    const { data: existingThoughts } = await supabase
      .from('thoughts')
      .select('id')
      .eq('user_id', sampleProfile.id)

    if (!existingThoughts || existingThoughts.length === 0) {
      const { error: thoughtsError } = await supabase
        .from('thoughts')
        .insert(sampleThoughts)

      if (thoughtsError) {
        console.error('Error inserting thoughts:', thoughtsError)
        return false
      }
      console.log(`${sampleThoughts.length} thoughts inserted successfully`)
    } else {
      console.log('Thoughts already exist, skipping...')
    }

    console.log('Database seed completed!')
    return true
  } catch (error) {
    console.error('Seed error:', error)
    return false
  }
}
