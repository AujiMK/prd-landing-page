'use client'

import { Card, CardBody, Button, Input, Checkbox, H1, H2, H3, Paragraph } from '@/components/ui'
import { useInterestForm, useSubmissionCount, notifyFormSubmission } from '@/lib/hooks'

interface HeroSectionProps {
  className?: string
}

export default function HeroSection({ className = '' }: HeroSectionProps) {
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

  const { count, isLoading: countLoading } = useSubmissionCount()

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const result = await submitForm()
    
    if (result?.success) {
      notifyFormSubmission() // Notify other components to refresh
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
    <section className={`py-20 bg-gradient-to-br from-primary-50 to-white ${className}`}>
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-5 gap-12 items-center">
          {/* Left Side - Content (60% on desktop) */}
          <div className="lg:col-span-3 space-y-8">
            {/* Main Headline */}
            <div className="space-y-4">
              <H1 className="text-4xl md:text-5xl lg:text-6xl">
                Vibe Coding Course
              </H1>
              
              <H2 className="text-2xl md:text-3xl lg:text-4xl text-gray-700 font-medium">
                Release your MVP within a month
              </H2>
            </div>

            {/* Live Counter */}
            <div className="space-y-2">
              {countLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-600"></div>
                  <Paragraph size="lg" className="text-gray-600">
                    Loading community stats...
                  </Paragraph>
                </div>
              ) : (
                <div className="space-y-1">
                  <Paragraph size="xl" className="text-gray-700">
                    <span className="font-bold text-primary-600">
                      {count?.toLocaleString() || '0'}
                    </span>{' '}
                    developers have joined the waitlist
                  </Paragraph>
                  <Paragraph size="sm" className="text-gray-500">
                    Join the community of builders and creators
                  </Paragraph>
                </div>
              )}
            </div>

            {/* Call to Action */}
            <div className="space-y-4">
              <Paragraph size="lg" className="text-gray-600 max-w-2xl">
                Learn modern web development with Next.js, TypeScript, and TailwindCSS. 
                Build real projects and launch your career in tech.
              </Paragraph>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="w-full sm:w-auto">
                  Start Learning
                </Button>
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  View Curriculum
                </Button>
              </div>
            </div>
          </div>

          {/* Right Side - Form (40% on desktop) */}
          <div className="lg:col-span-2">
            <Card className="shadow-xl border-0">
              <CardBody className="p-6 md:p-8">
                <div className="text-center mb-6">
                  <H3 className="text-gray-900 mb-2">
                    Join the Waitlist
                  </H3>
                  <Paragraph size="sm" className="text-gray-600">
                    Be the first to know when enrollment opens
                  </Paragraph>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name Input */}
                  <Input
                    key="hero-name-input"
                    label="Full Name *"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('name')}
                    placeholder="Enter your full name"
                    error={errors.name}
                    required
                  />

                  {/* Email Input */}
                  <Input
                    key="hero-email-input"
                    label="Email Address *"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    onBlur={() => handleFieldBlur('email')}
                    placeholder="Enter your email address"
                    error={errors.email}
                    required
                  />

                  {/* Subscribe Checkbox */}
                  <Checkbox
                    key="hero-subscribe-checkbox"
                    label="Subscribe to course updates and announcements"
                    name="subscribedToUpdates"
                    checked={formData.subscribedToUpdates}
                    onChange={handleInputChange}
                  />

                  {/* Error Message */}
                  {errors.submit && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                      <Paragraph size="sm" className="text-red-600">
                        {errors.submit}
                      </Paragraph>
                    </div>
                  )}

                  {/* Success Message */}
                  {isSuccess && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                      <Paragraph size="sm" className="text-green-600">
                        🎉 Successfully joined the waitlist! We'll notify you when enrollment opens.
                      </Paragraph>
                    </div>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    loading={isSubmitting}
                    disabled={isSubmitting}
                    className="w-full"
                    size="lg"
                  >
                    {isSubmitting ? 'Joining Waitlist...' : 'Join Waitlist'}
                  </Button>

                  {/* Privacy Notice */}
                  <Paragraph size="xs" className="text-gray-500 text-center">
                    By joining the waitlist, you agree to receive updates about the course. 
                    We respect your privacy and will never spam you.
                  </Paragraph>
                </form>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
} 