import React from 'react'
import { cn } from '@/lib/utils'

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  helperText?: string
  error?: string
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, helperText, error, indeterminate = false, id, ...props }, ref) => {
    // Always call useId() unconditionally
    const generatedId = React.useId()
    const checkboxId = id || `checkbox-${generatedId}`
    
    const baseCheckboxStyles = 'h-4 w-4 rounded border border-gray-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
    
    const checkboxVariants = {
      default: 'border-gray-300',
      error: 'border-red-300 focus:ring-red-500'
    }

    return (
      <div className="space-y-2">
        <div className="flex items-start space-x-3">
          <div className="flex items-center h-5">
            <input
              type="checkbox"
              className={cn(
                baseCheckboxStyles,
                checkboxVariants[error ? 'error' : 'default'],
                className
              )}
              ref={ref}
              id={checkboxId}
              aria-invalid={error ? 'true' : 'false'}
              aria-describedby={
                error ? `${checkboxId}-error` : 
                helperText ? `${checkboxId}-helper` : 
                undefined
              }
              {...props}
            />
          </div>
          
          {label && (
            <div className="flex-1">
              <label 
                htmlFor={checkboxId}
                className="text-sm font-medium text-gray-700 cursor-pointer select-none"
              >
                {label}
              </label>
            </div>
          )}
        </div>
        
        {(error || helperText) && (
          <div className="space-y-1 ml-7">
            {error && (
              <p 
                id={`${checkboxId}-error`}
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}
            {helperText && !error && (
              <p 
                id={`${checkboxId}-helper`}
                className="text-sm text-gray-500"
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox 