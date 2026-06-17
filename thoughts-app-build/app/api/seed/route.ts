import { seedDatabase } from '@/lib/seed'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const success = await seedDatabase()
    return NextResponse.json(
      {
        success,
        message: success
          ? 'Database seeded successfully'
          : 'Failed to seed database',
      },
      { status: success ? 200 : 500 }
    )
  } catch (error) {
    console.error('Seed API error:', error)
    return NextResponse.json(
      { success: false, message: 'Seed API error' },
      { status: 500 }
    )
  }
}
