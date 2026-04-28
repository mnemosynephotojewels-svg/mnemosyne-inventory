# 🔧 Fix Gmail API Error 412 - "Insufficient Authentication Scopes"

## Problem
Your EmailJS Gmail service is returning error 412 because Gmail requires additional OAuth permissions that EmailJS cannot access with the current authentication.

## ✅ SOLUTION OPTIONS

### **Option 1: Switch to Outlook/Yahoo (Recommended - Easiest)**

Gmail has strict OAuth requirements. Use Outlook, Yahoo, or another provider instead:

#### Steps:
1. **Go to EmailJS Dashboard**
   - Visit: https://dashboard.emailjs.com/admin/services

2. **Add New Email Service**
   - Click "Add New Service" button
   - Choose one of these (all work better than Gmail):
     * **Outlook/Hotmail** (Microsoft) - Best choice
     * **Yahoo Mail**
     * **AOL Mail**
     * **Fastmail**
     * **GMX Mail**

3. **Set Up the Service**
   - Follow the setup wizard
   - Connect your email account
   - Complete any verification steps

4. **Copy the Service ID**
   - After setup, copy the new Service ID (looks like: `service_xxxxxxx`)

5. **Update Your Code**
   - Open: `/src/app/services/emailServiceEmailJS.ts`
   - Find line 22: `const EMAILJS_SERVICE_ID = 'service_zrcx11y';`
   - Replace `'service_zrcx11y'` with your new Service ID
   - Save the file

6. **Test It**
   - Try the password reset feature again
   - Verification code should be sent to your email!

---

### **Option 2: Fix Gmail OAuth Permissions**

If you really want to keep using Gmail, you need to re-authenticate with full permissions:

#### Steps:
1. **Go to EmailJS Dashboard**
   - Visit: https://dashboard.emailjs.com/admin/services

2. **Reconnect Gmail**
   - Find your Gmail service in the list
   - Click the "Reconnect" or "Edit" button

3. **Grant All Permissions**
   - When Google's OAuth screen appears:
     * ✅ Check **ALL permission boxes**
     * ✅ Especially: "Send email on your behalf"
     * ✅ Scroll down and check for any additional permissions
   - Click "Allow" or "Continue"

4. **Complete Authentication**
   - Follow any additional verification steps
   - Make sure the service shows as "Connected"

5. **Test It**
   - Try the password reset feature again

**⚠️ Note:** Gmail may still have issues due to security policies. Outlook/Yahoo are more reliable.

---

### **Option 3: Use Resend API (Most Reliable - For Production)**

For a production-ready solution, use Resend API (free tier available):

#### Steps:
1. **Sign up for Resend**
   - Visit: https://resend.com
   - Create a free account (50 emails/day on free tier)

2. **Get API Key**
   - Go to: https://resend.com/api-keys
   - Click "Create API Key"
   - Copy the key (starts with `re_`)

3. **Configure Supabase**
   - Go to your Supabase project dashboard
   - Navigate to: Settings → Edge Functions
   - Add environment variable:
     * Name: `RESEND_API_KEY`
     * Value: Your Resend API key

4. **Update Your Code**
   - The system will automatically detect the Resend configuration
   - Emails will be sent via Supabase Edge Functions instead

5. **Verify Domain (Optional - For Production)**
   - Go to: https://resend.com/domains
   - Add and verify your domain
   - Update the "from" email address in your edge function

---

## 🎯 Quick Test

After making changes, test the password reset:

1. **Open your app**
2. **Click "Forgot Password?"**
3. **Enter your email address**
4. **Click "Send Verification Code"**
5. **Check your email inbox** (and spam folder)
6. **Use the 6-digit code** to reset your password

---

## 📊 Which Option Should I Choose?

| Option | Difficulty | Reliability | Cost | Best For |
|--------|-----------|-------------|------|----------|
| **Outlook/Yahoo** | ⭐ Easy | ⭐⭐⭐⭐ High | Free | Quick fix, personal projects |
| **Fix Gmail** | ⭐⭐ Medium | ⭐⭐ Medium | Free | If you must use Gmail |
| **Resend API** | ⭐⭐⭐ Advanced | ⭐⭐⭐⭐⭐ Highest | Free tier | Production apps, businesses |

**Recommendation:** Start with **Option 1 (Outlook/Yahoo)** - it's the fastest and most reliable solution.

---

## ❓ Still Having Issues?

If you continue to see errors:

1. **Check the browser console** - It will show detailed error messages
2. **Verify your email service is connected** in EmailJS dashboard
3. **Test with a different email address** 
4. **Check spam folder** - Verification emails sometimes go there
5. **Try a different browser** - Clear cache and cookies

---

## 📝 Current Configuration

Your current EmailJS setup:
- **Public Key:** `dbbr3PM3LhbdU7D6-` ✅ Configured
- **Service ID:** `service_zrcx11y` (Currently Gmail - causing error 412)
- **Template ID:** `template_y8ypuqa` ✅ Configured

You only need to update the **Service ID** to fix the issue!

---

## 💡 Pro Tip

Create an Outlook.com or Yahoo.com email account specifically for your app's password reset emails. This keeps them separate from your personal email and is more reliable than Gmail for automated emails.
