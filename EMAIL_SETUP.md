# Email Service Setup Guide

## Quick Setup (5 minutes)

The Mnemosyne app uses **Web3Forms** for sending password reset emails. It's 100% FREE with no credit card required!

### Step 1: Get Your Free Access Key

1. Go to **https://web3forms.com**
2. Enter your email address
3. Click "Create Access Key"
4. Check your email and copy your access key (looks like: `abc123-def456-ghi789`)

### Step 2: Configure the App

1. Open `/src/app/services/emailService.ts`
2. Find this line:
   ```typescript
   const WEB3FORMS_ACCESS_KEY = 'YOUR_WEB3FORMS_ACCESS_KEY';
   ```
3. Replace `'YOUR_WEB3FORMS_ACCESS_KEY'` with your actual key:
   ```typescript
   const WEB3FORMS_ACCESS_KEY = 'abc123-def456-ghi789';
   ```
4. Save the file

### That's it! 🎉

Your password reset emails will now work. Web3Forms gives you:
- ✅ 250 free emails per month
- ✅ No credit card required
- ✅ Beautiful HTML email templates
- ✅ Instant delivery

## Testing

1. Log into your account
2. Go to Account Settings
3. Click "Send Reset Link"
4. Check your email inbox for the password reset email

## Demo Mode

If you haven't configured Web3Forms yet, the app runs in demo mode:
- The reset link will be shown in the browser console
- You can still test all other features
- No emails will actually be sent

## Troubleshooting

**Email not received?**
- Check your spam folder
- Verify your Web3Forms access key is correct
- Make sure you entered a valid email address
- Check the browser console for error messages

**Need more emails?**
Web3Forms free tier gives you 250 emails/month, which is more than enough for password resets. If you need more, check their pricing at https://web3forms.com

## Support

For Web3Forms support: https://web3forms.com/help
For app issues: Check the browser console for error messages
