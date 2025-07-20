'use client'

import { useSubmissionCount } from '@/lib/hooks'
import { H4, Paragraph } from '@/components/ui'
import { useState, useEffect } from 'react'

interface SubmissionCounterProps {
  className?: string
  showLastUpdated?: boolean
  autoRefresh?: boolean
}

// Fallback component when hook fails
function FallbackCounter({ className }: { className?: string }) {
  return (
    <div className={`text-center ${className}`}>
      <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
        <H4 className="text-gray-900 mb-2">
          Community Interest
        </H4>
        <div className="text-3xl font-bold text-gray-900 mb-2">
          0
        </div>
        <Paragraph size="sm" className="text-gray-700">
          people have shown interest
        </Paragraph>
      </div>
    </div>
  )
}

export default function SubmissionCounter({ 
  className = '', 
  showLastUpdated = false,
  autoRefresh = true 
}: SubmissionCounterProps) {
  const [hasError, setHasError] = useState(false)
  
  // Always call the hook unconditionally
  const { count, isLoading, error, lastUpdated, refreshCount } = useSubmissionCount(autoRefresh)
  
  // Error boundary effect
  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      if (error.message.includes('useSubmissionCount') || error.message.includes('Failed to fetch')) {
        console.error('SubmissionCounter error:', error)
        setHasError(true)
      }
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // If there was an error, show fallback
  if (hasError) {
    return <FallbackCounter className={className} />
  }

  const formatLastUpdated = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
  }

  if (error) {
    return (
      <div className={`text-center p-4 ${className}`}>
        <div className="bg-red-50 border border-red-200 rounded-md p-3">
          <Paragraph size="sm" className="text-red-600">
            Failed to load submission count
          </Paragraph>
          <button
            onClick={() => {
              setHasError(false)
              refreshCount()
            }}
            className="mt-2 text-sm text-red-700 underline hover:no-underline"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`text-center ${className}`}>
      <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
        <H4 className="text-blue-900 mb-2">
          Community Interest
        </H4>
        
        {isLoading ? (
          <div className="flex items-center justify-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <Paragraph size="sm" className="text-blue-700">
              Loading...
            </Paragraph>
          </div>
        ) : (
          <>
            <div className="text-3xl font-bold text-blue-900 mb-2">
              {count?.toLocaleString() || '0'}
            </div>
            <Paragraph size="sm" className="text-blue-700 mb-2">
              people have shown interest
            </Paragraph>
            
            {showLastUpdated && lastUpdated && (
              <Paragraph size="xs" className="text-blue-600">
                Last updated: {formatLastUpdated(lastUpdated)}
              </Paragraph>
            )}
            
            <button
              onClick={refreshCount}
              disabled={isLoading}
              className="mt-2 text-xs text-blue-600 underline hover:no-underline disabled:opacity-50"
            >
              Refresh
            </button>
          </>
        )}
      </div>
    </div>
  )
} 