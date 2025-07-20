import { NextRequest, NextResponse } from 'next/server'
import { submitInterestForm, getSubmissionCount } from '@/lib/utils'
import type { InterestFormData } from '@/lib/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subscribedToUpdates }: InterestFormData = body

    // Validate required fields
    if (!name || !email) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          message: 'Name and email are required'
        },
        { status: 400 }
      )
    }

    // Submit interest form
    const result = await submitInterestForm({
      name,
      email,
      subscribedToUpdates: subscribedToUpdates || false
    })

    if (!result.success) {
      return NextResponse.json(result, { status: 400 })
    }

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const result = await getSubmissionCount()
    
    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
          message: 'Failed to get submission count'
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { count: result.count },
      message: 'Submission count retrieved successfully'
    })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred'
      },
      { status: 500 }
    )
  }
} 