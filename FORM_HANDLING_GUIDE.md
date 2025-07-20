# Form Handling System Guide

A comprehensive form handling system for the Vibe Coding landing page with validation, error handling, and real-time updates.

## 🚀 API Routes

### **POST /api/submit-interest**

Handles interest form submissions with comprehensive validation and rate limiting.

**Features:**
- ✅ **Input Validation**: Name (2-255 chars), Email (valid format)
- ✅ **Rate Limiting**: 5 submissions per IP per hour
- ✅ **Duplicate Detection**: Prevents duplicate email submissions
- ✅ **Input Sanitization**: XSS protection
- ✅ **Error Handling**: Comprehensive error responses
- ✅ **CORS Support**: Preflight request handling

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subscribedToUpdates": true
}
```

**Success Response (201):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "John Doe",
    "email": "john@example.com",
    "subscribed_to_updates": true,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Interest form submitted successfully!",
  "rateLimit": {
    "remaining": 4,
    "resetTime": "2024-01-01T01:00:00Z"
  }
}
```

**Error Responses:**

**Validation Error (400):**
```json
{
  "success": false,
  "error": "Validation failed",
  "message": "Please check your input and try again",
  "errors": {
    "name": "Name is required",
    "email": "Please enter a valid email address"
  }
}
```

**Rate Limit Exceeded (429):**
```json
{
  "success": false,
  "error": "Rate limit exceeded",
  "message": "Too many submissions. Please try again later.",
  "retryAfter": 60
}
```

**Duplicate Email (409):**
```json
{
  "success": false,
  "error": "Email already exists",
  "message": "This email is already registered for interest updates",
  "data": {
    "existingSubmission": {
      "id": "uuid",
      "submittedAt": "2024-01-01T00:00:00Z"
    }
  }
}
```

### **GET /api/interest**

Retrieves the total submission count.

**Response:**
```json
{
  "success": true,
  "data": {
    "count": 42
  },
  "message": "Submission count retrieved successfully"
}
```

## 🎣 Custom Hooks

### **useInterestForm()**

A comprehensive hook for managing interest form state and submission.

**Features:**
- ✅ **Form State Management**: Name, email, subscribed status
- ✅ **Real-time Validation**: Field-level and form-level validation
- ✅ **Error Handling**: Field-specific and general errors
- ✅ **Loading States**: Submission progress tracking
- ✅ **Success States**: Form reset and success feedback
- ✅ **Auto-clear Errors**: Errors clear when user starts typing

**Usage:**
```tsx
import { useInterestForm } from '@/lib/hooks'

function MyForm() {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await submitForm()
    
    if (result?.success) {
      // Handle success
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={(e) => updateField('name', e.target.value)}
        onBlur={() => validateField('name')}
      />
      {errors.name && <span>{errors.name}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  )
}
```

### **useSubmissionCount()**

A hook for fetching and managing submission count with real-time updates.

**Features:**
- ✅ **Auto-refresh**: Updates every 30 seconds
- ✅ **Event-driven Updates**: Refreshes after form submissions
- ✅ **Error Handling**: Network error recovery
- ✅ **Loading States**: Loading indicators
- ✅ **Manual Refresh**: User-triggered refresh

**Usage:**
```tsx
import { useSubmissionCount } from '@/lib/hooks'

function SubmissionDisplay() {
  const { count, isLoading, error, refreshCount } = useSubmissionCount()

  if (error) {
    return <button onClick={refreshCount}>Retry</button>
  }

  return (
    <div>
      {isLoading ? 'Loading...' : `${count} submissions`}
    </div>
  )
}
```

## 🧩 Components

### **InterestForm**

A complete form component using the custom hook.

**Props:**
- `className`: CSS classes
- `onSuccess`: Callback for successful submission
- `onError`: Callback for submission errors

**Features:**
- ✅ **Real-time Validation**: Validates on blur
- ✅ **Error Display**: Field-specific error messages
- ✅ **Success Feedback**: Success message display
- ✅ **Loading States**: Button loading state
- ✅ **Auto-reset**: Form resets on successful submission

### **SubmissionCounter**

A component to display submission count with real-time updates.

**Props:**
- `className`: CSS classes
- `showLastUpdated`: Show last update timestamp
- `autoRefresh`: Enable automatic refresh

**Features:**
- ✅ **Real-time Count**: Updates automatically
- ✅ **Loading States**: Loading spinner
- ✅ **Error Recovery**: Retry button on errors
- ✅ **Timestamp Display**: Shows last update time
- ✅ **Manual Refresh**: User can refresh manually

## 🔒 Security Features

### **Input Validation**
- **Name**: 2-255 characters, required
- **Email**: Valid email format, required
- **Sanitization**: XSS protection with HTML escaping

### **Rate Limiting**
- **Limit**: 5 submissions per IP per hour
- **Headers**: Rate limit info in response headers
- **Reset**: Automatic reset after time window

### **Duplicate Prevention**
- **Email Check**: Prevents duplicate email submissions
- **Friendly Message**: Clear feedback for duplicates
- **Existing Data**: Returns existing submission info

### **Error Handling**
- **Network Errors**: Retry mechanisms
- **Validation Errors**: Field-specific messages
- **Server Errors**: Generic user-friendly messages
- **Rate Limit Errors**: Clear retry instructions

## 📊 Data Flow

### **Form Submission Flow**
1. **User Input** → Form validation
2. **API Request** → Rate limit check
3. **Database Check** → Duplicate email check
4. **Data Insert** → Supabase insertion
5. **Success Response** → Form reset + notification
6. **Count Update** → Real-time count refresh

### **Error Handling Flow**
1. **Validation Error** → Field-specific messages
2. **Rate Limit Error** → Retry after delay
3. **Duplicate Error** → Friendly message
4. **Network Error** → Retry option
5. **Server Error** → Generic message

## 🎯 Usage Examples

### **Basic Form Implementation**
```tsx
import { InterestForm } from '@/components/ui'

function MyPage() {
  return (
    <InterestForm
      onSuccess={(data) => {
        console.log('Success:', data)
      }}
      onError={(error) => {
        console.error('Error:', error)
      }}
    />
  )
}
```

### **Form with Custom Hook**
```tsx
import { useInterestForm } from '@/lib/hooks'

function CustomForm() {
  const { formData, errors, submitForm } = useInterestForm()

  const handleSubmit = async () => {
    const result = await submitForm()
    if (result?.success) {
      // Custom success handling
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      {/* Custom form fields */}
    </form>
  )
}
```

### **Submission Counter**
```tsx
import { SubmissionCounter } from '@/components/ui'

function Dashboard() {
  return (
    <div>
      <h2>Community Stats</h2>
      <SubmissionCounter 
        showLastUpdated={true}
        autoRefresh={true}
      />
    </div>
  )
}
```

## 🔧 Configuration

### **Rate Limiting**
```typescript
const RATE_LIMIT_MAX = 5 // submissions per IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000 // 1 hour in ms
```

### **Validation Rules**
```typescript
// Name validation
name.length >= 2 && name.length <= 255

// Email validation
/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
```

### **Auto-refresh Settings**
```typescript
// Submission counter refresh interval
const REFRESH_INTERVAL = 30000 // 30 seconds

// Form submission notification delay
const NOTIFICATION_DELAY = 1000 // 1 second
```

## 🚀 Performance Optimizations

### **Client-side Optimizations**
- **Debounced Validation**: Prevents excessive validation calls
- **Memoized Hooks**: Prevents unnecessary re-renders
- **Event-driven Updates**: Only refresh when needed
- **Error Recovery**: Automatic retry mechanisms

### **Server-side Optimizations**
- **Input Sanitization**: Prevents XSS attacks
- **Rate Limiting**: Prevents abuse
- **Database Indexing**: Fast email lookups
- **Caching**: Rate limit data caching

## 🔍 Debugging

### **API Testing**
```bash
# Test form submission
curl -X POST /api/submit-interest \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com"}'

# Test count retrieval
curl -X GET /api/interest
```

### **Error Monitoring**
- **Network Errors**: Check browser network tab
- **Validation Errors**: Check form error states
- **Rate Limit Errors**: Check response headers
- **Database Errors**: Check server logs

## 📈 Monitoring

### **Key Metrics**
- **Submission Rate**: Submissions per hour
- **Error Rate**: Failed submissions percentage
- **Response Time**: API response latency
- **Duplicate Rate**: Duplicate email attempts

### **Health Checks**
- **Database Connection**: Supabase connectivity
- **API Endpoints**: Route availability
- **Rate Limiting**: Rate limit functionality
- **Form Validation**: Client-side validation

This form handling system provides a robust, secure, and user-friendly experience for collecting interest submissions with comprehensive error handling and real-time updates. 