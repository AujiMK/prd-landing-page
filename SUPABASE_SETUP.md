# Supabase Integration Setup Guide

This guide will help you set up Supabase integration for the Vibe Coding landing page project.

## Prerequisites

1. A Supabase account (sign up at [supabase.com](https://supabase.com))
2. Node.js 18+ installed
3. The project dependencies installed (`npm install`)

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `vibe-coding-landing`
   - **Database Password**: Create a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for the project to be created (usually 1-2 minutes)

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (starts with `https://`)
   - **anon public** key (starts with `eyJ`)
   - **service_role** key (starts with `eyJ`)

## Step 3: Set Up Environment Variables

1. Copy the environment template:
   ```bash
   cp env.example .env.local
   ```

2. Update `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
   NEXT_PUBLIC_SITE_NAME=Vibe Coding Landing Page
   ```

## Step 4: Create Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Run the following SQL to create the database schema:

```sql
-- Create the interest_submissions table
CREATE TABLE interest_submissions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  subscribed_to_updates BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Create index for email lookups
CREATE INDEX idx_interest_submissions_email ON interest_submissions(email);

-- Enable Row Level Security
ALTER TABLE interest_submissions ENABLE ROW LEVEL SECURITY;

-- Create policies for public access
CREATE POLICY "Enable insert for all users" ON interest_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable read count for all users" ON interest_submissions FOR SELECT USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_interest_submissions_updated_at 
    BEFORE UPDATE ON interest_submissions 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

## Step 5: Test the Integration

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Visit http://localhost:3000

3. Fill out the interest form and submit

4. Check your Supabase dashboard:
   - Go to **Table Editor** → **interest_submissions**
   - You should see your submission in the table

## Step 6: API Endpoints

The following API endpoints are available:

### POST /api/interest
Submit a new interest form entry.

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
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  },
  "message": "Interest form submitted successfully!"
}
```

### GET /api/interest
Get the total count of submissions.

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

## Step 7: Environment Variable Validation

The application includes environment variable validation:

- `NEXT_PUBLIC_SUPABASE_URL` - Required for client-side operations
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Required for client-side operations
- `SUPABASE_SERVICE_ROLE_KEY` - Required for server-side operations

If any required environment variables are missing, the application will throw an error during startup.

## Step 8: Database Functions

The following utility functions are available in `lib/utils.ts`:

### `submitInterestForm(data: InterestFormData)`
Submits a new interest form entry with validation.

### `getSubmissionCount()`
Retrieves the total count of submissions.

### `validateInterestForm(data: InterestFormData)`
Validates interest form data.

### `handleApiResponse(response: any)`
Standardizes API response handling.

## Step 9: TypeScript Types

All database types are defined in `lib/types.ts`:

- `InterestFormData` - Form data interface
- `ApiResponse<T>` - Standard API response interface
- `DatabaseResult<T>` - Database operation result interface
- `Database` - Complete Supabase database schema

## Step 10: Security Considerations

1. **Row Level Security (RLS)** is enabled on the `interest_submissions` table
2. **Email uniqueness** is enforced at the database level
3. **Input validation** is performed both client-side and server-side
4. **Error handling** is implemented for all database operations
5. **Environment variables** are validated at startup

## Troubleshooting

### Common Issues

1. **"Missing environment variable" error**
   - Ensure all required environment variables are set in `.env.local`
   - Restart the development server after updating environment variables

2. **"Database connection failed" error**
   - Verify your Supabase URL and keys are correct
   - Check that your Supabase project is active

3. **"Email already exists" error**
   - This is expected behavior - emails must be unique
   - The form will show an appropriate error message

4. **"Permission denied" error**
   - Ensure RLS policies are correctly set up
   - Check that the anon key has the correct permissions

### Getting Help

1. Check the Supabase dashboard for any errors
2. Review the browser console for client-side errors
3. Check the terminal for server-side errors
4. Verify your database schema matches the provided SQL

## Deployment

When deploying to Netlify:

1. Add your environment variables in the Netlify dashboard
2. Ensure all environment variables are prefixed with `NEXT_PUBLIC_` for client-side access
3. The `SUPABASE_SERVICE_ROLE_KEY` should only be used server-side

## Next Steps

1. Customize the form styling to match your brand
2. Add additional form fields as needed
3. Implement email notifications for new submissions
4. Add analytics tracking for form submissions
5. Create admin dashboard for managing submissions 