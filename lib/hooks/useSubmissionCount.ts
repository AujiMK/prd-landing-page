import { useState, useEffect, useCallback } from 'react'
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
    if (count === null) {
      setCount(0) // Default to 0 if we can't fetch the real count
    }
  }, [count])

  // Fetch submission count
  const fetchCount = useCallback(async () => {
    // Don't fetch during SSR
    if (typeof window === 'undefined') return
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/interest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<{ count: number }> = await response.json()

      if (result.success && result.data) {
        setCount(result.data.count)
        setLastUpdated(new Date().toISOString())
      } else {
        throw new Error(result.message || result.error || 'Failed to fetch count')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch submission count'
      setError(errorMessage)
      console.error('Error fetching submission count:', err)
      setFallbackCount() // Set fallback count on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh count (same as fetch but with different loading state)
  const refreshCount = useCallback(async () => {
    // Don't fetch during SSR
    if (typeof window === 'undefined') return
    
    if (isLoading) return // Prevent multiple simultaneous requests
    
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/interest', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000) // 10 second timeout
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result: ApiResponse<{ count: number }> = await response.json()

      if (result.success && result.data) {
        setCount(result.data.count)
        setLastUpdated(new Date().toISOString())
      } else {
        throw new Error(result.message || result.error || 'Failed to refresh count')
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to refresh submission count'
      setError(errorMessage)
      console.error('Error refreshing submission count:', err)
      setFallbackCount() // Set fallback count on error
    } finally {
      setIsLoading(false)
    }
  }, [isLoading])

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
        if (isLoading && count === null) {
          setFallbackCount()
        }
      }, 5000)
      
      return () => clearTimeout(fallbackTimer)
    }
  }, [fetchCount, isLoading, count, setFallbackCount])

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
  window.dispatchEvent(new CustomEvent('interest-form-submitted'))
} 