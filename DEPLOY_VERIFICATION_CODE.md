# 🚀 Deploy Verification Code Email Function

## ⚠️ CRITICAL: Server Function Not Deployed Yet

Your verification code system is **fully coded and ready**, but the server function needs to be deployed to Supabase before it will work.

---

## 🎯 Quick Deploy (2 Minutes)

### Option 1: Using Supabase CLI (Recommended)

```bash
# 1. Make sure you're logged in to Supabase CLI
supabase login

# 2. Link to your project (if not already linked)
supabase link --project-ref anntzpswficnoekklsdr

# 3. Deploy the server function
supabase functions deploy make-server-a9dec19d
```

### Option 2: Manual Deploy via Supabase Dashboard

1. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr
2. Click **"Edge Functions"** in the left sidebar
3. Find or create function named: **`make-server-a9dec19d`**
4. Copy the entire contents of `/supabase/functions/server/index.tsx`
5. Paste into the function editor
6. Click **"Deploy"**

---

## 🔑 Configure Resend API Key (Required for Email)

After deploying, you need to add your Resend API key:

1. Go to: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
2. Scroll to **"Secrets"** section
3. Click **"Add a new secret"**
4. **Name:** `RESEND_API_KEY`
5. **Value:** Your Resend API key (get it from https://resend.com/api-keys)
6. Click **"Save"**

---

## ✅ Verify Deployment

### Test the Health Endpoint

```bash
curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-..."
}
```

### Test the Verification Code Endpoint

```bash
curl -X POST \
  https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{
    "recipientEmail": "test@example.com",
    "recipientName": "Test User",
    "verificationCode": "123456"
  }'
```

---

## 🎯 What Will Work After Deployment

### ✅ With Resend API Key Configured:
- ✅ Real emails sent to users
- ✅ Professional branded email template
- ✅ 6-digit verification codes
- ✅ 10-minute expiration

### ⚠️ Without Resend API Key (Demo Mode):
- ✅ Password reset still works
- ✅ Verification code shown in UI
- ✅ Code stored in localStorage
- ⚠️ No actual emails sent (code displayed to user instead)

---

## 🔧 Troubleshooting

### "Function not found" Error

**Problem:** Server function not deployed yet  
**Solution:** Run deployment command above

### "Email not received" Issue

**Check these in order:**

1. **Server deployed?**
   ```bash
   curl https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
   ```

2. **API key configured?**
   - Check: https://supabase.com/dashboard/project/anntzpswficnoekklsdr/settings/functions
   - Look for `RESEND_API_KEY` in secrets

3. **Check browser console:**
   - Open DevTools → Console tab
   - Look for logs starting with `📧 EMAIL SERVICE:`
   - Check for any error messages

4. **Demo mode active?**
   - If console shows `⚠️ Running in demo mode`
   - The verification code will be displayed in the UI
   - This is normal if Resend isn't configured yet

---

## 📝 Files Involved

- **Client-side:** `/src/app/services/emailService.ts`
- **Server-side:** `/supabase/functions/server/index.tsx`
- **Auth logic:** `/src/app/services/authService.ts`
- **UI Component:** `/src/app/components/LoginPage.tsx`

---

## 🎨 New Password Reset Flow

1. User enters email → Clicks "Send Verification Code"
2. Server generates 6-digit code → Sends via Resend
3. User enters code + new password
4. Password is reset immediately
5. Success screen → Back to login

---

## 🚀 Next Steps

1. **Deploy the function** (use commands above)
2. **Configure Resend API key** (optional but recommended)
3. **Test the flow** in your app
4. **Check browser console** for detailed logs

---

## 💡 Demo Mode Info

**Demo mode automatically activates when:**
- Server function not deployed yet
- Resend API key not configured
- Resend API returns error (domain not verified, etc.)

**In demo mode:**
- Verification code is displayed in the UI
- Toast shows: "Demo Mode: Your verification code is 123456"
- Everything else works normally
- No actual emails are sent

This ensures the password reset flow always works, even during development!

---

## ✨ Benefits of New System

✅ **User stays in app** - no email clicking required  
✅ **Faster process** - 3 simple steps  
✅ **More secure** - codes expire in 10 minutes  
✅ **Better UX** - familiar pattern like 2FA  
✅ **Demo friendly** - works without email service  
✅ **Professional emails** - beautiful branded template  

---

Need help? Check the browser console for detailed logs starting with `📧 EMAIL SERVICE:`
