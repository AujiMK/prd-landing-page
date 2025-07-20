import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { ApiResponse } from '@/lib/types'

interface SubmissionCountData {
  count: number
  lastUpdated: string
}

interface UseSubmissionCountReturn {
  // State
  count: number | null
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  
  // Actions
  fetchCount: () => Promise<void>
  refreshCount: () => Promise<void>
  clearError: () => void
}

export function useSubmissionCount(autoRefresh: boolean = true): UseSubmissionCountReturn {
  const [count, setCount] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  
  // Set a fallback count if API fails
  const setFallbackCount = useCallback(() => {
    setCount(prevCount => {
      if (prevCount === null) {
        return 0 // Default to 0 if we can't fetch the real count
      }
      return prevCount
    })
  }, [])

  // Fetch submission count directly from Supabase
  const fetchCount = useCallback(async () => {
    // Don't fetch during SSR
    if (typeof window === 'undefined') return
    
    setIsLoading(true)
    setError(null)

    try {
      const { count: submissionCount, error: countError } = await supabase
        .from('interest_submissions')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        throw new Error(countError.message || 'Failed to fetch count')
      }

      setCount(submissionCount || 0)
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submission count'
      setError(errorMessage)
      console.error('Error fetching submission count:', err)
      setFallbackCount() // Set fallback count on error
    } finally {
      setIsLoading(false)
    }
  }, [setFallbackCount])

  // Refresh count (same as fetch but with different loading state)
  const refreshCount = useCallback(async () => {
    // Don't fetch during SSR
    if (typeof window === 'undefined') return
    
    if (isLoading) return // Prevent multiple simultaneous requests
    
    setIsLoading(true)
    setError(null)

    try {
      const { count: submissionCount, error: countError } = await supabase
        .from('interest_submissions')
        .select('*', { count: 'exact', head: true })

      if (countError) {
        throw new Error(countError.message || 'Failed to refresh count')
      }

      setCount(submissionCount || 0)
      setLastUpdated(new Date().toISOString())
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh submission count'
      setError(errorMessage)
      console.error('Error refreshing submission count:', err)
      setFallbackCount() // Set fallback count on error
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, setFallbackCount])

  // Clear error
  const clearError = useCallback(() => {
    setError(null)
  }, [])

  // Initial fetch on mount (only on client side)
  useEffect(() => {
    // Only fetch on client side to avoid SSR issues
    if (typeof window !== 'undefined') {
      fetchCount()
      
      // Set fallback count after 5 seconds if still loading
      const fallbackTimer = setTimeout(() => {
        setCount(prevCount => {
          if (isLoading && prevCount === null) {
            return 0
          }
          return prevCount
        })
      }, 5000)
      
      return () => clearTimeout(fallbackTimer)
    }
  }, [fetchCount, isLoading])

  // Auto-refresh every 30 seconds if enabled
  useEffect(() => {
    if (!autoRefresh) return

    const interval = setInterval(() => {
      refreshCount()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [autoRefresh, refreshCount])

  // Listen for form submission events to refresh count
  useEffect(() => {
    const handleFormSubmission = () => {
      // Small delay to ensure the database has been updated
      setTimeout(() => {
        refreshCount()
      }, 1000)
    }

    // Listen for custom events
    window.addEventListener('interest-form-submitted', handleFormSubmission)
    
    return () => {
      window.removeEventListener('interest-form-submitted', handleFormSubmission)
    }
  }, [refreshCount])

  return {
    count,
    isLoading,
    error,
    lastUpdated,
    fetchCount,
    refreshCount,
    clearError
  }
}

// Utility function to dispatch form submission event
export function notifyFormSubmission() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('interest-form-submitted'))
  }
} 