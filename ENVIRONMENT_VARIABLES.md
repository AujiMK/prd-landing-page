# Environment Variables Documentation

Complete guide for configuring environment variables for the Vibe Coding landing page.

## 📋 **Required Variables**

### **Supabase Configuration**
```bash
# Supabase Project URL (Required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co

# Supabase Anonymous Key (Required)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Supabase Service Role Key (Required for API routes)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

## 🔧 **Optional Variables**

### **Authentication (Future Features)**
```bash
# NextAuth.js Secret
NEXTAUTH_SECRET=your-nextauth-secret-here

# NextAuth.js URL
NEXTAUTH_URL=http://localhost:3000
```

### **Analytics & Tracking**
```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Google Tag Manager
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Plausible Analytics
NEXT_PUBLIC_PLAUSIBLE_DOMAIN=your-domain.com
```

### **Error Tracking**
```bash
# Sentry DSN
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/xxxxx
```

### **Email & Notifications**
```bash
# SMTP Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### **Rate Limiting**
```bash
RATE_LIMIT_MAX_REQUESTS=10
RATE_LIMIT_WINDOW_MS=60000
```

### **Security**
```bash
# CORS Origins
CORS_ORIGINS=http://localhost:3000,https://your-domain.com

# API Key
API_KEY=your-api-key-here
```

### **Production Settings**
```bash
# Production URL
NEXT_PUBLIC_SITE_URL=https://your-domain.com

# CDN URL
NEXT_PUBLIC_CDN_URL=https://cdn.your-domain.com
```

### **Feature Flags**
```bash
ENABLE_ANALYTICS=true
ENABLE_ERROR_TRACKING=true
ENABLE_EMAIL_NOTIFICATIONS=false
ENABLE_RATE_LIMITING=true
```

## 🚀 **Setup Instructions**

### **1. Local Development**
```bash
# Copy the example file
cp .env.local.example .env.local

# Edit with your values
nano .env.local
```

### **2. Netlify Deployment**
1. Go to your Netlify dashboard
2. Navigate to Site settings > Environment variables
3. Add each variable with production values
4. Redeploy your site

### **3. Environment-Specific Values**

#### **Development (.env.local)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://dev-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=dev-anon-key
SUPABASE_SERVICE_ROLE_KEY=dev-service-role-key
NEXTAUTH_URL=http://localhost:3000
```

#### **Production (Netlify Dashboard)**
```bash
NEXT_PUBLIC_SUPABASE_URL=https://prod-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=prod-anon-key
SUPABASE_SERVICE_ROLE_KEY=prod-service-role-key
NEXTAUTH_URL=https://your-domain.com
```

## 🔒 **Security Best Practices**

### **1. Key Management**
- ✅ Use strong, unique secrets
- ✅ Rotate keys regularly
- ✅ Use environment-specific values
- ✅ Never commit secrets to git

### **2. Access Control**
- ✅ Limit API key permissions
- ✅ Use read-only keys where possible
- ✅ Monitor for unauthorized access
- ✅ Enable audit logging

### **3. Environment Separation**
- ✅ Separate dev/staging/prod databases
- ✅ Use different API keys per environment
- ✅ Test with production-like data
- ✅ Validate all configurations

## 📊 **Monitoring & Alerts**

### **1. Health Checks**
```bash
# Health check endpoint
HEALTH_CHECK_ENDPOINT=/api/health

# Monitor these endpoints:
# - /api/health
# - /api/interest
# - /api/submit-interest
```

### **2. Error Tracking**
```bash
# Enable Sentry for error tracking
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn.ingest.sentry.io/xxxxx
```

### **3. Performance Monitoring**
```bash
# Enable analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

## 🧪 **Testing Configuration**

### **Test Environment Variables**
```bash
# Test database
TEST_DATABASE_URL=postgresql://test:test@localhost:5432/test_db

# Test API key
TEST_API_KEY=test-api-key

# Test Supabase
TEST_SUPABASE_URL=https://test-project.supabase.co
TEST_SUPABASE_ANON_KEY=test-anon-key
```

## 📝 **Validation Checklist**

### **Before Deployment**
- [ ] All required variables are set
- [ ] Production values are correct
- [ ] No development values in production
- [ ] Secrets are properly secured
- [ ] CORS origins are configured
- [ ] Rate limiting is enabled
- [ ] Error tracking is configured
- [ ] Analytics are enabled

### **After Deployment**
- [ ] Form submissions work
- [ ] Counter updates correctly
- [ ] No console errors
- [ ] Performance is acceptable
- [ ] Security headers are present
- [ ] SSL certificate is valid
- [ ] Monitoring is working
- [ ] Alerts are configured

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. Missing Environment Variables**
```bash
# Error: NEXT_PUBLIC_SUPABASE_URL is not defined
# Solution: Add to .env.local or Netlify dashboard
```

#### **2. CORS Errors**
```bash
# Error: CORS policy violation
# Solution: Update CORS_ORIGINS with your domain
```

#### **3. Rate Limiting**
```bash
# Error: Too many requests
# Solution: Adjust RATE_LIMIT_MAX_REQUESTS
```

#### **4. Database Connection**
```bash
# Error: Database connection failed
# Solution: Check Supabase URL and keys
```

### **Debug Commands**
```bash
# Check environment variables
npm run env:check

# Validate configuration
npm run validate:config

# Test API endpoints
npm run test:api
```

## 📚 **Additional Resources**

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/get-started/)
- [Security Best Practices](https://owasp.org/www-project-top-ten/)

---

**Remember**: Never commit sensitive environment variables to version control. Always use `.env.local` for local development and secure environment variable management for production deployments. 