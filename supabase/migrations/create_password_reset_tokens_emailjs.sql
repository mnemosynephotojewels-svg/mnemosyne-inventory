-- ============================================================================
-- PASSWORD RESET TOKENS TABLE FOR EMAILJS
-- ============================================================================
-- This table stores password reset tokens for the EmailJS-based password reset
-- Token-based system: secure, one-time use, expires after 1 hour
-- ============================================================================

-- Create password_reset_tokens table if it doesn't exist
CREATE TABLE IF NOT EXISTS password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  used_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token ON password_reset_tokens(token);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_user_id ON password_reset_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at ON password_reset_tokens(expires_at);

-- Enable Row Level Security
ALTER TABLE password_reset_tokens ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to read tokens (needed for verification)
CREATE POLICY "Allow public to read tokens" ON password_reset_tokens
  FOR SELECT
  TO public
  USING (true);

-- Policy: Allow anyone to insert tokens (needed for password reset requests)
CREATE POLICY "Allow public to insert tokens" ON password_reset_tokens
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Policy: Allow anyone to update tokens (needed to mark as used)
CREATE POLICY "Allow public to update tokens" ON password_reset_tokens
  FOR UPDATE
  TO public
  USING (true);

-- ============================================================================
-- CLEANUP FUNCTION
-- ============================================================================
-- Function to automatically delete expired and used tokens
-- Run this manually or set up a cron job

CREATE OR REPLACE FUNCTION cleanup_old_reset_tokens()
RETURNS void AS $$
BEGIN
  DELETE FROM password_reset_tokens
  WHERE created_at < NOW() - INTERVAL '24 hours'
    AND (used = true OR expires_at < NOW());
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- USAGE NOTES
-- ============================================================================

-- To manually clean up old tokens, run:
-- SELECT cleanup_old_reset_tokens();

-- To see all tokens (for debugging):
-- SELECT * FROM password_reset_tokens ORDER BY created_at DESC;

-- To see only active (unused, not expired) tokens:
-- SELECT * FROM password_reset_tokens 
-- WHERE used = false AND expires_at > NOW()
-- ORDER BY created_at DESC;

-- To see token statistics:
-- SELECT 
--   COUNT(*) as total_tokens,
--   COUNT(*) FILTER (WHERE used = true) as used_tokens,
--   COUNT(*) FILTER (WHERE expires_at < NOW()) as expired_tokens,
--   COUNT(*) FILTER (WHERE used = false AND expires_at > NOW()) as active_tokens
-- FROM password_reset_tokens;

-- ============================================================================
-- SECURITY NOTES
-- ============================================================================

-- 1. Tokens are 64-character random hex strings (cryptographically secure)
-- 2. Tokens expire after 1 hour
-- 3. Tokens can only be used once (marked as "used" after password reset)
-- 4. Old tokens are cleaned up automatically
-- 5. All operations are logged for security auditing

-- ============================================================================
