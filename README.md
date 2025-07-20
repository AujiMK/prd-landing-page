# Vibe Coding Landing Page

A modern, responsive landing page built with Next.js 14+, TypeScript, and TailwindCSS. Features a Hero Section with integrated form handling, real-time submission counter, and comprehensive SEO optimization.

## 🚀 **Features**

- ✅ **Responsive Design** - Mobile-first approach with perfect scaling
- ✅ **Form Integration** - Real-time validation and submission handling
- ✅ **Live Counter** - Dynamic submission count with auto-refresh
- ✅ **SEO Optimized** - Meta tags, structured data, and performance
- ✅ **Accessibility** - WCAG compliant with screen reader support
- ✅ **Error Handling** - Comprehensive error boundaries and user feedback
- ✅ **Performance** - Optimized bundle size and Core Web Vitals
- ✅ **Security** - Input validation, rate limiting, and CORS protection

## 📋 **Tech Stack**

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS v3.4
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Netlify
- **Fonts**: Inter + Space Grotesk (Google Fonts)
- **Icons**: Heroicons (SVG)

## 🛠️ **Quick Start**

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- Supabase account

### **1. Clone Repository**
```bash
git clone https://github.com/your-username/vibe-coding-landing.git
cd vibe-coding-landing
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Environment Setup**
```bash
# Copy environment variables template
cp .env.local.example .env.local

# Edit with your Supabase credentials
nano .env.local
```

### **4. Run Development Server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 **Environment Variables**

### **Required Variables**
```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

### **Optional Variables**
```bash
# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Error Tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/xxxxx

# Authentication (Future)
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3000
```

See [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) for complete documentation.

## 🏗️ **Project Structure**

```
vibe-coding-landing/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── interest/             # Submission counter API
│   │   └── submit-interest/      # Form submission API
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/                    # React components
│   ├── ui/                       # UI component library
│   │   ├── Button.tsx           # Button component
│   │   ├── Input.tsx            # Input component
│   │   ├── Checkbox.tsx         # Checkbox component
│   │   ├── Card.tsx             # Card component
│   │   ├── Typography.tsx       # Typography components
│   │   ├── InterestForm.tsx     # Form component
│   │   ├── SubmissionCounter.tsx # Counter component
│   │   └── index.ts             # Component exports
│   ├── sections/                 # Page sections
│   │   ├── HeroSection.tsx      # Hero section
│   │   └── index.ts             # Section exports
│   └── ErrorBoundary.tsx        # Error handling
├── lib/                          # Utility libraries
│   ├── hooks/                    # Custom React hooks
│   │   ├── useInterestForm.ts   # Form handling hook
│   │   ├── useSubmissionCount.ts # Counter hook
│   │   └── index.ts             # Hook exports
│   ├── supabase.ts              # Supabase client
│   └── types.ts                 # TypeScript types
├── public/                       # Static assets
├── netlify.toml                 # Netlify configuration
├── next.config.js               # Next.js configuration
└── package.json                 # Dependencies
```

## 🚀 **Deployment**

### **Netlify Deployment**

1. **Connect Repository**
   - Push code to GitHub/GitLab
   - Connect repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `out`

2. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables
   - Use production Supabase credentials

3. **Deploy**
   - Netlify will automatically deploy on push
   - Check deployment logs for any issues
   - Verify form submissions work

### **Manual Deployment**
```bash
# Build for production
npm run build

# Export static files
npm run export

# Deploy to your hosting provider
```

## 📊 **API Endpoints**

### **GET /api/interest**
Returns the current submission count.

**Response:**
```json
{
  "count": 1234,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### **POST /api/submit-interest**
Handles form submissions.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subscribedToUpdates": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subscribed_to_updates": true,
    "created_at": "2024-01-01T00:00:00.000Z"
  }
}
```

## 🧪 **Testing**

### **Run Tests**
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

### **Testing Checklist**
See [TESTING_CHECKLIST.md](./TESTING_CHECKLIST.md) for comprehensive testing guidelines.

## 📈 **Performance**

### **Core Web Vitals Targets**
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

### **Optimization Features**
- ✅ **Code Splitting** - Automatic bundle optimization
- ✅ **Image Optimization** - WebP format support
- ✅ **Font Optimization** - Display swap for fast loading
- ✅ **Caching** - Static assets cached for 1 year
- ✅ **Minification** - CSS and JS minified for production

## 🔒 **Security**

### **Security Features**
- ✅ **Input Validation** - Server-side validation
- ✅ **Rate Limiting** - Prevents abuse
- ✅ **CORS Protection** - Configured for production
- ✅ **XSS Protection** - Input sanitization
- ✅ **CSRF Protection** - Form token validation
- ✅ **Security Headers** - Comprehensive header configuration

### **Security Headers**
```http
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'...
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

## ♿ **Accessibility**

### **WCAG 2.1 AA Compliance**
- ✅ **Semantic HTML** - Proper heading hierarchy
- ✅ **ARIA Labels** - Screen reader support
- ✅ **Keyboard Navigation** - Full keyboard accessibility
- ✅ **Color Contrast** - WCAG AA compliant
- ✅ **Focus Management** - Visible focus indicators
- ✅ **Error Announcements** - Screen reader error feedback

## 📱 **Responsive Design**

### **Breakpoints**
- **Mobile**: < 640px
- **Tablet**: 640px - 1023px
- **Desktop**: 1024px+

### **Features**
- ✅ **Mobile-First** - Progressive enhancement
- ✅ **Touch-Friendly** - 44px+ touch targets
- ✅ **Flexible Layout** - CSS Grid and Flexbox
- ✅ **Optimized Images** - Responsive image loading

## 🔧 **Development**

### **Available Scripts**
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run export       # Export static files

# Linting and Type Checking
npm run lint         # Run ESLint
npm run lint:fix     # Fix ESLint errors
npm run type-check   # Run TypeScript check

# Testing
npm test             # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage

# Utilities
npm run analyze      # Analyze bundle size
npm run clean        # Clean build artifacts
```

### **Code Quality**
- **ESLint** - JavaScript/TypeScript linting
- **Prettier** - Code formatting
- **TypeScript** - Type safety
- **Husky** - Git hooks for quality

## 📚 **Documentation**

### **Component Documentation**
- [UI Components](./components/ui/) - Reusable UI components
- [Sections](./components/sections/) - Page sections
- [Hooks](./lib/hooks/) - Custom React hooks

### **Guides**
- [Form Handling Guide](./FORM_HANDLING_GUIDE.md) - Form implementation details
- [Hero Section Guide](./HERO_SECTION_GUIDE.md) - Hero section documentation
- [Testing Checklist](./TESTING_CHECKLIST.md) - Comprehensive testing guide
- [Environment Variables](./ENVIRONMENT_VARIABLES.md) - Environment setup

## 🤝 **Contributing**

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `npm test`
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

### **Code Standards**
- Follow TypeScript best practices
- Use ESLint and Prettier
- Write tests for new features
- Update documentation as needed

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 **Support**

### **Getting Help**
- 📧 **Email**: support@vibecoding.com
- 🐛 **Issues**: [GitHub Issues](https://github.com/your-username/vibe-coding-landing/issues)
- 📖 **Documentation**: [Project Wiki](https://github.com/your-username/vibe-coding-landing/wiki)

### **Common Issues**
- **Build Errors**: Check environment variables
- **Form Issues**: Verify Supabase configuration
- **Performance**: Run `npm run analyze` for bundle analysis
- **Deployment**: Check Netlify build logs

## 🎯 **Roadmap**

### **Planned Features**
- [ ] **Authentication** - User accounts and profiles
- [ ] **Email Notifications** - Form submission notifications
- [ ] **Analytics Dashboard** - Submission analytics
- [ ] **A/B Testing** - Conversion optimization
- [ ] **Multi-language** - Internationalization support
- [ ] **PWA Support** - Progressive Web App features

### **Performance Improvements**
- [ ] **Image Optimization** - Advanced image processing
- [ ] **CDN Integration** - Global content delivery
- [ ] **Caching Strategy** - Advanced caching implementation
- [ ] **Bundle Analysis** - Continuous bundle monitoring

---

**Built with ❤️ by the Vibe Coding Team**

For questions, support, or contributions, please reach out to our team! 