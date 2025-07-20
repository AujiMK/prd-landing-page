import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { supabase } from './supabase'
import type { InterestFormData, ApiResponse, DatabaseResult } from './types'

// Utility function for combining Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Form validation
export function validateContactForm(data: {
  name: string
  email: string
  message: string
}): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!data.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Interest form validation
export function validateInterestForm(data: InterestFormData): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {}

  if (!data.name.trim()) {
    errors.name = 'Name is required'
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required'
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

// Standardized API response handling
export function handleApiResponse<T = any>(response: any): ApiResponse<T> {
  if (response.error) {
    return {
      success: false,
      error: response.error.message || 'An error occurred',
      message: 'Operation failed'
    }
  }
  
  return {
    success: true,
    data: response.data,
    message: 'Operation successful'
  }
}

// Database operations
export async function submitInterestForm(data: InterestFormData): Promise<ApiResponse> {
  try {
    // Validate form data
    const validation = validateInterestForm(data)
    if (!validation.isValid) {
      return {
        success: false,
        error: 'Invalid form data',
        message: Object.values(validation.errors).join(', ')
      }
    }

    // Check if email already exists
    const { data: existingSubmission, error: checkError } = await supabase
      .from('interest_submissions')
      .select('email')
      .eq('email', data.email)
      .single()

    if (checkError && checkError.code !== 'PGRST116') {
      return {
        success: false,
        error: 'Database error',
        message: 'Failed to check existing submission'
      }
    }

    if (existingSubmission) {
      return {
        success: false,
        error: 'Email already exists',
        message: 'This email is already registered for interest updates'
      }
    }

    // Insert new submission
    const { data: submission, error } = await supabase
      .from('interest_submissions')
      .insert({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        subscribed_to_updates: data.subscribedToUpdates
      })
      .select()
      .single()

    if (error) {
      return {
        success: false,
        error: 'Database error',
        message: `Failed to submit interest form: ${error.message}`
      }
    }

    return {
      success: true,
      data: submission,
      message: 'Interest form submitted successfully!'
    }
  } catch (error) {
    return {
      success: false,
      error: 'Unexpected error',
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    }
  }
}

export async function getSubmissionCount(): Promise<DatabaseResult<number>> {
  try {
    const { count, error } = await supabase
      .from('interest_submissions')
      .select('*', { count: 'exact', head: true })

    if (error) {
      return {
        data: null,
        error: 'Failed to get submission count'
      }
    }

    return {
      data: count || 0,
      error: null,
      count: count || 0
    }
  } catch (error) {
    return {
      data: null,
      error: 'An unexpected error occurred'
    }
  }
}

// Format date
export function formatDate(date: Date | string): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// Debounce function
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// Generate random ID
export function generateId(): string {
  return Math.random().toString(36).substr(2, 9)
}

// Sanitize HTML
export function sanitizeHtml(html: string): string {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

// Truncate text
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
} 