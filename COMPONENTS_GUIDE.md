# Vibe Coding UI Components Guide

A comprehensive set of reusable UI components built with TypeScript, TailwindCSS, and React for the Vibe Coding landing page.

## 🎨 Design System

### **Typography**
- **Font Family**: Inter (body), Space Grotesk (headings)
- **Color Palette**: Neutral grays with primary blue accent
- **Spacing**: Consistent 4px base unit system
- **Shadows**: Subtle shadows for depth and hierarchy

### **Color Scheme**
```css
Primary: #0ea5e9 (blue-500)
Gray Scale: 50-900
Error: #ef4444 (red-500)
Success: #22c55e (green-500)
```

## 📦 Components

### **Button Component**

A versatile button component with multiple variants and sizes.

```tsx
import { Button } from '@/components/ui'

// Basic usage
<Button>Click me</Button>

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="outline">Outline</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// Loading state
<Button loading>Loading...</Button>

// Disabled state
<Button disabled>Disabled</Button>
```

**Props:**
- `variant`: 'primary' | 'secondary' | 'ghost' | 'outline'
- `size`: 'sm' | 'md' | 'lg'
- `loading`: boolean
- `disabled`: boolean
- All standard button HTML attributes

### **Input Component**

A form input component with built-in validation states and accessibility.

```tsx
import { Input } from '@/components/ui'

// Basic usage
<Input placeholder="Enter text" />

// With label and error
<Input 
  label="Email Address"
  type="email"
  error="Please enter a valid email"
  helperText="We'll never share your email"
/>

// With icons
<Input 
  leftIcon={<MailIcon />}
  rightIcon={<SearchIcon />}
  placeholder="Search..."
/>
```

**Props:**
- `label`: string
- `helperText`: string
- `error`: string
- `leftIcon`: ReactNode
- `rightIcon`: ReactNode
- All standard input HTML attributes

### **Checkbox Component**

A custom checkbox component with proper accessibility.

```tsx
import { Checkbox } from '@/components/ui'

// Basic usage
<Checkbox label="Accept terms" />

// With helper text
<Checkbox 
  label="Subscribe to newsletter"
  helperText="Receive updates about new features"
/>

// With error state
<Checkbox 
  label="Required field"
  error="This field is required"
/>
```

**Props:**
- `label`: string
- `helperText`: string
- `error`: string
- `indeterminate`: boolean
- All standard checkbox HTML attributes

### **Card Component**

A flexible card component with header, body, and footer sections.

```tsx
import { Card, CardHeader, CardBody, CardFooter } from '@/components/ui'

<Card>
  <CardHeader>
    <h3>Card Title</h3>
    <p>Card subtitle</p>
  </CardHeader>
  <CardBody>
    <p>Card content goes here</p>
  </CardBody>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

**Props:**
- All standard div HTML attributes
- Each section (Header, Body, Footer) accepts standard div props

### **Typography Components**

Consistent typography components with proper semantic HTML.

```tsx
import { H1, H2, H3, H4, H5, H6, Paragraph } from '@/components/ui'

// Headings
<H1>Main Heading</H1>
<H2>Section Heading</H2>
<H3>Subsection Heading</H3>

// Paragraphs with sizes
<Paragraph>Default paragraph</Paragraph>
<Paragraph size="sm">Small text</Paragraph>
<Paragraph size="lg">Large text</Paragraph>
<Paragraph size="xl">Extra large text</Paragraph>
```

**Heading Props:**
- All standard heading HTML attributes
- `level`: 1-6 (for generic Heading component)

**Paragraph Props:**
- `size`: 'xs' | 'sm' | 'base' | 'lg' | 'xl'
- All standard paragraph HTML attributes

## 🎯 Usage Examples

### **Form Example**

```tsx
import { Button, Input, Checkbox, Card, CardBody } from '@/components/ui'

function ContactForm() {
  return (
    <Card>
      <CardBody>
        <form className="space-y-6">
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            required
          />
          
          <Input
            label="Email Address"
            type="email"
            placeholder="Enter your email"
            helperText="We'll never share your email"
            required
          />
          
          <Checkbox
            label="Subscribe to newsletter"
            helperText="Receive updates about new features"
          />
          
          <Button type="submit" size="lg" className="w-full">
            Submit Form
          </Button>
        </form>
      </CardBody>
    </Card>
  )
}
```

### **Landing Page Section**

```tsx
import { H1, H2, Paragraph, Button } from '@/components/ui'

function HeroSection() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-white">
      <div className="container text-center">
        <H1 className="mb-6">
          Welcome to Vibe Coding
        </H1>
        <Paragraph size="xl" className="mb-8 max-w-2xl mx-auto">
          Build amazing applications with modern technologies and best practices.
        </Paragraph>
        <div className="flex gap-4 justify-center">
          <Button size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </section>
  )
}
```

## ♿ Accessibility Features

### **Built-in Accessibility**
- **ARIA Labels**: All components include proper ARIA attributes
- **Keyboard Navigation**: Full keyboard support for all interactive elements
- **Focus Management**: Proper focus indicators and management
- **Screen Reader Support**: Semantic HTML and ARIA descriptions
- **Color Contrast**: WCAG AA compliant color combinations

### **Form Accessibility**
- **Label Associations**: All form inputs are properly labeled
- **Error Announcements**: Screen readers announce validation errors
- **Helper Text**: Descriptive text for form fields
- **Required Indicators**: Clear indication of required fields

## 🎨 Customization

### **Extending Components**

```tsx
// Custom button variant
<Button 
  className="bg-purple-600 hover:bg-purple-700 text-white"
  variant="primary"
>
  Custom Button
</Button>

// Custom input styling
<Input 
  className="border-2 border-blue-300 focus:border-blue-500"
  label="Custom Input"
/>
```

### **Theme Customization**

Update `tailwind.config.js` to customize the design system:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          // ... other shades
          900: '#0c4a6e',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
    },
  },
}
```

## 📱 Responsive Design

All components are built with responsive design principles:

- **Mobile First**: Components work on all screen sizes
- **Flexible Layouts**: Components adapt to container width
- **Touch Friendly**: Proper touch targets for mobile devices
- **Scalable Typography**: Text scales appropriately across devices

## 🔧 Development

### **Adding New Components**

1. Create component file in `components/ui/`
2. Add TypeScript interface for props
3. Implement component with proper accessibility
4. Add to `components/ui/index.ts` exports
5. Update documentation

### **Component Structure**

```tsx
import React from 'react'
import { cn } from '@/lib/utils'

export interface ComponentProps {
  // Define props interface
}

const Component = React.forwardRef<HTMLElement, ComponentProps>(
  ({ className, ...props }, ref) => {
    return (
      <element
        ref={ref}
        className={cn('base-styles', className)}
        {...props}
      >
        {/* Component content */}
      </element>
    )
  }
)

Component.displayName = 'Component'

export default Component
```

## 🧪 Testing

### **Component Testing Checklist**
- [ ] Renders correctly with all props
- [ ] Handles user interactions properly
- [ ] Accessibility features work as expected
- [ ] Responsive design on different screen sizes
- [ ] Error states display correctly
- [ ] Loading states work properly

### **Accessibility Testing**
- [ ] Screen reader compatibility
- [ ] Keyboard navigation
- [ ] Focus management
- [ ] Color contrast compliance
- [ ] ARIA attributes validation

## 📚 Best Practices

### **Component Usage**
1. **Consistency**: Use the same component for similar UI patterns
2. **Composition**: Combine components to create complex interfaces
3. **Accessibility**: Always include proper labels and descriptions
4. **Performance**: Use React.memo for expensive components
5. **TypeScript**: Leverage TypeScript for type safety

### **Styling Guidelines**
1. **Utility Classes**: Use Tailwind utility classes for styling
2. **Custom Classes**: Extend with custom classes when needed
3. **Responsive**: Always consider mobile and tablet layouts
4. **Dark Mode**: Consider dark mode support for future updates
5. **Animation**: Use subtle animations for better UX

## 🚀 Future Enhancements

### **Planned Features**
- [ ] Dark mode support
- [ ] Animation variants
- [ ] More form components (Select, Textarea, etc.)
- [ ] Modal and Dialog components
- [ ] Navigation components
- [ ] Data display components (Table, List, etc.)

### **Performance Optimizations**
- [ ] Lazy loading for large component libraries
- [ ] Tree shaking for unused components
- [ ] Bundle size optimization
- [ ] Runtime performance monitoring

This component library provides a solid foundation for building consistent, accessible, and maintainable user interfaces for the Vibe Coding landing page and future projects. 