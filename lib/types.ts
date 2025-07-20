// Form data types
export interface InterestFormData {
  name: string
  email: string
  subscribedToUpdates: boolean
}

export interface ContactFormData {
  name: string
  email: string
  message: string
  company?: string
  phone?: string
}

export interface NewsletterFormData {
  email: string
  firstName?: string
  lastName?: string
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
  errors?: Record<string, string>
}

// Database operation results
export interface DatabaseResult<T = any> {
  data: T | null
  error: string | null
  count?: number
}

// Supabase database types
export interface Database {
  public: {
    Tables: {
      interest_submissions: {
        Row: {
          id: string
          name: string
          email: string
          subscribed_to_updates: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          subscribed_to_updates?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          subscribed_to_updates?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          message: string
          company?: string
          phone?: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          message: string
          company?: string
          phone?: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          message?: string
          company?: string
          phone?: string
          created_at?: string
        }
      }
      newsletter_subscribers: {
        Row: {
          id: string
          email: string
          first_name?: string
          last_name?: string
          created_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string
          last_name?: string
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          created_at?: string
        }
      }
    }
  }
}

// Component prop types
export interface SectionProps {
  className?: string
  children?: React.ReactNode
}

export interface ButtonProps {
  children: React.ReactNode
  onClick?: () => void
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  disabled?: boolean
}

export interface InputProps {
  type?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  className?: string
  required?: boolean
  name?: string
  id?: string
} 