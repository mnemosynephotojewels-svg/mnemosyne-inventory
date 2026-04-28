#!/bin/bash

# =============================================================================
# COMPLETE EMAIL DIAGNOSTIC - FIND THE EXACT PROBLEM
# =============================================================================

clear

PROJECT_REF="anntzpswficnoekklsdr"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnR6cHN3Zmljbm9la2tsc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjUwOTgsImV4cCI6MjA4ODEwMTA5OH0.No_ryirFyZGBXl2Q2mnY01dJwRDb0q9-ma1VneknGNk"

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                                                                   ║"
echo "║          🔍 COMPLETE EMAIL DIAGNOSTIC - STEP BY STEP              ║"
echo "║                                                                   ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
echo "  This will find EXACTLY why emails aren't sending"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# STEP 1: Check if function is deployed
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 1: Checking if server function is deployed..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

URL1="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/health"
echo "Testing: $URL1"
echo ""

RESPONSE1=$(curl -s -w "\n%{http_code}" "$URL1" 2>&1)
HTTP_CODE1=$(echo "$RESPONSE1" | tail -n1)
BODY1=$(echo "$RESPONSE1" | head -n-1)

echo "Status Code: $HTTP_CODE1"
echo "Response: $BODY1"
echo ""

if [ "$HTTP_CODE1" = "200" ]; then
    echo "✅ STEP 1 PASSED - Function is deployed!"
    echo ""
else
    echo "❌ STEP 1 FAILED - Function NOT deployed!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔧 HOW TO FIX:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Your server function is NOT deployed. Deploy it now:"
    echo ""
    echo "Option A - Via Supabase Dashboard (EASIEST):"
    echo ""
    echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/functions"
    echo ""
    echo "  2. Click 'Create a new function'"
    echo ""
    echo "  3. Function name: make-server-a9dec19d"
    echo ""
    echo "  4. Open the file: /supabase/functions/server/index.tsx"
    echo "     Copy ALL the code from that file"
    echo ""
    echo "  5. Paste it into the Supabase editor"
    echo ""
    echo "  6. Click 'Deploy'"
    echo ""
    echo "Option B - Via Supabase CLI:"
    echo ""
    echo "  supabase login"
    echo "  supabase link --project-ref $PROJECT_REF"
    echo "  cd supabase/functions"
    echo "  supabase functions deploy make-server-a9dec19d --no-verify-jwt"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "⚠️  STOP HERE - Fix Step 1 first, then run this script again"
    echo ""
    exit 1
fi

# =============================================================================
# STEP 2: Check if RESEND_API_KEY is configured
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 2: Checking if RESEND_API_KEY is configured..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

URL2="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/send-verification-code"
echo "Testing: $URL2"
echo ""

RESPONSE2=$(curl -s -X POST "$URL2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"recipientEmail":"test@example.com","recipientName":"Test User","verificationCode":"123456"}')

echo "Response: $RESPONSE2"
echo ""

if echo "$RESPONSE2" | grep -q '"demoMode":true'; then
    echo "❌ STEP 2 FAILED - RESEND_API_KEY is NOT configured!"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "🔧 HOW TO FIX:"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Step 1: Get your Resend API Key"
    echo ""
    echo "  1. Go to: https://resend.com/api-keys"
    echo ""
    echo "  2. If you don't have an account, sign up (FREE - 3,000 emails/month)"
    echo ""
    echo "  3. Click 'Create API Key'"
    echo "     - Name: Mnemosyne Production"
    echo "     - Permission: Full Access"
    echo ""
    echo "  4. COPY the API key (starts with 're_')"
    echo "     Example: re_123abc456def789..."
    echo ""
    echo "Step 2: Add API Key to Supabase"
    echo ""
    echo "  1. Go to: https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
    echo ""
    echo "  2. Scroll down to 'Secrets' section"
    echo ""
    echo "  3. Click 'Add a new secret'"
    echo ""
    echo "  4. Enter EXACTLY:"
    echo "     Name:  RESEND_API_KEY"
    echo "     Value: [paste your API key here]"
    echo ""
    echo "  5. Click 'Save'"
    echo ""
    echo "  6. WAIT 30 seconds for Supabase to apply the changes"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "⚠️  STOP HERE - Fix Step 2 first, then run this script again"
    echo ""
    exit 1
elif echo "$RESPONSE2" | grep -q 'Missing required fields'; then
    echo "✅ STEP 2 PASSED - RESEND_API_KEY is configured!"
    echo ""
    echo "   (The 'Missing required fields' error is expected for this test)"
    echo ""
else
    echo "✅ STEP 2 PASSED - RESEND_API_KEY is configured!"
    echo ""
fi

# =============================================================================
# STEP 3: Send actual test email
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "STEP 3: Sending test email..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  CRITICAL: Resend Testing Mode Restriction"
echo ""
echo "Resend FREE accounts can ONLY send to YOUR email address!"
echo ""
echo "You MUST use the EXACT SAME email you used to sign up for Resend."
echo ""
echo "Example:"
echo "  ❌ WRONG: Resend account = john@gmail.com, Testing = test@example.com"
echo "  ✅ RIGHT: Resend account = john@gmail.com, Testing = john@gmail.com"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
read -p "📧 Enter YOUR Resend account email: " USER_EMAIL

if [ -z "$USER_EMAIL" ]; then
    echo ""
    echo "❌ No email provided. Exiting."
    echo ""
    exit 1
fi

echo ""
echo "Sending test verification code to: $USER_EMAIL"
echo ""

TEST_CODE=$(printf "%06d" $((RANDOM % 1000000)))

SEND_RESPONSE=$(curl -s -X POST "$URL2" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d "{\"recipientEmail\":\"$USER_EMAIL\",\"recipientName\":\"Test User\",\"verificationCode\":\"$TEST_CODE\"}")

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "RESPONSE FROM SERVER:"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "$SEND_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SEND_RESPONSE"
echo ""

if echo "$SEND_RESPONSE" | grep -q '"success":true'; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅✅✅ SUCCESS! EMAIL SENT! ✅✅✅"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 Your email system is working!"
    echo ""
    echo "📧 Email sent to: $USER_EMAIL"
    echo "🔐 Verification code: $TEST_CODE"
    echo ""
    echo "📬 Next steps:"
    echo "  1. Check your inbox for email from Mnemosyne"
    echo "  2. If not in inbox, check SPAM/JUNK folder"
    echo "  3. Wait 1-2 minutes for delivery"
    echo ""
    echo "🔗 Check Resend dashboard to confirm:"
    echo "   https://resend.com/emails"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    exit 0
else
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "❌ STEP 3 FAILED - Email not sent"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    
    if echo "$SEND_RESPONSE" | grep -qi 'validation\|domain\|not found'; then
        echo "🔴 PROBLEM: Resend is blocking the email"
        echo ""
        echo "This happens because of Resend Testing Mode restrictions."
        echo ""
        echo "Question: Is '$USER_EMAIL' the EXACT email you used to sign up"
        echo "          for your Resend account?"
        echo ""
        echo "To verify:"
        echo "  1. Go to: https://resend.com/settings"
        echo "  2. Check what email is shown in your account"
        echo "  3. Use THAT email when running this test"
        echo ""
        echo "OR verify a domain to send to any email:"
        echo "  1. Go to: https://resend.com/domains"
        echo "  2. Click 'Add Domain'"
        echo "  3. Follow DNS setup instructions"
        echo ""
    elif echo "$SEND_RESPONSE" | grep -qi 'api.key\|unauthorized\|forbidden'; then
        echo "🔴 PROBLEM: API Key issue"
        echo ""
        echo "Your RESEND_API_KEY might be invalid or expired."
        echo ""
        echo "To fix:"
        echo "  1. Go to: https://resend.com/api-keys"
        echo "  2. Check if your key is active"
        echo "  3. If not, create a NEW API key"
        echo "  4. Update in Supabase:"
        echo "     https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
        echo "  5. Delete old RESEND_API_KEY secret"
        echo "  6. Add new one"
        echo ""
    else
        echo "🔴 PROBLEM: Unknown error"
        echo ""
        echo "Check Supabase logs for details:"
        echo "  https://supabase.com/dashboard/project/$PROJECT_REF/logs/edge-functions"
        echo ""
        echo "Check Resend logs for details:"
        echo "  https://resend.com/emails"
        echo ""
    fi
    
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
fi

echo ""
echo "╔═══════════════════════════════════════════════════════════════════╗"
echo "║                    DIAGNOSTIC COMPLETE                            ║"
echo "╚═══════════════════════════════════════════════════════════════════╝"
echo ""
