# 🚨 How to Enable REAL Email Delivery

## Current Status: DEMO MODE ⚠️

**Your system is working, but NO emails are being sent!**

Right now, the system shows verification codes on screen because the **Resend API** is not configured. To send REAL emails to your actual email address, you need to complete this setup.

---

## 📋 What You Need to Do

### ✅ You Already Have:
- Supabase connected (`anntzpswficnoekklsdr`)
- Email service code working
- Password reset system functional

### ❌ What's Missing:
- **Resend API Key** not configured in Supabase
- **Edge Function** not deployed

---

## 🎯 Step-by-Step Setup (15 minutes)

### Step 1: Get Resend API Key (Free) 🆓

1. **Go to**: https://resend.com/
2. **Click**: "Get Started" or "Sign Up"
3. **Sign up** with your email (free plan = 100 emails/day, 3,000/month)
4. **Verify** your email
5. **Go to**: API Keys section
6. **Click**: "Create API Key"
7. **Name it**: "Mnemosyne Password Reset"
8. **Copy** the API key (looks like: `re_123abc456def...`)
9. **Save it** somewhere safe!

---

### Step 2: Configure in Supabase 🔧

1. **Go to**: https://supabase.com/dashboard/
2. **Select** your project: `anntzpswficnoekklsdr`
3. **Click**: "Edge Functions" in left sidebar
4. **Look for**: Your deployed function (should be: `make-server-a9dec19d`)

#### If Function EXISTS:
5. **Click**: the function name
6. **Click**: "Secrets" or "Environment Variables"
7. **Add New Secret**:
   - Name: `RESEND_API_KEY`
   - Value: `re_your_api_key_here` (paste from Step 1)
8. **Save**
9. **Redeploy** the function

#### If Function DOES NOT EXIST:
**You need to deploy the Edge Function first.** See "Deploying Edge Function" section below.

---

### Step 3: Configure Sender Email in Resend 📧

For Resend to work, you need to verify a sender email:

#### Option A: Use Resend's Test Domain (Instant)
1. **In Resend dashboard**: Go to "Domains"
2. **You'll see**: `onboarding@resend.dev` (already verified!)
3. **Use this** for testing
4. **Limitation**: Can only send to YOUR email (the one you signed up with)

#### Option B: Add Your Own Domain (Recommended)
1. **In Resend dashboard**: Click "Add Domain"
2. **Enter** your domain (e.g., `yourdomain.com`)
3. **Add DNS records** as shown (requires domain access)
4. **Wait** for verification (5-10 minutes)
5. **Now you can** send from `noreply@yourdomain.com`

---

### Step 4: Update Sender Email in Code 📝

The email will be sent from a specific address. Let me check what it's currently set to:

**You need to update the sender email in your Edge Function code to match Resend.**

Default options:
- `onboarding@resend.dev` (for testing)
- `noreply@yourdomain.com` (if you added a domain)

---

## 🚀 Deploying the Edge Function

If the Edge Function is not deployed yet, you need to:

### Prerequisites:
- Supabase CLI installed
- Connected to your project

### Commands:
```bash
# Install Supabase CLI (if not installed)
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref anntzpswficnoekklsdr

# Deploy the function
supabase functions deploy make-server-a9dec19d

# Set the API key
supabase secrets set RESEND_API_KEY=re_your_api_key_here
```

---

## 🧪 Test Real Email Delivery

After configuration:

1. **Open**: `/test-email-system.html` in your browser
2. **Enter**:
   - Recipient: Your actual email
   - Sender: The email you configured in Resend
   - Code: 123456 (test)
3. **Click**: "Send Test Email"
4. **Check**: Your email inbox!

If it works: ✅ Real emails enabled!  
If it fails: See troubleshooting below.

---

## 🔍 How to Check Current Status

### Check 1: Is Edge Function Deployed?
```
Open: https://anntzpswficnoekklsdr.supabase.co/functions/v1/make-server-a9dec19d/health
```
- If you see JSON: ✅ Function deployed
- If 404 error: ❌ Function not deployed

### Check 2: Is API Key Configured?
Look at browser console when requesting password reset:
- "Demo mode - RESEND_API_KEY not configured" = ❌ API key missing
- "Email sent successfully" = ✅ API key working!

### Check 3: Can Resend Send?
Log into Resend dashboard:
- Go to "Logs" section
- You should see email send attempts
- Check for errors

---

## 🆘 Troubleshooting

### Problem: "Server function not deployed"
**Solution**: Deploy the Edge Function (see "Deploying Edge Function" above)

### Problem: "Demo mode - RESEND_API_KEY not configured"
**Solution**: Add `RESEND_API_KEY` secret in Supabase Edge Function settings

### Problem: "Email failed to send"
**Check**:
1. Is API key correct? (starts with `re_`)
2. Is sender email verified in Resend?
3. Are you using test domain? (can only send to your own email)
4. Check Resend dashboard logs for errors

### Problem: "Email sent but not received"
**Check**:
1. Spam folder
2. Email address correct?
3. Resend logs show success?
4. Wait a few minutes (can be delayed)

---

## 💰 Cost

### Resend Free Tier:
- ✅ 100 emails per day
- ✅ 3,000 emails per month
- ✅ No credit card required
- ✅ Perfect for personal/testing use

**For Mnemosyne password resets**: Way more than enough! ✅

---

## 📝 Summary Checklist

- [ ] Sign up at Resend.com
- [ ] Get API key from Resend
- [ ] Add `RESEND_API_KEY` secret in Supabase
- [ ] Verify sender email in Resend
- [ ] Deploy Edge Function (if not already)
- [ ] Test with `/test-email-system.html`
- [ ] Try password reset with real email!

---

## 🎉 After Setup

Once configured, the password reset will:
1. ✅ Send REAL emails to any email address
2. ✅ No more "Demo Mode" messages
3. ✅ Verification codes sent via email
4. ✅ Professional email templates

**Demo mode will automatically turn off once API key is detected!**

---

## 🤔 Still Want to Stay in Demo Mode?

**Demo mode is perfectly fine if**:
- You're the only user
- You don't mind codes on screen
- You want to avoid email service setup
- You're just testing the system

**The system works 100% in demo mode!** Real emails are optional.

---

## 📞 Need Help?

If you get stuck:
1. Check Supabase Edge Function logs
2. Check Resend dashboard logs
3. Check browser console messages
4. Open an issue with error messages

---

**TL;DR**: Sign up at Resend.com → Get API key → Add to Supabase secrets → Real emails enabled! 🎉
