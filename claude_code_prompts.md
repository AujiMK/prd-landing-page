# Claude Code Task Prompts - Vibe Coding Landing Page

## ================== TASK 1: PROJECT SETUP ==================

**Prompt for Claude Code:**

```
Create a new Next.js 14+ project for a landing page with the following setup:

PROJECT REQUIREMENTS:
- Initialize Next.js project with TypeScript
- Install and configure TailwindCSS v3.14 (do NOT use PostCSS)
- Install Supabase client library
- Set up project structure for a single landing page
- Configure for Netlify deployment

FOLDER STRUCTURE:
```
/
├── app/
│   ├── page.tsx (main landing page)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/ (reusable UI components)
│   └── sections/ (page sections)
├── lib/
│   ├── supabase.ts (Supabase client)
│   ├── types.ts (TypeScript types)
│   └── utils.ts (utility functions)
├── public/
├── tailwind.config.js
├── next.config.js
├── package.json
└── .env.local.example
```

CONFIGURATION FILES NEEDED:
1. Tailwind config with custom fonts and minimal color palette
2. Next.js config optimized for Netlify
3. Environment variables template
4. Basic TypeScript types for form data

DO NOT implement the UI components yet - just set up the project foundation.
```

## ================== TASK 2: SUPABASE INTEGRATION ==================

**Prompt for Claude Code:**

```
Set up Supabase integration for the Vibe Coding landing page project:

REQUIREMENTS:
1. Create Supabase client configuration in lib/supabase.ts
2. Define TypeScript types for database schema in lib/types.ts
3. Create utility functions for database operations in lib/utils.ts
4. Set up environment variables for Supabase connection

DATABASE SCHEMA (create this in Supabase dashboard manually):
```sql
CREATE TABLE interest_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_to_updates BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX idx_interest_submissions_email ON interest_submissions(email);
ALTER TABLE interest_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Enable insert for all users" ON interest_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read count for all users" ON interest_submissions FOR SELECT USING (true);
```

FUNCTIONS TO CREATE:
1. submitInterestForm(name, email, subscribed) - Insert new submission
2. getSubmissionCount() - Get total count of submissions
3. validateEmail(email) - Email validation utility
4. handleApiResponse(response) - Standardized API response handling

ENSURE:
- Proper error handling for all database operations
- Type safety with TypeScript
- Reusable functions that follow DRY principles
- Environment variable validation
```

## ================== TASK 3: REUSABLE UI COMPONENTS ==================

**Prompt for Claude Code:**

```
Create reusable UI components for the Vibe Coding landing page:

COMPONENTS TO BUILD (in components/ui/):

1. **Button Component** (Button.tsx)
   - Variants: primary, secondary, ghost
   - Sizes: sm, md, lg
   - Loading state support
   - TypeScript props interface

2. **Input Component** (Input.tsx)
   - Text and email input types
   - Error state styling
   - Label and helper text support
   - Validation state indicators

3. **Checkbox Component** (Checkbox.tsx)
   - Custom styling with Tailwind
   - Accessible with proper ARIA labels
   - Error state support

4. **Card Component** (Card.tsx)
   - Minimal design for form container
   - Responsive padding and shadows
   - Optional header/footer sections

5. **Typography Components** (Typography.tsx)
   - Heading (h1, h2, h3 variants)
   - Paragraph with different sizes
   - Consistent font families and spacing

DESIGN REQUIREMENTS:
- Minimalist aesthetic with clean lines
- Professional typography (suggest: Inter for body, Space Grotesk for headings)
- Subtle shadows and rounded corners
- Responsive design patterns
- Consistent color scheme (neutral grays, single accent color)
- Proper TypeScript interfaces for all props
- Accessible components (ARIA labels, keyboard navigation)

FOLLOW DRY PRINCIPLES:
- Create base styles that components extend
- Use composition over inheritance
- Implement consistent spacing/sizing scales
- Reusable variant patterns
```

## ================== TASK 4: FORM LOGIC & API ROUTES ==================

**Prompt for Claude Code:**

```
Implement form handling logic and API routes for the interest submission form:

API ROUTE TO CREATE:
- app/api/submit-interest/route.ts (POST endpoint)

FORM LOGIC REQUIREMENTS:
1. **API Route Functions**:
   - Validate incoming form data (name, email, subscribed boolean)
   - Sanitize and validate email format
   - Check for duplicate email submissions
   - Insert data into Supabase
   - Return appropriate success/error responses
   - Handle rate limiting (optional)

2. **Client-side Form Hook** (lib/hooks/useInterestForm.ts):
   - Form state management (name, email, subscribed)
   - Form validation (required fields, email format)
   - Submission handling with loading states
   - Error message management
   - Success state handling
   - Form reset functionality

3. **Submission Counter Hook** (lib/hooks/useSubmissionCount.ts):
   - Fetch and display total submission count
   - Real-time updates after form submission
   - Loading and error states
   - Automatic refresh logic

VALIDATION RULES:
- Name: required, 2-255 characters, trim whitespace
- Email: required, valid email format, lowercase conversion
- Rate limiting: max 5 submissions per IP per hour (optional)
- Duplicate email handling: show friendly message

ERROR HANDLING:
- Network errors with retry options
- Validation errors with field-specific messages
- Server errors with generic user-friendly messages
- Success confirmation with clear next steps

ENSURE:
- TypeScript interfaces for all data structures
- Proper HTTP status codes
- CORS headers if needed
- Input sanitization for security
- Reusable error handling patterns
```

## ================== TASK 5: HERO SECTION COMPONENT ==================

**Prompt for Claude Code:**

```
Build the Hero Section component using previously created UI components:

COMPONENT TO CREATE:
- components/sections/HeroSection.tsx

LAYOUT REQUIREMENTS:
- Responsive grid: 60% content, 40% form on desktop
- Stack vertically on mobile (form below content)
- Proper spacing and alignment
- Maximum width container with centered alignment

LEFT SIDE CONTENT:
1. **Main Headline**: "Vibe Coding Course"
   - Large, bold typography using heading component
   - Professional font (Space Grotesk recommended)
   
2. **Subheadline**: "Release your MVP within a month"
   - Supporting text with proper hierarchy
   - Emphasize speed and results
   
3. **Live Counter**: "X developers have joined the waitlist"
   - Use submission count hook
   - Update dynamically after form submissions
   - Loading state while fetching count

RIGHT SIDE FORM:
1. Use Card component as form container
2. Form fields using UI components:
   - Name input (required)
   - Email input (required)
   - Subscribe checkbox (optional)
   - Submit button with loading state

INTEGRATION REQUIREMENTS:
- Import and use all previously created UI components
- Implement form submission using useInterestForm hook
- Display submission count using useSubmissionCount hook
- Handle all loading, error, and success states
- Form validation with real-time feedback
- Success message after submission
- Reset form after successful submission

RESPONSIVE DESIGN:
- Mobile-first approach
- Proper spacing on all screen sizes
- Touch-friendly form elements on mobile
- Maintain visual hierarchy across breakpoints

ACCESSIBILITY:
- Proper heading hierarchy (h1 for main title)
- ARIA labels for form elements
- Focus management for keyboard navigation
- Screen reader friendly error messages
```

## ================== TASK 6: MAIN PAGE INTEGRATION ==================

**Prompt for Claude Code:**

```
Integrate all components into the main landing page:

FILES TO UPDATE:
- app/page.tsx (main landing page)
- app/layout.tsx (root layout)
- app/globals.css (global styles)

PAGE STRUCTURE:
1. **Layout Setup** (layout.tsx):
   - Include proper meta tags for SEO
   - Set up font loading (Inter + Space Grotesk)
   - Configure viewport and responsive meta tags
   - Add basic favicon setup

2. **Main Page** (page.tsx):
   - Import and render HeroSection component
   - Set up proper page title and description
   - Implement any additional SEO meta tags
   - Add structured data for search engines

3. **Global Styles** (globals.css):
   - Import Tailwind base, components, utilities
   - Add custom CSS variables for consistent theming
   - Set up smooth scrolling and basic resets
   - Define focus styles for accessibility

SEO OPTIMIZATION:
- Page title: "Vibe Coding Course - Build Your MVP in 30 Days"
- Meta description: "Join thousands learning to code and ship fast. Master modern development and launch your MVP within a month."
- Open Graph tags for social sharing
- Twitter card meta tags
- Canonical URL setup

PERFORMANCE:
- Optimize font loading with next/font
- Add loading="eager" for above-fold images
- Minimize CSS bundle size
- Ensure fast first contentful paint

TESTING CHECKLIST:
- Form submission works end-to-end
- Submission counter updates correctly
- Responsive design on mobile/desktop
- All validation messages display properly
- Loading states work correctly
- Error handling functions as expected
- SEO tags render correctly
```

## ================== TASK 7: DEPLOYMENT & PRODUCTION SETUP ==================

**Prompt for Claude Code:**

```
Prepare the project for Netlify deployment and production:

DEPLOYMENT FILES:
1. **netlify.toml** configuration:
   - Build settings for Next.js
   - Environment variable placeholders
   - Redirect rules for SPA routing
   - Headers for security

2. **Production Environment Setup**:
   - Update .env.local.example with all required variables
   - Create production-ready environment variable documentation
   - Set up proper error boundaries for production

3. **Build Optimization**:
   - Configure next.config.js for static export if needed
   - Optimize bundle size with proper imports
   - Set up proper caching headers
   - Configure image optimization settings

PRODUCTION CHECKLIST:
- All environment variables documented
- Error boundaries implemented
- Loading states for all async operations
- Proper error messages for users
- Form submission works with production Supabase
- Analytics integration ready (Google Analytics/Plausible)
- Performance optimization verified
- Security headers configured
- CORS settings for API routes

DOCUMENTATION:
Create README.md with:
- Project setup instructions
- Environment variables required
- Deployment steps for Netlify
- Development workflow
- Component documentation
- API endpoint documentation

FINAL TESTING:
- Build passes without errors
- All TypeScript types are correct
- Form submissions work end-to-end
- Counter updates in real-time
- Responsive design verified
- Accessibility compliance checked
- Performance metrics meet targets

MONITORING SETUP:
- Error tracking integration points
- Performance monitoring hooks
- Form conversion tracking
- Basic analytics event triggers
```

---

## USAGE INSTRUCTIONS FOR CLAUDE CODE:

1. **Run tasks sequentially** - Each task builds on the previous one
2. **Complete each task fully** before moving to the next
3. **Test functionality** after tasks 4, 5, and 6
4. **Review code quality** - ensure DRY principles and TypeScript safety
5. **Deploy after task 7** - follow the deployment checklist

## NOTES:
- Each prompt is self-contained but builds on previous work
- Maintain consistent coding standards across all tasks
- Focus on reusability and maintainability
- Prioritize TypeScript type safety
- Follow accessibility best practices