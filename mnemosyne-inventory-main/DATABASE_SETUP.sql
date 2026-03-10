-- ============================================================================
-- MNEMOSYNE INVENTORY MANAGEMENT - DATABASE SETUP
-- ============================================================================
-- Run this SQL in your Supabase SQL Editor to set up all required tables
-- https://supabase.com/dashboard/project/YOUR-PROJECT/sql
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
-- Stores user accounts for username/password authentication

CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT username_length CHECK (char_length(username) >= 3 AND char_length(username) <= 50),
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]+$'),
  CONSTRAINT email_format CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON public.users(is_active);

-- Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own data
CREATE POLICY "Users can read own data" ON public.users
  FOR SELECT
  USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);

-- Policy: Users can update their own data
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE
  USING (auth.uid() = auth_user_id OR auth.uid() IS NULL);

-- Policy: Allow inserts (for registration)
CREATE POLICY "Allow user registration" ON public.users
  FOR INSERT
  WITH CHECK (true);

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- 2. PASSWORD RESET TOKENS TABLE
-- ============================================================================
-- Stores password reset tokens for email-based password recovery

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Constraints
  CONSTRAINT token_length CHECK (char_length(token) >= 32)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON public.password_reset_tokens(expires_at);

-- RLS
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anonymous access to check tokens (needed for password reset flow)
CREATE POLICY "Allow token verification" ON public.password_reset_tokens
  FOR SELECT
  USING (true);

-- Policy: Allow inserts (for creating reset tokens)
CREATE POLICY "Allow token creation" ON public.password_reset_tokens
  FOR INSERT
  WITH CHECK (true);

-- Policy: Allow updates (for marking tokens as used)
CREATE POLICY "Allow token updates" ON public.password_reset_tokens
  FOR UPDATE
  USING (true);

-- Auto-cleanup expired tokens (optional, runs daily)
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM public.password_reset_tokens
  WHERE expires_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 3. INSERT DEFAULT ADMIN USER
-- ============================================================================
-- Creates the default mnemosyne admin account

DO $$
DECLARE
  admin_auth_id UUID;
  admin_user_id UUID;
BEGIN
  -- Check if user already exists
  IF NOT EXISTS (SELECT 1 FROM public.users WHERE username = 'mnemosyne') THEN
    
    -- Create auth user
    -- Note: You need to set the password manually via Supabase Dashboard or use Admin API
    -- For now, we'll create the user record and you'll set password separately
    
    INSERT INTO public.users (username, email, full_name, is_active)
    VALUES ('mnemosyne', 'mnemosyne@gmail.com', 'Mnemosyne Admin', true)
    RETURNING id INTO admin_user_id;
    
    RAISE NOTICE 'Default admin user created with ID: %', admin_user_id;
    RAISE NOTICE 'IMPORTANT: You need to create the Supabase Auth user separately!';
    RAISE NOTICE 'Go to Authentication > Users > Add User';
    RAISE NOTICE 'Email: mnemosyne@gmail.com';
    RAISE NOTICE 'Password: mnemosyne000';
    
  ELSE
    RAISE NOTICE 'Default admin user already exists';
  END IF;
END $$;

-- ============================================================================
-- 4. GRANT PERMISSIONS
-- ============================================================================

-- Grant permissions to authenticated users
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT, INSERT, UPDATE ON public.password_reset_tokens TO authenticated;

-- Grant permissions to anonymous users (for login/registration)
GRANT SELECT ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE ON public.password_reset_tokens TO anon;

-- ============================================================================
-- SETUP COMPLETE!
-- ============================================================================
-- Next steps:
-- 1. Create the Supabase Auth user for mnemosyne:
--    - Go to: Authentication > Users > Add User
--    - Email: mnemosyne@gmail.com
--    - Password: mnemosyne000
--    - Auto Confirm User: YES
--
-- 2. Link the auth user to the users table:
--    - Copy the auth user UUID from the dashboard
--    - Run this SQL (replace YOUR-AUTH-UUID):
--      UPDATE public.users 
--      SET auth_user_id = 'YOUR-AUTH-UUID' 
--      WHERE username = 'mnemosyne';
--
-- 3. Test login with username: mnemosyne, password: mnemosyne000
-- ============================================================================

SELECT 'Database setup complete! See comments above for next steps.' AS status;
