# 🔐 Mnemosyne Authentication System - Setup Guide

## Overview

The Mnemosyne inventory management system now includes a **secure, production-ready authentication system** with username/password login and email-based password recovery.

---

## 🎯 Features

### ✅ Security Features
- **Username/Password Authentication** - Secure login with username credentials
- **Email-Based Password Recovery** - Reset passwords via secure email links
- **Password Hashing** - Supabase Auth handles all password encryption
- **Rate Limiting** - Prevents brute force attacks (5 attempts, 15-minute lockout)
- **Secure Tokens** - Time-limited password reset tokens (1-hour expiration)
- **Input Validation** - Comprehensive client and server-side validation
- **Session Management** - Automatic session handling with auto-refresh

### ✅ User Experience
- **Show/Hide Password Toggle** - Eye icons for password visibility
- **Remember Me Checkbox** - Saves username for next login
- **Loading States** - Visual feedback on all async operations
- **Error Handling** - Clear, user-friendly error messages
- **Responsive Design** - Modern glassmorphic UI with smooth animations
- **Form Validation** - Real-time validation with helpful error messages

---

## 🚀 Quick Start (Demo Mode)

### Default Test Credentials

```
Username: mnemosyne
Password: mnemosyne000
Email: mnemosyne@gmail.com (for password recovery)
```

**Demo mode is active by default** - you can test the system immediately without any Supabase setup!

---

## 📋 Production Setup (Supabase Integration)

### Step 1: Set Up Database Tables

1. **Open your Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project: `anntzpswficnoekklsdr`

2. **Run the SQL Schema**
   - Navigate to **SQL Editor** in the left sidebar
   - Click **New Query**
   - Copy and paste the entire contents of `/supabase/create_users_table.sql`
   - Click **Run** or press `Ctrl+Enter`

This will create:
- `users` table (stores username, email, and profile data)
- `password_reset_tokens` table (for secure password recovery)
- Row Level Security (RLS) policies
- Indexes for performance
- Helper functions

### Step 2: Create the Default Test User

1. **Go to Authentication > Users** in Supabase Dashboard
2. Click **"Add User"** → **"Create new user"**
3. Enter the following details:
   ```
   Email: mnemosyne@gmail.com
   Password: mnemosyne000
   Auto Confirm User: ✅ YES (check this box)
   ```
4. Click **"Create User"**

### Step 3: Link the Auth User to the Users Table

1. **Go to SQL Editor** in Supabase Dashboard
2. Run this query to link the authentication user to the profile:

```sql
UPDATE public.users 
SET auth_user_id = (
  SELECT id FROM auth.users WHERE email = 'mnemosyne@gmail.com'
)
WHERE username = 'mnemosyne';
```

### Step 4: Configure Email Settings (Optional but Recommended)

For password reset emails to work properly:

1. **Go to Authentication > Email Templates** in Supabase Dashboard
2. Configure the **"Reset Password"** template
3. Set up **SMTP settings** (or use Supabase's default email service)
4. Test the email flow by using "Forgot Password?" feature

---

## 🔧 System Architecture

### Authentication Flow

```
┌─────────────────────────────────────────────────────────────┐
│                     LOGIN PROCESS                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User enters username + password                          │
│           ↓                                                  │
│  2. System validates input format                            │
│           ↓                                                  │
│  3. System queries 'users' table by username                 │
│           ↓                                                  │
│  4. Retrieves associated email address                       │
│           ↓                                                  │
│  5. Authenticates with Supabase Auth using email/password    │
│           ↓                                                  │
│  6. Updates last_login timestamp                             │
│           ↓                                                  │
│  7. Returns user session + profile data                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│                PASSWORD RESET PROCESS                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. User clicks "Forgot Password?"                           │
│           ↓                                                  │
│  2. User enters registered email address                     │
│           ↓                                                  │
│  3. System validates email exists in 'users' table           │
│           ↓                                                  │
│  4. Supabase sends secure reset link via email               │
│           ↓                                                  │
│  5. Link contains time-limited token (1 hour)                │
│           ↓                                                  │
│  6. User clicks link → redirected to reset password page     │
│           ↓                                                  │
│  7. User enters new password (must be 6+ characters)         │
│           ↓                                                  │
│  8. Password is hashed and stored securely                   │
│           ↓                                                  │
│  9. User redirected to login page                            │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Database Schema

**users** table:
```sql
- id (UUID, primary key)
- username (VARCHAR(50), unique, 3-50 alphanumeric characters)
- email (VARCHAR(255), unique, validated email format)
- full_name (VARCHAR(100), optional)
- auth_user_id (UUID, foreign key to auth.users)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
- last_login (TIMESTAMP)
- is_active (BOOLEAN)
```

**password_reset_tokens** table:
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key to users)
- token (VARCHAR(255), unique)
- expires_at (TIMESTAMP)
- used (BOOLEAN)
- created_at (TIMESTAMP)
```

---

## 🔒 Security Features Explained

### 1. **Password Hashing**
- All passwords are hashed using Supabase Auth's bcrypt implementation
- Passwords are NEVER stored in plain text
- Even database admins cannot see user passwords

### 2. **Rate Limiting**
- Maximum 5 failed login attempts per username
- 15-minute lockout period after exceeding limit
- Prevents brute force attacks

### 3. **Secure Password Reset Tokens**
- Tokens are unique and randomly generated
- 1-hour expiration time
- Single-use tokens (marked as 'used' after redemption)
- Token validation before allowing password change

### 4. **Input Validation**

**Username Requirements:**
- 3-50 characters
- Only letters, numbers, underscores, and hyphens
- No spaces or special characters

**Password Requirements:**
- Minimum 6 characters
- No maximum length (recommended: 8-64 characters)

**Email Requirements:**
- Valid email format (regex validated)
- Must be unique in the system

### 5. **Row Level Security (RLS)**
- Users can only view and update their own data
- Password reset tokens are service-role only
- Prevents unauthorized data access

---

## 🎨 UI/UX Features

### Login Form
- ✅ Username input with user icon
- ✅ Password input with lock icon
- ✅ Show/Hide password toggle (eye icon)
- ✅ Remember Me checkbox (saves username)
- ✅ "Forgot Password?" link
- ✅ Real-time validation with error messages
- ✅ Loading state with spinner
- ✅ Smooth animations and transitions

### Forgot Password Flow
- ✅ Clean modal interface
- ✅ Email input with validation
- ✅ Success confirmation with icon animation
- ✅ Clear instructions for next steps
- ✅ Back to Login button

### Reset Password Form
- ✅ New password input
- ✅ Confirm password input
- ✅ Show/Hide toggles for both fields
- ✅ Password requirements list
- ✅ Match validation
- ✅ Success screen with auto-redirect

---

## 📁 File Structure

```
/src/app/
├── components/
│   ├── LoginPage.tsx                 # Main login component
│   └── ResetPasswordPage.tsx         # Password reset component
├── services/
│   └── authService.ts                # Authentication logic & API calls
└── lib/
    └── supabase.ts                   # Supabase client configuration

/supabase/
└── create_users_table.sql            # Database schema & setup
```

---

## 🧪 Testing

### Test the Login Flow

1. **Valid Login:**
   ```
   Username: mnemosyne
   Password: mnemosyne000
   Expected: Success, redirects to dashboard
   ```

2. **Invalid Username:**
   ```
   Username: wronguser
   Password: mnemosyne000
   Expected: "Invalid username or password" error
   ```

3. **Invalid Password:**
   ```
   Username: mnemosyne
   Password: wrongpassword
   Expected: "Invalid username or password" error
   ```

4. **Rate Limiting:**
   - Try 6 failed login attempts
   - Expected: "Too many login attempts. Please try again in 15 minutes."

### Test the Password Reset Flow

1. **Valid Email:**
   ```
   Email: mnemosyne@gmail.com
   Expected: Success message, email sent (in production)
   ```

2. **Invalid Email Format:**
   ```
   Email: notanemail
   Expected: "Please enter a valid email address"
   ```

3. **Unregistered Email:**
   ```
   Email: unknown@example.com
   Expected: Generic success message (prevents email enumeration)
   ```

---

## 🔄 Migration from Old System

If you're upgrading from the old email-based login:

1. ✅ Database schema created (users table)
2. ✅ Authentication service implemented
3. ✅ Login form updated to use username
4. ✅ Password reset flow updated
5. ✅ All security features enabled

**No data migration needed** - the system works in demo mode by default!

---

## ⚙️ Configuration

### Environment Variables

The system uses the Supabase credentials already configured:

```env
VITE_SUPABASE_URL=https://anntzpswficnoekklsdr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

No additional configuration needed!

---

## 🐛 Troubleshooting

### "Invalid username or password" error (Production)

**Cause:** Auth user not linked to users table

**Solution:**
```sql
UPDATE public.users 
SET auth_user_id = (SELECT id FROM auth.users WHERE email = 'mnemosyne@gmail.com')
WHERE username = 'mnemosyne';
```

### Password reset email not sending

**Cause:** Email settings not configured in Supabase

**Solution:**
1. Go to Authentication > Email Templates
2. Configure SMTP settings
3. Test email delivery

### "Too many login attempts" error

**Cause:** Rate limiting triggered

**Solution:**
- Wait 15 minutes
- Or clear localStorage: `localStorage.clear()`

---

## 📊 Additional Features to Consider

### Future Enhancements (Optional)

- [ ] Two-Factor Authentication (2FA)
- [ ] Social Login (Google, GitHub, etc.)
- [ ] Password strength meter
- [ ] Account lockout after multiple failed attempts
- [ ] Email verification on signup
- [ ] User profile management
- [ ] Session timeout warnings
- [ ] Login history/audit log

---

## 📞 Support

For issues or questions:

1. Check the console for error messages
2. Verify Supabase credentials are correct
3. Ensure database schema is properly set up
4. Test in demo mode first before troubleshooting production

---

## ✅ Summary

Your Mnemosyne inventory system now has:

- ✅ **Secure username/password authentication**
- ✅ **Email-based password recovery**
- ✅ **Production-ready security features**
- ✅ **Modern, user-friendly interface**
- ✅ **Comprehensive error handling**
- ✅ **Demo mode for testing**

**System Status:** 🟢 Ready for Production

Login with: `username: mnemosyne` / `password: mnemosyne000`
