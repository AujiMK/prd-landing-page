import React from 'react'
import { cn } from '@/lib/utils'

export interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6
  children: React.ReactNode
}

export interface ParagraphProps extends React.HTMLAttributes<HTMLParagraphElement> {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
  children: React.ReactNode
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 1, children, ...props }, ref) => {
    const baseStyles = 'font-bold tracking-tight text-gray-900'
    
    const variants = {
      1: 'text-4xl md:text-5xl lg:text-6xl',
      2: 'text-3xl md:text-4xl lg:text-5xl',
      3: 'text-2xl md:text-3xl lg:text-4xl',
      4: 'text-xl md:text-2xl lg:text-3xl',
      5: 'text-lg md:text-xl lg:text-2xl',
      6: 'text-base md:text-lg lg:text-xl'
    }
    
    const Component = `h${level}` as keyof JSX.IntrinsicElements
    
    const componentProps = {
      ref,
      className: cn(baseStyles, variants[level], className),
      ...props
    } as React.HTMLAttributes<HTMLHeadingElement>
    
    return React.createElement(Component, componentProps, children)
  }
)

const Paragraph = React.forwardRef<HTMLParagraphElement, ParagraphProps>(
  ({ className, size = 'base', children, ...props }, ref) => {
    const baseStyles = 'text-gray-700 leading-relaxed'
    
    const sizes = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl'
    }
    
    return (
      <p
        ref={ref}
        className={cn(baseStyles, sizes[size], className)}
        {...props}
      >
        {children}
      </p>
    )
  }
)

// Specialized heading components for convenience
const H1 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={1} {...props} />
)

const H2 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={2} {...props} />
)

const H3 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={3} {...props} />
)

const H4 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={4} {...props} />
)

const H5 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={5} {...props} />
)

const H6 = React.forwardRef<HTMLHeadingElement, Omit<HeadingProps, 'level'>>(
  (props, ref) => <Heading ref={ref} level={6} {...props} />
)

Heading.displayName = 'Heading'
Paragraph.displayName = 'Paragraph'
H1.displayName = 'H1'
H2.displayName = 'H2'
H3.displayName = 'H3'
H4.displayName = 'H4'
H5.displayName = 'H5'
H6.displayName = 'H6'

export { Heading, Paragraph, H1, H2, H3, H4, H5, H6 } 