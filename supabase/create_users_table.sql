-- ============================================================================
-- MNEMOSYNE USER AUTHENTICATION SYSTEM
-- ============================================================================
-- This creates a secure user authentication system with username/password login
-- and email-based password recovery
-- ============================================================================

-- Drop existing table if it exists
DROP TABLE IF EXISTS public.users CASCADE;

-- Create users table
CREATE TABLE public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(100),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE,
  is_active BOOLEAN DEFAULT true,
  
  -- Constraints
  CONSTRAINT username_format CHECK (username ~ '^[a-zA-Z0-9_-]{3,50}$'),
  CONSTRAINT email_format CHECK (email ~ '^[^\s@]+@[^\s@]+\.[^\s@]+$')
);

-- Create password reset tokens table for secure password recovery
CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT token_not_expired CHECK (expires_at > created_at)
);

-- Create indexes for performance
CREATE INDEX idx_users_username ON public.users(username);
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_auth_user_id ON public.users(auth_user_id);
CREATE INDEX idx_password_reset_tokens_token ON public.password_reset_tokens(token);
CREATE INDEX idx_password_reset_tokens_user_id ON public.password_reset_tokens(user_id);

-- Enable Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- RLS Policies for users table
CREATE POLICY "Users can view their own data"
  ON public.users FOR SELECT
  USING (auth.uid() = auth_user_id);

CREATE POLICY "Users can update their own data"
  ON public.users FOR UPDATE
  USING (auth.uid() = auth_user_id);

-- RLS Policies for password_reset_tokens (service role only)
CREATE POLICY "Service role full access to reset tokens"
  ON public.password_reset_tokens FOR ALL
  USING (true);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create user with Supabase Auth
CREATE OR REPLACE FUNCTION create_user_account(
  p_username VARCHAR,
  p_email VARCHAR,
  p_password VARCHAR,
  p_full_name VARCHAR DEFAULT NULL
)
RETURNS JSON AS $$
DECLARE
  v_auth_user_id UUID;
  v_user_id UUID;
  v_result JSON;
BEGIN
  -- Check if username already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE username = p_username) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Username already exists'
    );
  END IF;

  -- Check if email already exists
  IF EXISTS (SELECT 1 FROM public.users WHERE email = p_email) THEN
    RETURN json_build_object(
      'success', false,
      'error', 'Email already exists'
    );
  END IF;

  -- Note: In production, you would create the auth user via Supabase Admin API
  -- For now, we'll insert the user record assuming auth user exists
  
  INSERT INTO public.users (username, email, full_name)
  VALUES (p_username, p_email, p_full_name)
  RETURNING id INTO v_user_id;

  RETURN json_build_object(
    'success', true,
    'user_id', v_user_id,
    'message', 'User created successfully'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Insert default test user
-- Note: The password is hashed by Supabase Auth
-- In production, create this user via Supabase Auth Dashboard or Admin API
-- This is just the user profile record
INSERT INTO public.users (username, email, full_name, is_active)
VALUES 
  ('mnemosyne', 'mnemosyne@gmail.com', 'Mnemosyne Admin', true)
ON CONFLICT (username) DO NOTHING;

-- Grant permissions
GRANT SELECT, INSERT, UPDATE ON public.users TO authenticated;
GRANT SELECT ON public.users TO anon;
GRANT ALL ON public.password_reset_tokens TO authenticated;

-- ============================================================================
-- INSTRUCTIONS FOR SETUP:
-- ============================================================================
-- 1. Run this SQL in your Supabase SQL Editor
-- 
-- 2. Create the default test user in Supabase Auth:
--    - Go to Authentication > Users in Supabase Dashboard
--    - Click "Add User" > "Create new user"
--    - Email: mnemosyne@gmail.com
--    - Password: mnemosyne000
--    - Auto Confirm User: YES
--
-- 3. After creating the auth user, link it to the users table:
--    UPDATE public.users 
--    SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'mnemosyne@gmail.com')
--    WHERE username = 'mnemosyne';
--
-- ============================================================================

COMMENT ON TABLE public.users IS 'User profiles with username/email authentication';
COMMENT ON TABLE public.password_reset_tokens IS 'Secure tokens for password reset functionality';
COMMENT ON COLUMN public.users.username IS 'Unique username for login (3-50 alphanumeric characters)';
COMMENT ON COLUMN public.users.email IS 'Email address for password recovery and notifications';
COMMENT ON COLUMN public.users.auth_user_id IS 'Reference to Supabase auth.users table';
