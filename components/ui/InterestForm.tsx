'use client'

import { useEffect } from 'react'
import { Button, Input, Checkbox, Card, CardBody } from '@/components/ui'
import { useInterestForm, notifyFormSubmission } from '@/lib/hooks'

interface InterestFormProps {
  className?: string
  onSuccess?: (data: any) => void
  onError?: (error: string) => void
}

export default function InterestForm({ className = '', onSuccess, onError }: InterestFormProps) {
  const {
    formData,
    errors,
    isSubmitting,
    isSuccess,
    updateField,
    validateField,
    submitForm,
    resetForm
  } = useInterestForm()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await submitForm()
    
    if (result?.success) {
      onSuccess?.(result.data)
      notifyFormSubmission() // Notify other components to refresh
    } else if (result) {
      onError?.(result.message || result.error || 'Submission failed')
    }
  }

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    const fieldValue = type === 'checkbox' ? checked : value
    updateField(name as keyof typeof formData, fieldValue)
  }

  // Handle field blur for validation
  const handleFieldBlur = (field: keyof typeof formData) => {
    validateField(field)
  }

  return (
    <Card className={className}>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            key="name-input"
            label="Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('name')}
            placeholder="Enter your name"
            error={errors.name}
            required
          />

          <Input
            key="email-input"
            label="Email *"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            onBlur={() => handleFieldBlur('email')}
            placeholder="Enter your email"
            error={errors.email}
            required
          />

          <Checkbox
            key="subscribe-checkbox"
            label="Subscribe to updates about Vibe Coding"
            name="subscribedToUpdates"
            checked={formData.subscribedToUpdates}
            onChange={handleInputChange}
          />

          {errors.submit && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          {isSuccess && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Interest form submitted successfully! Thank you for your interest.
              </p>
            </div>
          )}

          <Button
            type="submit"
            loading={isSubmitting}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Interest'}
          </Button>
        </form>
      </CardBody>
    </Card>
  )
} 