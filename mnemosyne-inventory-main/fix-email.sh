#!/bin/bash

# =============================================================================
# ONE-COMMAND EMAIL FIX
# =============================================================================
# This script will diagnose and help you fix the email issue
# =============================================================================

clear

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║           🔧 MNEMOSYNE EMAIL DIAGNOSTIC & FIX                  ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "  This will check why emails aren't sending and fix it!"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PROJECT_REF="anntzpswficnoekklsdr"
ALL_PASSED=true

# =============================================================================
# STEP 1: Check if server function is deployed
# =============================================================================

echo "📋 STEP 1 OF 3: Checking Server Function..."
echo ""

HEALTH_URL="https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/health"
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$HEALTH_URL")

if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ Server function is deployed!"
    echo ""
else
    echo "   ❌ SERVER FUNCTION NOT DEPLOYED!"
    echo ""
    echo "   🔧 FIX: Deploy the server function"
    echo ""
    echo "   Run this command:"
    echo ""
    echo "      bash deploy-verification-code.sh"
    echo ""
    echo "   Then run this diagnostic again."
    echo ""
    ALL_PASSED=false
fi

# =============================================================================
# STEP 2: Check if RESEND_API_KEY is configured
# =============================================================================

if [ "$ALL_PASSED" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 STEP 2 OF 3: Checking RESEND_API_KEY..."
    echo ""

    SEND_URL="https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code"
    TEST_RESPONSE=$(curl -s -X POST "$SEND_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnR6cHN3Zmljbm9la2tsc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjUwOTgsImV4cCI6MjA4ODEwMTA5OH0.No_ryirFyZGBXl2Q2mnY01dJwRDb0q9-ma1VneknGNk" \
      -d '{"recipientEmail":"test@example.com","recipientName":"Test","verificationCode":"123456"}')

    if echo "$TEST_RESPONSE" | grep -q '"demoMode":true'; then
        echo "   ❌ RESEND_API_KEY NOT CONFIGURED!"
        echo ""
        echo "   🔧 FIX: Add your Resend API key to Supabase"
        echo ""
        echo "   📝 Step-by-step:"
        echo ""
        echo "   1. Get API key:"
        echo "      → Open: https://resend.com/api-keys"
        echo "      → Click 'Create API Key'"
        echo "      → Name: Mnemosyne Production"
        echo "      → Copy the key (starts with 're_')"
        echo ""
        echo "   2. Add to Supabase:"
        echo "      → Open: https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
        echo "      → Scroll to 'Secrets' section"
        echo "      → Click 'Add a new secret'"
        echo "      → Name: RESEND_API_KEY"
        echo "      → Value: [paste your API key]"
        echo "      → Click 'Save'"
        echo ""
        echo "   3. Run this diagnostic again"
        echo ""
        ALL_PASSED=false
    else
        echo "   ✅ RESEND_API_KEY is configured!"
        echo ""
    fi
fi

# =============================================================================
# STEP 3: Send test email
# =============================================================================

if [ "$ALL_PASSED" = true ]; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "📋 STEP 3 OF 3: Send Test Email"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "  ⚠️  IMPORTANT: Resend Testing Mode"
    echo ""
    echo "  Resend can ONLY send to YOUR email (the one you used to sign up)."
    echo "  This is a security feature, not a bug!"
    echo ""
    echo "  Example:"
    echo "    ✅ If you signed up with: john@gmail.com"
    echo "    ✅ Enter: john@gmail.com"
    echo "    ❌ NOT any other email!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    read -p "  📧 Enter YOUR Resend account email: " USER_EMAIL

    if [ -z "$USER_EMAIL" ]; then
        echo ""
        echo "   ❌ No email provided"
        echo ""
        exit 1
    fi

    echo ""
    echo "   📤 Sending test email to: $USER_EMAIL"
    echo ""

    TEST_CODE=$(printf "%06d" $((RANDOM % 1000000)))
    SEND_PAYLOAD="{\"recipientEmail\":\"$USER_EMAIL\",\"recipientName\":\"Test User\",\"verificationCode\":\"$TEST_CODE\"}"
    
    SEND_RESPONSE=$(curl -s -X POST "$SEND_URL" \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnR6cHN3Zmljbm9la2tsc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjUwOTgsImV4cCI6MjA4ODEwMTA5OH0.No_ryirFyZGBXl2Q2mnY01dJwRDb0q9-ma1VneknGNk" \
      -d "$SEND_PAYLOAD")

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""

    if echo "$SEND_RESPONSE" | grep -q '"success":true'; then
        echo "  ✅✅✅ SUCCESS! EMAIL SENT! ✅✅✅"
        echo ""
        echo "  🎉 Your email system is working perfectly!"
        echo ""
        echo "  📧 Email sent to: $USER_EMAIL"
        echo "  🔐 Verification code: $TEST_CODE"
        echo ""
        echo "  📬 Next steps:"
        echo "     1. Check your inbox"
        echo "     2. Look for email from 'Mnemosyne'"
        echo "     3. If not in inbox, check spam/junk folder"
        echo "     4. You should see a beautiful branded email!"
        echo ""
        echo "  🔗 Check Resend dashboard:"
        echo "     https://resend.com/emails"
        echo ""
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    else
        echo "  ⚠️  POSSIBLE ISSUE"
        echo ""
        
        if echo "$SEND_RESPONSE" | grep -q 'validation_error\|Domain'; then
            echo "  📧 Resend Testing Mode Restriction Detected"
            echo ""
            echo "  Question: Is '$USER_EMAIL' the EXACT email you used"
            echo "            to sign up for Resend?"
            echo ""
            echo "  If NO:"
            echo "     → Run this script again"
            echo "     → Use your ACTUAL Resend account email"
            echo ""
            echo "  If YES:"
            echo "     → This might be a domain validation issue"
            echo "     → Check: https://resend.com/emails"
            echo "     → Look for error messages"
            echo "     → See RESEND_SETUP_COMPLETE.md for domain setup"
            echo ""
        else
            echo "  Server response:"
            echo "  $SEND_RESPONSE"
            echo ""
            echo "  🔍 Next steps:"
            echo "     1. Check Supabase logs:"
            echo "        https://supabase.com/dashboard/project/$PROJECT_REF/logs/edge-functions"
            echo ""
            echo "     2. Check Resend dashboard:"
            echo "        https://resend.com/emails"
            echo ""
            echo "     3. Verify API key is valid:"
            echo "        https://resend.com/api-keys"
            echo ""
        fi
        
        echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
        echo ""
    fi
fi

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                     DIAGNOSTIC COMPLETE                        ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ "$ALL_PASSED" = false ]; then
    echo "  ⚠️  Issues found - follow the instructions above to fix"
    echo ""
fi

echo "  📚 Documentation:"
echo "     • FINAL_ANSWER.md - Quick reference"
echo "     • STEP_BY_STEP_FIX.md - Detailed guide"
echo "     • check-email-setup.html - Interactive tool"
echo ""
