#!/bin/bash

# =============================================================================
# DEPLOY VERIFICATION CODE EMAIL FUNCTION
# =============================================================================
# This script deploys the updated server function with verification code support
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🚀 DEPLOYING VERIFICATION CODE EMAIL FUNCTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ ERROR: Supabase CLI not found"
    echo ""
    echo "📦 Install Supabase CLI:"
    echo ""
    echo "  macOS/Linux:"
    echo "    brew install supabase/tap/supabase"
    echo ""
    echo "  Windows:"
    echo "    scoop install supabase"
    echo ""
    echo "  Or visit: https://supabase.com/docs/guides/cli"
    echo ""
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if logged in
echo "🔐 Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "⚠️  Not logged in to Supabase"
    echo ""
    echo "📝 Logging you in now..."
    supabase login
    
    if [ $? -ne 0 ]; then
        echo "❌ Login failed"
        exit 1
    fi
fi

echo "✅ Logged in to Supabase"
echo ""

# Link to project
PROJECT_REF="anntzpswficnoekklsdr"
echo "🔗 Linking to project: $PROJECT_REF"
echo ""

supabase link --project-ref $PROJECT_REF 2>&1 | grep -v "Already linked" || true

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📤 DEPLOYING SERVER FUNCTION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "Function: make-server-a9dec19d"
echo "Path: /supabase/functions/server/"
echo ""

# Deploy the function
cd supabase/functions
supabase functions deploy make-server-a9dec19d \
  --project-ref $PROJECT_REF \
  --no-verify-jwt

DEPLOY_STATUS=$?

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ $DEPLOY_STATUS -eq 0 ]; then
    echo "✅ DEPLOYMENT SUCCESSFUL!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Your verification code email function is now live!"
    echo ""
    echo "📍 Endpoints available:"
    echo "   • Health: https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/health"
    echo "   • Send Code: https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔧 NEXT STEPS"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "1️⃣  CONFIGURE RESEND API KEY (Required for email):"
    echo ""
    echo "   Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
    echo ""
    echo "   Add secret:"
    echo "     Name:  RESEND_API_KEY"
    echo "     Value: <your-resend-api-key>"
    echo ""
    echo "   Get API key from: https://resend.com/api-keys"
    echo ""
    echo "2️⃣  TEST THE FUNCTION:"
    echo ""
    echo "   curl https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/health"
    echo ""
    echo "3️⃣  TRY PASSWORD RESET:"
    echo ""
    echo "   • Open your app"
    echo "   • Click \"Forgot Password?\""
    echo "   • Enter your email"
    echo "   • Check console for verification code"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "ℹ️  DEMO MODE"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Without RESEND_API_KEY configured:"
    echo "  ✅ Password reset still works"
    echo "  ✅ Verification code shown in UI"
    echo "  ⚠️  No actual emails sent"
    echo ""
    echo "This ensures your app works during development!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
else
    echo "❌ DEPLOYMENT FAILED"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🔍 Troubleshooting:"
    echo ""
    echo "1. Make sure you're logged in:"
    echo "   supabase login"
    echo ""
    echo "2. Check project link:"
    echo "   supabase link --project-ref $PROJECT_REF"
    echo ""
    echo "3. Verify function exists:"
    echo "   ls -la supabase/functions/server/"
    echo ""
    echo "4. Try manual deploy:"
    echo "   cd supabase/functions"
    echo "   supabase functions deploy make-server-a9dec19d"
    echo ""
    exit 1
fi
