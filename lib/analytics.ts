// Analytics utility for tracking user interactions and conversions

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp?: number
}

interface FormSubmissionEvent {
  email: string
  subscribed: boolean
  source: string
  timestamp: string
}

interface PageViewEvent {
  page: string
  referrer?: string
  userAgent?: string
}

class Analytics {
  private isEnabled: boolean
  private isDevelopment: boolean

  constructor() {
    this.isEnabled = process.env.NODE_ENV === 'production'
    this.isDevelopment = process.env.NODE_ENV === 'development'
  }

  // Track page views
  trackPageView(page: string, properties?: Record<string, any>) {
    const event: PageViewEvent = {
      page,
      referrer: document.referrer,
      userAgent: navigator.userAgent,
      ...properties
    }

    this.sendEvent('page_view', event)
  }

  // Track form submissions
  trackFormSubmission(data: FormSubmissionEvent) {
    this.sendEvent('form_submission', {
      ...data,
      timestamp: new Date().toISOString()
    })
  }

  // Track button clicks
  trackButtonClick(buttonName: string, properties?: Record<string, any>) {
    this.sendEvent('button_click', {
      button_name: buttonName,
      ...properties
    })
  }

  // Track form interactions
  trackFormInteraction(action: string, fieldName?: string, properties?: Record<string, any>) {
    this.sendEvent('form_interaction', {
      action,
      field_name: fieldName,
      ...properties
    })
  }

  // Track errors
  trackError(error: Error, context?: Record<string, any>) {
    this.sendEvent('error', {
      message: error.message,
      stack: error.stack,
      url: window.location.href,
      ...context
    })
  }

  // Track performance metrics
  trackPerformance(metric: string, value: number, properties?: Record<string, any>) {
    this.sendEvent('performance', {
      metric,
      value,
      ...properties
    })
  }

  // Track conversion events
  trackConversion(type: string, value?: number, properties?: Record<string, any>) {
    this.sendEvent('conversion', {
      type,
      value,
      ...properties
    })
  }

  // Send event to analytics services
  private sendEvent(eventName: string, properties?: Record<string, any>) {
    const event: AnalyticsEvent = {
      event: eventName,
      properties,
      timestamp: Date.now()
    }

    // Log in development
    if (this.isDevelopment) {
      console.log('Analytics Event:', event)
    }

    // Send to Google Analytics if configured
    this.sendToGoogleAnalytics(event)

    // Send to custom analytics endpoint
    this.sendToCustomEndpoint(event)

    // Send to Plausible if configured
    this.sendToPlausible(event)
  }

  // Send to Google Analytics
  private sendToGoogleAnalytics(event: AnalyticsEvent) {
    if (!this.isEnabled || !process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID) {
      return
    }

    try {
      // Google Analytics 4
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', event.event, {
          event_category: 'engagement',
          event_label: event.properties?.page || 'unknown',
          value: event.properties?.value,
          ...event.properties
        })
      }
    } catch (error) {
      console.error('Google Analytics error:', error)
    }
  }

  // Send to custom analytics endpoint
  private sendToCustomEndpoint(event: AnalyticsEvent) {
    if (!this.isEnabled) {
      return
    }

    fetch('/api/analytics', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    }).catch((error) => {
      console.error('Analytics endpoint error:', error)
    })
  }

  // Send to Plausible
  private sendToPlausible(event: AnalyticsEvent) {
    if (!this.isEnabled || !process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN) {
      return
    }

    try {
      // Plausible custom events
      if (typeof window !== 'undefined' && (window as any).plausible) {
        (window as any).plausible(event.event, {
          props: event.properties
        })
      }
    } catch (error) {
      console.error('Plausible error:', error)
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  private analytics: Analytics

  constructor(analytics: Analytics) {
    this.analytics = analytics
  }

  // Monitor Core Web Vitals
  monitorCoreWebVitals() {
    if (typeof window === 'undefined') return

    // First Contentful Paint
    this.monitorFCP()
    
    // Largest Contentful Paint
    this.monitorLCP()
    
    // First Input Delay
    this.monitorFID()
    
    // Cumulative Layout Shift
    this.monitorCLS()
  }

  private monitorFCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.analytics.trackPerformance('FCP', entry.startTime)
        })
      })
      observer.observe({ entryTypes: ['paint'] })
    }
  }

  private monitorLCP() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          this.analytics.trackPerformance('LCP', entry.startTime)
        })
      })
      observer.observe({ entryTypes: ['largest-contentful-paint'] })
    }
  }

  private monitorFID() {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          const firstInputEntry = entry as PerformanceEventTiming
          this.analytics.trackPerformance('FID', firstInputEntry.processingStart - firstInputEntry.startTime)
        })
      })
      observer.observe({ entryTypes: ['first-input'] })
    }
  }

  private monitorCLS() {
    if ('PerformanceObserver' in window) {
      let clsValue = 0
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value
            this.analytics.trackPerformance('CLS', clsValue)
          }
        })
      })
      observer.observe({ entryTypes: ['layout-shift'] })
    }
  }
}

// Error tracking
class ErrorTracker {
  private analytics: Analytics

  constructor(analytics: Analytics) {
    this.analytics = analytics
  }

  // Initialize error tracking
  init() {
    if (typeof window === 'undefined') return

    // Track unhandled errors
    window.addEventListener('error', (event) => {
      this.analytics.trackError(event.error, {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      })
    })

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.analytics.trackError(new Error(event.reason), {
        type: 'unhandled_rejection'
      })
    })
  }
}

// Create singleton instances
export const analytics = new Analytics()
export const performanceMonitor = new PerformanceMonitor(analytics)
export const errorTracker = new ErrorTracker(analytics)

// Initialize monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.monitorCoreWebVitals()
  errorTracker.init()
}

export default analytics 