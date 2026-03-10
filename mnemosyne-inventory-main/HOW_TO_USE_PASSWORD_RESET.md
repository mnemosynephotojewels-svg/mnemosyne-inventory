# 🔐 How to Use Password Reset - Step by Step

## Important: Which Email to Use?

The password reset system checks against **the email you set in Account Settings**.

### Step 1: Check Your Current Email

1. Log in to Mnemosyne (username: `mnemosyne`, password: `mnemosyne000`)
2. Click the **Account Settings** button in the header
3. Look at the **Email** field
4. **This is the email you must use** for password reset!

If no email is set or it shows a default:
- The system will use `mnemosyne@gmail.com` as the default
- You can change it in Account Settings to your real email

---

## Step 2: Request Password Reset

1. On the login page, click **"Forgot Password?"**
2. Enter the **exact same email** from Account Settings
3. Click **"Send Verification Code"**

---

## Step 3: Find Your Verification Code

### ✅ What You Should See:

**A BIG YELLOW ALERT BOX** will appear on screen with your 6-digit code!

It looks like this:
```
┌─────────────────────────────────────┐
│   DEMO MODE - EMAIL NOT SENT        │
│                                     │
│   YOUR VERIFICATION CODE:           │
│        123456                       │
│                                     │
│   📋 Copy Code to Clipboard         │
└─────────────────────────────────────┘
```

### Also Check:

1. **Browser Console** (Press F12):
   - Look for a section with emojis and your code
   - It will say: `🔐 YOUR CODE: 123456`

2. **Toast Notification**:
   - Top-right corner of screen
   - Blue notification saying: "Demo Mode: Your verification code is 123456"

---

## Step 4: Enter the Code

1. Copy the 6-digit code from the yellow box (or click "Copy to Clipboard")
2. Paste it in the **Verification Code** field
3. Enter your **new password** (at least 6 characters)
4. Confirm your **new password**
5. Click **"Reset Password"**
6. Done! ✅

---

## Troubleshooting

### "I don't see the yellow alert box!"

**Check these things:**

1. **Did you use the correct email?**
   - Go to Account Settings and check what email is saved
   - Use that EXACT email (case doesn't matter)

2. **Open the browser console (F12)**:
   - Click "Console" tab
   - Look for messages with 🔐 emoji
   - Your code will be there!

3. **Check the email match**:
   - Console will show: `Email entered: xxx@example.com`
   - Console will show: `Stored email: yyy@example.com`
   - They MUST match!

### "Email doesn't match"

If the console shows:
```
📧 Email entered: john@example.com
📧 Stored email: mnemosyne@gmail.com
✅ Match: false
```

Then you need to either:
- **Option A**: Use `mnemosyne@gmail.com` for password reset
- **Option B**: Update your email in Account Settings first, then use that email

### "Still can't see the code!"

1. Make sure you clicked "Send Verification Code"
2. Wait for the form to change to the code entry screen
3. Look at the TOP of the form - the yellow box should be there
4. If not visible, press F12 and check Console tab
5. The code will definitely be in the console!

---

## Why Demo Mode?

Your system is working perfectly! It's in "Demo Mode" because:
- The Resend API email service isn't configured
- This is normal and expected for development
- The code is shown on screen instead of being emailed
- You can still reset your password successfully!

**To enable real emails** (optional):
- See `/EMAIL_VERIFICATION_STATUS.md`
- Sign up at resend.com (free)
- Configure API key in Supabase

---

## Quick Reference

| Step | Action | Look For |
|------|--------|----------|
| 1 | Log in → Account Settings | Check your email address |
| 2 | Forgot Password → Enter same email | Wait for code screen |
| 3 | Look for yellow alert box | Copy 6-digit code |
| 4 | Paste code → Set new password | Success! ✅ |

**If stuck**: Open Console (F12) and your code will be there!

---

## Example Console Output

When it works, you'll see:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ VERIFICATION CODE GENERATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔐 YOUR CODE: 123456
📧 For email: mnemosyne@gmail.com
⏰ Expires in: 10 minutes
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 TIP: Check the screen for a yellow alert box with your code!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

**Your code is the 6 digits after "YOUR CODE:"**
