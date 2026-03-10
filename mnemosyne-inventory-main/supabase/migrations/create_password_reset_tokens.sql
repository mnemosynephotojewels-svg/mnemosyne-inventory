-- ============================================================================
-- Password Reset Tokens Table Migration
-- ============================================================================
-- This migration creates the password_reset_tokens table for secure password
-- recovery using email-based reset links via Resend email service
-- ============================================================================

-- Create password_reset_tokens table
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE,
  
  -- Constraints
  CONSTRAINT valid_expiry CHECK (expires_at > created_at),
  CONSTRAINT token_not_empty CHECK (char_length(token) > 0)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token 
  ON password_reset_tokens(token) 
  WHERE used = false;

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id 
  ON password_reset_tokens(user_id);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at 
  ON password_reset_tokens(expires_at) 
  WHERE used = false;

-- Enable Row Level Security
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Service role can manage password reset tokens" ON password_reset_tokens;
DROP POLICY IF EXISTS "Allow service role full access" ON password_reset_tokens;

-- Create policy to allow service role to manage tokens
CREATE POLICY "Service role can manage password reset tokens"
  ON password_reset_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Create function to clean up expired tokens
CREATE OR REPLACE FUNCTION cleanup_expired_reset_tokens()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE expires_at < NOW()
  OR (used = true AND used_at < NOW() - INTERVAL '7 days');
  
  RAISE NOTICE 'Cleaned up expired password reset tokens';
END;
$$;

-- Comment the table and columns
COMMENT ON TABLE password_reset_tokens IS 'Stores secure tokens for password reset functionality';
COMMENT ON COLUMN password_reset_tokens.id IS 'Unique identifier for the reset token record';
COMMENT ON COLUMN password_reset_tokens.user_id IS 'Reference to the user requesting password reset';
COMMENT ON COLUMN password_reset_tokens.token IS 'Unique reset token sent via email (UUID v4)';
COMMENT ON COLUMN password_reset_tokens.expires_at IS 'Expiration timestamp (typically 1 hour from creation)';
COMMENT ON COLUMN password_reset_tokens.used IS 'Flag indicating if token has been used';
COMMENT ON COLUMN password_reset_tokens.created_at IS 'Timestamp when token was created';
COMMENT ON COLUMN password_reset_tokens.used_at IS 'Timestamp when token was used';

-- Grant permissions
GRANT ALL ON password_reset_tokens TO service_role;
GRANT SELECT, INSERT ON password_reset_tokens TO authenticated;

-- Optional: Create a cron job to automatically clean up expired tokens daily
-- Note: This requires the pg_cron extension to be enabled in Supabase
-- You can enable this in Supabase Dashboard > Database > Extensions
-- Then add this in Dashboard > Database > Cron Jobs:
-- 
-- SELECT cron.schedule(
--   'cleanup-expired-reset-tokens',
--   '0 2 * * *', -- Run at 2 AM every day
--   $$SELECT cleanup_expired_reset_tokens()$$
-- );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Password reset tokens table created successfully!';
  RAISE NOTICE '📧 Ready for Resend email integration';
  RAISE NOTICE '🔒 Row Level Security enabled';
  RAISE NOTICE '⏰ Run cleanup_expired_reset_tokens() periodically to remove old tokens';
END $$;
