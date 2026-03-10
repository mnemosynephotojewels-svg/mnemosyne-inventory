#!/bin/bash

# =============================================================================
# Mnemosyne - Resend Email Service Deployment Script
# =============================================================================
# This script helps you deploy the password reset email functionality
# using Resend (free email service - 100 emails/day)
# =============================================================================

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║   📧 Mnemosyne Email Service Setup                            ║"
echo "║   Powered by Resend (FREE - 100 emails/day)                   ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI is not installed."
    echo ""
    echo "Install it with:"
    echo "  npm install -g supabase"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Step 1: Get Resend API Key
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 1: Resend API Key"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📝 Get your Resend API key:"
echo "   1. Go to: https://resend.com/signup"
echo "   2. Sign up (free account)"
echo "   3. Create an API key: https://resend.com/api-keys"
echo "   4. Copy your key (starts with 're_')"
echo ""
read -p "Enter your Resend API Key: " RESEND_KEY

if [[ ! $RESEND_KEY == re_* ]]; then
    echo ""
    echo "⚠️  Warning: Your API key should start with 're_'"
    read -p "Continue anyway? (y/n): " CONTINUE
    if [[ ! $CONTINUE == "y" ]]; then
        exit 1
    fi
fi

echo ""
echo "✅ API Key received"
echo ""

# Step 2: Set App URL
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 2: Application URL"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Enter your application URL:"
echo "  • Local development: http://localhost:5173"
echo "  • Production: https://yourdomain.com"
echo ""
read -p "App URL [http://localhost:5173]: " APP_URL
APP_URL=${APP_URL:-http://localhost:5173}

echo ""
echo "✅ App URL: $APP_URL"
echo ""

# Step 3: Set Supabase Secrets
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 3: Setting Supabase Secrets"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🔐 Setting RESEND_API_KEY..."
supabase secrets set RESEND_API_KEY="$RESEND_KEY"

echo "🔐 Setting APP_URL..."
supabase secrets set APP_URL="$APP_URL"

echo ""
echo "✅ Secrets configured"
echo ""

# Step 4: Deploy Edge Function
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 4: Deploying Edge Function"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

echo "🚀 Deploying send-password-reset function..."
supabase functions deploy send-password-reset

echo ""
echo "✅ Edge function deployed"
echo ""

# Step 5: Configure Email Sender
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Step 5: Email Sender Configuration"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Choose email sender option:"
echo "  1. Use Resend's free domain (onboarding@resend.dev) - Quick start"
echo "  2. Use my own domain (noreply@yourdomain.com) - Recommended"
echo ""
read -p "Enter choice (1 or 2) [1]: " EMAIL_CHOICE
EMAIL_CHOICE=${EMAIL_CHOICE:-1}

if [[ $EMAIL_CHOICE == "2" ]]; then
    echo ""
    read -p "Enter your domain (e.g., yourdomain.com): " DOMAIN
    echo ""
    echo "📧 Next steps:"
    echo "   1. Go to: https://resend.com/domains"
    echo "   2. Add domain: $DOMAIN"
    echo "   3. Add DNS records (SPF, DKIM, DMARC)"
    echo "   4. Verify domain"
    echo "   5. Update 'from' email in /supabase/functions/send-password-reset/index.ts"
    echo "      Change line 86 to: from: 'Mnemosyne <noreply@$DOMAIN>',"
    echo "   6. Redeploy: supabase functions deploy send-password-reset"
    echo ""
else
    echo ""
    echo "✅ Using Resend's free domain: onboarding@resend.dev"
    echo "   Note: Emails may go to spam. For production, use your own domain."
    echo ""
fi

# Success!
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║   🎉 Email Service Setup Complete!                            ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "✨ What's Next?"
echo ""
echo "1. Test the password reset:"
echo "   • Go to your app's login page"
echo "   • Click 'Forgot Password?'"
echo "   • Enter an email from your users table"
echo "   • Check your inbox (and spam folder)"
echo ""
echo "2. Monitor email delivery:"
echo "   👉 https://resend.com/emails"
echo ""
echo "3. Check usage:"
echo "   👉 https://resend.com/overview"
echo "   📊 Free tier: 100 emails/day (3,000/month)"
echo ""
echo "4. View email template preview:"
echo "   👉 Open: /email-reset-template-preview.html in your browser"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📚 Documentation:"
echo "   • Full guide: /EMAIL_SERVICE_SETUP_RESEND.md"
echo "   • Quick start: /RESEND_QUICK_START.md"
echo ""
echo "🆘 Need help?"
echo "   • Check function logs: supabase functions logs send-password-reset"
echo "   • Resend docs: https://resend.com/docs"
echo ""
echo "Happy emailing! 📧✨"
echo ""
