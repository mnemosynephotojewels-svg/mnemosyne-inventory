# 🚀 Deploy Email Service - Complete Guide

## Quick Start

**Open this file in your browser**: `/setup-email-now.html`

It has an interactive step-by-step guide with live testing!

---

## Manual Deployment Steps

### Step 1: Sign Up for Resend (2 minutes)

```
1. Go to: https://resend.com/signup
2. Sign up with your email (FREE - no credit card)
3. Verify your email address
4. Log in to dashboard
```

**Cost**: $0 (3,000 emails/month free)

---

### Step 2: Get API Key (1 minute)

```
1. In Resend dashboard, click "API Keys"
2. Click "Create API Key"
3. Name: "Mnemosyne Password Reset"
4. Permission: "Sending access"
5. Click "Create"
6. COPY the entire key (starts with "re_")
```

**⚠️ IMPORTANT**: You won't be able to see the key again!

Example API key format:
```
re_123abc456def789ghi012jkl345mno678pqr
```

---

### Step 3: Add to Supabase (2 minutes)

#### Method A: Via Supabase Dashboard (Recommended)

```
1. Go to: https://supabase.com/dashboard/
2. Select project: anntzpswficnoekklsdr
3. Click "Edge Functions" in sidebar
4. Click on: make-server-a9dec19d
5. Go to "Secrets" tab
6. Click "Add New Secret"
7. Enter:
   Name:  RESEND_API_KEY
   Value: [paste your API key here]
8. Click "Save"
9. Click "Redeploy" button
10. Wait 30 seconds for deployment
```

#### Method B: Via Supabase CLI

If you have Supabase CLI installed:

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref anntzpswficnoekklsdr

# Set the API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here

# Redeploy the function
supabase functions deploy make-server-a9dec19d
```

---

### Step 4: Verify Setup (1 minute)

#### Quick Test - Check if Edge Function is Running

Open this URL in your browser:
```
https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```

**Expected result**: JSON response showing function is alive

#### Full Test - Send Test Email

1. Open `/setup-email-now.html` in your browser
2. Scroll to "Step 4: Test Email Delivery"
3. Enter your email address
4. Click "Test Email Delivery"
5. Check your inbox!

---

### Step 5: Test in Mnemosyne (1 minute)

```
1. Go to Mnemosyne login page
2. Click "Forgot Password?"
3. Enter your email
4. Click "Send Verification Code"
5. Check your email inbox! 📧
```

**Success indicators**:
- ✅ No "Demo Mode" message
- ✅ "Email sent successfully" notification
- ✅ Email arrives within seconds
- ✅ Beautiful branded template

---

## Current Configuration

### Your Supabase Project
```
Project ID: anntzpswficnoekklsdr
Edge Function: make-server-a9dec19d
Region: Auto-detected
```

### Email Configuration
```
Sender: Mnemosyne <onboarding@resend.dev>
Provider: Resend API
Template: Professional branded HTML
```

### Sender Email Options

**Option A: Use Test Domain (Instant)**
```
Sender: onboarding@resend.dev
Limitation: Can only send to your Resend signup email
Setup: Already configured! ✅
```

**Option B: Add Your Own Domain (Recommended)**
```
Sender: noreply@yourdomain.com
Limitation: None - send to anyone
Setup required:
  1. Go to Resend dashboard > Domains
  2. Click "Add Domain"
  3. Enter your domain
  4. Add DNS records (shown in dashboard)
  5. Wait for verification (5-10 minutes)
  6. Update line 397 in /supabase/functions/server/index.tsx:
     from: 'Mnemosyne <noreply@yourdomain.com>',
  7. Redeploy Edge Function
```

---

## Verification Checklist

Use this to verify everything is set up correctly:

### Pre-Deployment
- [ ] Signed up for Resend account
- [ ] Email verified
- [ ] API key created
- [ ] API key starts with `re_`
- [ ] API key copied completely

### Supabase Configuration
- [ ] Logged into Supabase dashboard
- [ ] Found Edge Functions section
- [ ] Located `make-server-a9dec19d` function
- [ ] Added `RESEND_API_KEY` secret
- [ ] No extra spaces in API key
- [ ] Redeployed the function
- [ ] Waited 30+ seconds

### Testing
- [ ] Edge Function health check returns JSON
- [ ] Test email sent via `/setup-email-now.html`
- [ ] Test email received in inbox
- [ ] Password reset tested in Mnemosyne
- [ ] No "Demo Mode" messages
- [ ] Real emails arriving

---

## Troubleshooting

### Problem: "Edge Function not found (404)"

**Cause**: Function not deployed or wrong URL

**Solution**:
```bash
# Deploy the function
supabase login
supabase link --project-ref anntzpswficnoekklsdr
supabase functions deploy make-server-a9dec19d
```

---

### Problem: "Still seeing Demo Mode"

**Cause**: API key not configured or not redeployed

**Solution**:
1. Check API key in Supabase secrets
2. Verify name is exactly: `RESEND_API_KEY`
3. Click "Redeploy" button
4. Wait 30 seconds
5. Clear browser cache
6. Try again

---

### Problem: "Invalid API Key error"

**Cause**: Wrong API key or extra spaces

**Solution**:
1. Go to Resend dashboard
2. Create a NEW API key
3. Copy the ENTIRE key carefully
4. Update in Supabase (remove old one first)
5. Make sure no spaces before/after
6. Redeploy function

---

### Problem: "Email not received"

**Cause**: Multiple possible reasons

**Solution**:
1. ✅ Check spam/junk folder
2. ✅ Using test domain? Must use your Resend signup email
3. ✅ Check Resend dashboard > Logs
4. ✅ Wait a few minutes (can be delayed)
5. ✅ Verify sender email in Resend

---

### Problem: "CORS Error"

**Cause**: Missing CORS headers

**Solution**: Already configured in your Edge Function! ✅

---

### Problem: "Function timeout"

**Cause**: Network issues or Resend API slow

**Solution**: Try again - the code has 8-second timeout built-in

---

## Monitoring & Logs

### View Edge Function Logs

```
1. Go to Supabase dashboard
2. Click "Edge Functions"
3. Click on: make-server-a9dec19d
4. Go to "Logs" tab
5. See real-time function calls
```

### View Resend Logs

```
1. Go to Resend dashboard
2. Click "Logs" in sidebar
3. See all email send attempts
4. Check delivery status
5. View error messages
```

---

## Cost Breakdown

### Resend Free Tier
```
Emails per day:   100
Emails per month: 3,000
Team members:     1
Credit card:      Not required
Cost:             $0 forever
```

### Your Usage Estimate
```
Password resets:  ~5-10 per month
Cost:             $0 (well within free tier)
```

**Perfect for Mnemosyne!** ✅

---

## Security Notes

### API Key Security ✅
- ✅ Stored in Supabase environment variables
- ✅ Never exposed to frontend
- ✅ Secured server-side only
- ✅ Not in version control
- ✅ Can be rotated anytime

### Email Security ✅
- ✅ Verification codes expire in 10 minutes
- ✅ Codes are single-use only
- ✅ Professional email templates
- ✅ No sensitive data in emails
- ✅ Rate limiting built-in

---

## Email Template Customization

Want to customize the email design?

**File**: `/supabase/functions/server/index.tsx`

**Location**: Lines 400-600 (HTML email template)

**What you can customize**:
- Colors and branding
- Logo and icons
- Text content
- Layout and styling
- Footer information

**After editing**:
```bash
# Redeploy to apply changes
supabase functions deploy make-server-a9dec19d
```

---

## Advanced Configuration

### Add Custom Domain

1. **Purchase a domain** (if you don't have one)
2. **Add to Resend**:
   ```
   Resend Dashboard > Domains > Add Domain
   ```
3. **Configure DNS**:
   - Add the DNS records shown in Resend
   - Wait for verification (5-10 minutes)
4. **Update sender email**:
   - Edit `/supabase/functions/server/index.tsx`
   - Line 397: Change sender email
   - Redeploy function

### Monitor Email Deliverability

```
Resend Dashboard > Analytics
- Delivery rate
- Bounce rate  
- Open rate (if tracking enabled)
- Spam reports
```

### Set Up Webhooks (Optional)

```
Resend Dashboard > Webhooks
- Get notified of delivery events
- Track bounces and complaints
- Monitor email performance
```

---

## Quick Reference

| Task | Command/URL |
|------|-------------|
| Resend Dashboard | https://resend.com/dashboard |
| Create API Key | https://resend.com/api-keys |
| Supabase Dashboard | https://supabase.com/dashboard/ |
| Your Project | https://supabase.com/dashboard/project/anntzpswficnoekklsdr |
| Edge Functions | https://supabase.com/dashboard/project/anntzpswficnoekklsdr/functions |
| Test Setup | Open `/setup-email-now.html` |
| Check Health | https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health |

---

## Support

### If You Get Stuck

1. **Read the troubleshooting section above**
2. **Check Resend logs** for API errors
3. **Check Supabase logs** for function errors
4. **Open browser console** (F12) for client errors
5. **Verify API key** is correct

### Common Success Signs

- ✅ No "Demo Mode" in console
- ✅ "Email sent successfully" message
- ✅ Email in inbox within seconds
- ✅ Resend logs show "delivered"
- ✅ No errors in Supabase logs

---

## Summary

```
┌─────────────────────────────────────────┐
│  SETUP CHECKLIST                        │
├─────────────────────────────────────────┤
│  1. ✅ Sign up for Resend (FREE)       │
│  2. ✅ Get API key                      │
│  3. ✅ Add to Supabase secrets          │
│  4. ✅ Redeploy Edge Function           │
│  5. ✅ Test email delivery              │
│  6. ✅ Try password reset               │
│  7. ✅ DONE!                            │
└─────────────────────────────────────────┘
```

**Time needed**: 5-10 minutes  
**Cost**: $0  
**Difficulty**: Easy

**Ready?** Open `/setup-email-now.html` and let's go! 🚀
