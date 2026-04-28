# ⚡ EmailJS Quick Start - 5 Minutes

## 🎯 Setup in 3 Steps

### 1️⃣ Create Account (2 min)
1. Go to https://www.emailjs.com/
2. Sign up FREE (no credit card needed)
3. Verify your email

### 2️⃣ Configure EmailJS (2 min)
1. **Add Email Service**:
   - Dashboard → Email Services → Add New Service
   - Choose **Gmail** (or your provider)
   - Connect your account
   - **Copy Service ID** (e.g., `service_abc123`)

2. **Create Email Template**:
   - Dashboard → Email Templates → Create New Template
   - **Name**: "Password Reset - Mnemosyne"
   - **Subject**: `Reset Your Mnemosyne Password`
   - **Body**: Copy from `/EMAILJS_SETUP_GUIDE.md` Step 3
   - Save and **Copy Template ID** (e.g., `template_xyz789`)

3. **Get Public Key**:
   - Click your username → Account → General
   - **Copy Public Key** (e.g., `abc123XYZ456`)

### 3️⃣ Update Your Code (1 min)

Edit `/src/app/services/emailService.ts`:

```typescript
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID',      // From step 2.1
  templateId: 'YOUR_TEMPLATE_ID',    // From step 2.2
  publicKey: 'YOUR_PUBLIC_KEY',      // From step 2.3
};
```

**Example:**
```typescript
const EMAILJS_CONFIG = {
  serviceId: 'service_mnemosyne',
  templateId: 'template_password_reset',
  publicKey: 'K8vQJ9xL2mN4pR6t',
};
```

---

## ✅ Test It!

1. Run your app
2. Click **"Forgot Password?"**
3. Enter your email
4. Check your inbox! 📧

---

## 📋 Email Template (Copy This)

**Subject:**
```
Reset Your Mnemosyne Password
```

**Body (HTML):**
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #0a2647 0%, #144272 100%); 
              color: #d4af37; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
    .button { display: inline-block; padding: 15px 30px; background: #d4af37; 
              color: #0a2647; text-decoration: none; border-radius: 5px; 
              font-weight: bold; margin: 20px 0; }
    .footer { background: #f1f1f1; padding: 20px; text-align: center; 
              font-size: 12px; color: #666; border-radius: 0 0 10px 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; font-size: 28px;">🔐 Password Reset Request</h1>
      <p style="margin: 10px 0 0 0; color: #d4af37; opacity: 0.9;">Mnemosyne Inventory Management</p>
    </div>
    
    <div class="content">
      <p>Hi <strong>{{to_name}}</strong>,</p>
      
      <p>We received a request to reset your password for your Mnemosyne account.</p>
      
      <p>Click the button below to reset your password:</p>
      
      <div style="text-align: center;">
        <a href="{{reset_link}}" class="button">Reset My Password</a>
      </div>
      
      <p style="color: #666; font-size: 14px;">
        <strong>Or copy and paste this link into your browser:</strong><br>
        <a href="{{reset_link}}" style="color: #0a2647;">{{reset_link}}</a>
      </p>
      
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      
      <p style="color: #888; font-size: 13px;">
        ⚠️ <strong>Security Notice:</strong><br>
        • This link expires in <strong>1 hour</strong><br>
        • If you didn't request this, please ignore this email<br>
        • Your password will not be changed unless you click the link above
      </p>
    </div>
    
    <div class="footer">
      <p>
        <strong>{{company_name}}</strong><br>
        Need help? Contact us at {{support_email}}
      </p>
      <p style="margin-top: 10px;">
        © {{current_year}} Mnemosyne. All rights reserved.
      </p>
    </div>
  </div>
</body>
</html>
```

---

## 🔍 What You Need

From EmailJS Dashboard:

| Item | Where to Find | Example |
|------|--------------|---------|
| **Service ID** | Email Services → Your Service | `service_abc123` |
| **Template ID** | Email Templates → Your Template | `template_xyz789` |
| **Public Key** | Account → General | `K8vQJ9xL2mN4pR6t` |

---

## 🐛 Quick Troubleshooting

**Email not received?**
1. Check spam/junk folder
2. Verify all IDs are correct
3. Check EmailJS Dashboard → Logs

**Gmail not working?**
1. Enable "Less secure app access"
2. Or use App-Specific Password (if 2FA enabled)

---

## 💰 Free Tier

- ✅ **200 emails/month** - FREE forever
- ✅ No credit card required
- ✅ Perfect for password resets

---

## 📚 Full Guide

For detailed instructions, see `/EMAILJS_SETUP_GUIDE.md`

---

**Done! 🎉** Your password reset emails are now working for FREE!
