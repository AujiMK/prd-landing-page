import { useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { InterestFormData, ApiResponse } from '@/lib/types'

interface FormState {
  name: string
  email: string
  subscribedToUpdates: boolean
}

interface FormErrors {
  name?: string
  email?: string
  submit?: string
}

interface UseInterestFormReturn {
  // Form state
  formData: FormState
  errors: FormErrors
  isSubmitting: boolean
  isSuccess: boolean
  
  // Form actions
  updateField: (field: keyof FormState, value: string | boolean) => void
  validateField: (field: keyof FormState) => void
  validateForm: () => boolean
  submitForm: () => Promise<ApiResponse | null>
  resetForm: () => void
  clearErrors: () => void
}

export function useInterestForm(): UseInterestFormReturn {
  const [formData, setFormData] = useState<FormState>({
    name: '',
    email: '',
    subscribedToUpdates: false
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Update form field
  const updateField = useCallback((field: keyof FormState, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    setErrors(prev => {
      if (prev[field as keyof FormErrors]) {
        return { ...prev, [field]: undefined }
      }
      return prev
    })
    
    // Clear success state when form is modified
    setIsSuccess(false)
  }, [])

  // Validate individual field
  const validateField = useCallback((field: keyof FormState) => {
    const value = formData[field]
    let fieldError: string | undefined

    switch (field) {
      case 'name':
        const name = String(value).trim()
        if (!name) {
          fieldError = 'Name is required'
        } else if (name.length < 2) {
          fieldError = 'Name must be at least 2 characters long'
        } else if (name.length > 255) {
          fieldError = 'Name must be less than 255 characters'
        }
        break

      case 'email':
        const email = String(value).trim().toLowerCase()
        if (!email) {
          fieldError = 'Email is required'
        } else if (!isValidEmail(email)) {
          fieldError = 'Please enter a valid email address'
        }
        break

      default:
        break
    }

    setErrors(prev => ({
      ...prev,
      [field]: fieldError
    }))

    return !fieldError
  }, [formData])

  // Validate entire form
  const validateForm = useCallback(() => {
    const nameValid = validateField('name')
    const emailValid = validateField('email')
    
    return nameValid && emailValid
  }, [validateField])

  // Submit form directly to Supabase
  const submitForm = useCallback(async (): Promise<ApiResponse | null> => {
    // Validate form before submission
    if (!validateForm()) {
      return null
    }

    setIsSubmitting(true)
    setErrors({})
    setIsSuccess(false)

    try {
      // Check for existing submission
      const { data: existingSubmission, error: checkError } = await supabase
        .from('interest_submissions')
        .select('id, created_at')
        .eq('email', formData.email.trim().toLowerCase())
        .single()

      if (checkError && checkError.code !== 'PGRST116') {
        console.error('Database check error:', checkError)
        setErrors({ submit: 'Failed to check existing submission' })
        return {
          success: false,
          error: 'Database error',
          message: 'Failed to check existing submission'
        }
      }

      if (existingSubmission) {
        setErrors({ submit: 'This email is already registered for interest updates' })
        return {
          success: false,
          error: 'Email already exists',
          message: 'This email is already registered for interest updates'
        }
      }

      // Insert new submission
      const { data: submission, error: insertError } = await supabase
        .from('interest_submissions')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          subscribed_to_updates: formData.subscribedToUpdates
        })
        .select()
        .single()

      if (insertError) {
        console.error('Database insert error:', insertError)
        setErrors({ submit: 'Failed to submit interest form' })
        return {
          success: false,
          error: 'Database error',
          message: 'Failed to submit interest form'
        }
      }

      // Success
      setIsSuccess(true)
      
      // Notify other components about the submission
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('interest-form-submitted'))
      }

      return {
        success: true,
        data: submission,
        message: 'Interest form submitted successfully!'
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Network error. Please try again.'
      setErrors({ submit: errorMessage })
      return {
        success: false,
        error: 'Network error',
        message: errorMessage
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [formData, validateForm])

  // Reset form to initial state
  const resetForm = useCallback(() => {
    setFormData({
      name: '',
      email: '',
      subscribedToUpdates: false
    })
    setErrors({})
    setIsSuccess(false)
  }, [])

  // Clear all errors
  const clearErrors = useCallback(() => {
    setErrors({})
  }, [])

  return {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateField,
    validateField,
    validateForm,
    submitForm,
    resetForm,
    clearErrors
  }
}

// Email validation helper function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
} 