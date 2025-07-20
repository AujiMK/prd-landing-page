import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isValidEmail, sanitizeHtml } from '@/lib/utils'
import type { InterestFormData } from '@/lib/types'

export const dynamic = 'force-dynamic'

// Rate limiting map (in production, use Redis or database)
const submissionCounts = new Map<string, { count: number; resetTime: number }>()

// Rate limiting: max 5 submissions per IP per hour
const RATE_LIMIT_MAX = 5
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in milliseconds

interface ValidationResult {
  isValid: boolean
  errors: Record<string, string>
}

function validateInterestForm(data: InterestFormData): ValidationResult {
  const errors: Record<string, string> = {}

  // Name validation
  const name = data.name?.trim() || ''
  if (!name) {
    errors.name = 'Name is required'
  } else if (name.length < 2) {
    errors.name = 'Name must be at least 2 characters long'
  } else if (name.length > 255) {
    errors.name = 'Name must be less than 255 characters'
  }

  // Email validation
  const email = data.email?.trim().toLowerCase() || ''
  if (!email) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(email)) {
    errors.email = 'Please enter a valid email address'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const userData = submissionCounts.get(ip)

  if (!userData || now > userData.resetTime) {
    // Reset or initialize
    submissionCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1 }
  }

  if (userData.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0 }
  }

  // Increment count
  userData.count++
  return { allowed: true, remaining: RATE_LIMIT_MAX - userData.count }
}

function getClientIP(request: NextRequest): string {
  // Get IP from various headers (for different deployment scenarios)
  const forwarded = request.headers.get('x-forwarded-for')
  const realIP = request.headers.get('x-real-ip')
  const cfConnectingIP = request.headers.get('cf-connecting-ip')
  
  return forwarded?.split(',')[0] || realIP || cfConnectingIP || 'unknown'
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    const { name, email, subscribedToUpdates }: InterestFormData = body

    // Rate limiting check
    const clientIP = getClientIP(request)
    const rateLimit = checkRateLimit(clientIP)
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          message: 'Too many submissions. Please try again later.',
          retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000 / 60) // minutes
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil(RATE_LIMIT_WINDOW / 1000).toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
          }
        }
      )
    }

    // Validate form data
    const validation = validateInterestForm({ name, email, subscribedToUpdates })
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Please check your input and try again',
          errors: validation.errors
        },
        { status: 400 }
      )
    }

    // Sanitize inputs
    const sanitizedName = sanitizeHtml(name.trim())
    const sanitizedEmail = email.trim().toLowerCase()

    // Check for duplicate email
    const { data: existingSubmission, error: checkError } = await supabase
      .from('interest_submissions')
      .select('id, created_at')
      .eq('email', sanitizedEmail)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Database check error:', checkError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to check existing submission'
        },
        { status: 500 }
      )
    }

    if (existingSubmission) {
      return NextResponse.json(
        {
          success: false,
          error: 'Email already exists',
          message: 'This email is already registered for interest updates',
          data: {
            existingSubmission: {
              id: existingSubmission.id,
              submittedAt: existingSubmission.created_at
            }
          }
        },
        { status: 409 }
      )
    }

    // Insert new submission
    const { data: submission, error: insertError } = await supabase
      .from('interest_submissions')
      .insert({
        name: sanitizedName,
        email: sanitizedEmail,
        subscribed_to_updates: subscribedToUpdates || false
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      return NextResponse.json(
        {
          success: false,
          error: 'Database error',
          message: 'Failed to submit interest form'
        },
        { status: 500 }
      )
    }

    // Success response
    return NextResponse.json(
      {
        success: true,
        data: submission,
        message: 'Interest form submitted successfully!',
        rateLimit: {
          remaining: rateLimit.remaining,
          resetTime: new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
        }
      },
      { 
        status: 201,
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          'X-RateLimit-Reset': new Date(Date.now() + RATE_LIMIT_WINDOW).toISOString()
        }
      }
    )

  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'An unexpected error occurred. Please try again.'
      },
      { status: 500 }
    )
  }
}

// OPTIONS method for CORS preflight requests
export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
} 