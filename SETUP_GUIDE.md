# Photo Restoration App Setup Guide

## Prerequisites
- Supabase project created
- Project ID: `ddbpucrrposyyfpwpigq`
- Environment variables configured

## Step 1: Environment Setup

Create a `.env.local` file in your project root:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://ddbpucrrposyyfpwpigq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Development redirect URL (for OAuth flows)
NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL=http://localhost:3000/auth/callback
```

**To get your anon key:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the "anon public" key

## Step 2: Database Schema Setup

### Option A: Run Complete Schema (Recommended)
1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `scripts/01_create_complete_schema.sql`
3. Click "Run" to execute all commands

### Option B: Step-by-Step Setup
If you encounter any errors, run these commands one by one:

```sql
-- 1. Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    credits_remaining INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = user_id);
```

## Step 3: Storage Setup

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `scripts/05_setup_storage.sql`
3. Click "Run"

This creates:
- `original-photos` bucket (private, for user uploads)
- `restored-photos` bucket (public, for restored images)
- `user-avatars` bucket (public, for profile pictures)

## Step 4: Test Authentication

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to `http://localhost:3000/auth/sign-up`
3. Create a test account
4. Check if you're redirected to the dashboard
5. Verify that a profile and credits record were created

## Step 5: Verify Database Records

In Supabase Dashboard → Table Editor, check:

1. **profiles table**: Should have your user record
2. **credits table**: Should show 5 credits
3. **credit_transactions table**: Should show "Welcome bonus credits"

## Troubleshooting

### Common Issues:

#### 1. "Table doesn't exist" error
- Make sure you ran the schema creation script first
- Check that you're in the correct project

#### 2. "Permission denied" error
- Ensure you're running SQL as the postgres user
- Check that RLS policies are created correctly

#### 3. Authentication not working
- Verify your environment variables are correct
- Check the browser console for errors
- Ensure the auth callback route exists

#### 4. Storage uploads failing
- Verify storage buckets were created
- Check storage policies are in place
- Ensure user is authenticated

### Debug Steps:

1. **Check Environment Variables:**
   ```bash
   # In your app, add this temporarily:
   console.log('SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
   console.log('SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
   ```

2. **Check Database Connection:**
   - Go to Supabase Dashboard → SQL Editor
   - Run: `SELECT current_database(), current_user;`

3. **Check RLS Policies:**
   ```sql
   SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
   FROM pg_policies
   WHERE schemaname = 'public';
   ```

## Next Steps

Once the basic setup is working:

1. **Add Photo Upload Functionality**
2. **Integrate with AI Restoration Service**
3. **Add Payment Processing**
4. **Implement User Management**
5. **Add Analytics and Monitoring**

## Security Notes

- ✅ RLS policies ensure users only see their own data
- ✅ Storage policies restrict file access by user
- ✅ Authentication is handled by Supabase Auth
- ✅ All sensitive operations use server-side functions

Your app is now properly secured with Row Level Security and proper authentication flow! 🎉
