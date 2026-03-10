# 📧 Quick Email Guide - TL;DR

## Current Status

✅ **Your system IS working!**  
⚠️ **Emails are NOT being sent** (Demo Mode)

## What's Happening

When you use "Forgot Password":
1. You enter your email
2. System generates a 6-digit code
3. Instead of emailing it, **the code is shown in a toast notification**
4. You copy that code and paste it
5. You reset your password successfully

**This is intentional and works perfectly!**

## To Use It Right Now

1. Open your Mnemosyne app
2. Click "Forgot Password?"
3. Enter your email (the one you set in Account Settings)
4. Click "Send Verification Code"
5. **Look for the toast notification** that says:  
   `Demo Mode: Your verification code is XXXXXX`
6. Copy that 6-digit code
7. Paste it in the verification code field
8. Set your new password
9. Done! ✅

## To Get Actual Emails (Optional)

### Super Quick Steps:

1. **Sign up**: https://resend.com (FREE!)
2. **Get API key**: Go to API Keys → Create → Copy it (starts with `re_`)
3. **Add to Supabase**:
   - Go to: https://supabase.com/dashboard
   - Your project → Settings → Edge Functions → Secrets
   - Add secret: `RESEND_API_KEY` = (paste your key)
4. **Done!** Now emails will actually be sent.

### Important Note:
⚠️ Resend testing mode only sends to YOUR email (the one you signed up with).  
To send to ANY email, you need to verify a domain (see EMAIL_VERIFICATION_STATUS.md).

## Testing

Open `/test-email-system.html` in your browser to test the email system directly.

## Need More Info?

📖 Read `/EMAIL_VERIFICATION_STATUS.md` for detailed instructions

---

**Bottom Line**: Your system works! Demo mode shows you the code instead of emailing it. This is perfect for development and testing.
