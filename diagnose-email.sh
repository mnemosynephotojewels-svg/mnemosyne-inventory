#!/bin/bash

# =============================================================================
# EMAIL DIAGNOSTIC SCRIPT
# =============================================================================
# This will test your email setup step by step and show you what's wrong
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 EMAIL VERIFICATION CODE DIAGNOSTIC"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

PROJECT_REF="anntzpswficnoekklsdr"

# =============================================================================
# TEST 1: Check if server function is deployed
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 1: Checking if server function is deployed..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

HEALTH_URL="https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/health"
echo "🌐 Testing: $HEALTH_URL"
echo ""

HEALTH_RESPONSE=$(curl -s -w "\n%{http_code}" "$HEALTH_URL")
HTTP_CODE=$(echo "$HEALTH_RESPONSE" | tail -n1)
RESPONSE_BODY=$(echo "$HEALTH_RESPONSE" | head -n-1)

echo "📥 HTTP Status: $HTTP_CODE"
echo "📦 Response: $RESPONSE_BODY"
echo ""

if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ TEST 1 PASSED: Server function is deployed!"
    echo ""
else
    echo "❌ TEST 1 FAILED: Server function is NOT deployed!"
    echo ""
    echo "🔧 FIX: Run this command to deploy:"
    echo ""
    echo "    bash deploy-verification-code.sh"
    echo ""
    echo "⚠️  STOP: Fix this before continuing to Test 2"
    echo ""
    exit 1
fi

# =============================================================================
# TEST 2: Check if RESEND_API_KEY is configured
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 2: Checking if RESEND_API_KEY is configured..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

SEND_URL="https://$PROJECT_REF.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code"
echo "🌐 Testing: $SEND_URL"
echo ""

TEST_PAYLOAD='{
  "recipientEmail": "test@example.com",
  "recipientName": "Test User",
  "verificationCode": "123456"
}'

echo "📤 Sending test request..."
echo ""

API_RESPONSE=$(curl -s -X POST "$SEND_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnR6cHN3Zmljbm9la2tsc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjUwOTgsImV4cCI6MjA4ODEwMTA5OH0.No_ryirFyZGBXl2Q2mnY01dJwRDb0q9-ma1VneknGNk" \
  -d "$TEST_PAYLOAD")

echo "📦 Response: $API_RESPONSE"
echo ""

if echo "$API_RESPONSE" | grep -q '"demoMode":true'; then
    echo "❌ TEST 2 FAILED: RESEND_API_KEY is NOT configured!"
    echo ""
    echo "🔧 FIX: Configure your Resend API key"
    echo ""
    echo "Step 1: Get API key from Resend"
    echo "   🌐 https://resend.com/api-keys"
    echo "   Click 'Create API Key'"
    echo "   Name: Mnemosyne Production"
    echo "   Copy the key (starts with 're_')"
    echo ""
    echo "Step 2: Add to Supabase"
    echo "   🌐 https://supabase.com/dashboard/project/$PROJECT_REF/settings/functions"
    echo "   Scroll to 'Secrets' section"
    echo "   Click 'Add a new secret'"
    echo "   Name: RESEND_API_KEY"
    echo "   Value: [paste your API key]"
    echo "   Click 'Save'"
    echo ""
    echo "⚠️  STOP: Fix this before continuing to Test 3"
    echo ""
    exit 1
else
    echo "✅ TEST 2 PASSED: RESEND_API_KEY is configured!"
    echo ""
fi

# =============================================================================
# TEST 3: Send actual test email
# =============================================================================

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "TEST 3: Send test email"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "⚠️  IMPORTANT: Use the SAME email you used to sign up for Resend!"
echo "   (Resend testing mode only allows YOUR email)"
echo ""
read -p "📧 Enter YOUR Resend account email: " USER_EMAIL

if [ -z "$USER_EMAIL" ]; then
    echo "❌ No email provided. Exiting."
    exit 1
fi

echo ""
echo "📤 Sending verification code to: $USER_EMAIL"
echo ""

TEST_CODE=$(printf "%06d" $((RANDOM % 1000000)))

SEND_PAYLOAD="{
  \"recipientEmail\": \"$USER_EMAIL\",
  \"recipientName\": \"Test User\",
  \"verificationCode\": \"$TEST_CODE\"
}"

SEND_RESPONSE=$(curl -s -X POST "$SEND_URL" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnR6cHN3Zmljbm9la2tsc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjUwOTgsImV4cCI6MjA4ODEwMTA5OH0.No_ryirFyZGBXl2Q2mnY01dJwRDb0q9-ma1VneknGNk" \
  -d "$SEND_PAYLOAD")

echo "📦 Response:"
echo "$SEND_RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$SEND_RESPONSE"
echo ""

if echo "$SEND_RESPONSE" | grep -q '"success":true'; then
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "✅ TEST 3 PASSED: Email sent successfully!"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "🎉 SUCCESS! Your email system is working!"
    echo ""
    echo "📧 Check your inbox: $USER_EMAIL"
    echo "🔐 Your verification code: $TEST_CODE"
    echo ""
    echo "📬 If you don't see the email:"
    echo "   1. Check your spam/junk folder"
    echo "   2. Wait 1-2 minutes for delivery"
    echo "   3. Check Resend dashboard: https://resend.com/emails"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    exit 0
elif echo "$SEND_RESPONSE" | grep -q '"demoMode":true'; then
    echo "❌ TEST 3 FAILED: Still in demo mode"
    echo ""
    echo "This shouldn't happen if Test 2 passed."
    echo "Try waiting 1 minute for Supabase to update the secret, then run this again."
    echo ""
    exit 1
elif echo "$SEND_RESPONSE" | grep -q 'validation_error\|Domain'; then
    echo "⚠️  TEST 3: Resend testing mode restriction"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo "📧 RESEND TESTING MODE EXPLANATION"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    echo "Resend is blocking this email because you're in TESTING MODE."
    echo ""
    echo "Testing mode means:"
    echo "  ✅ Can send to: YOUR Resend account email"
    echo "  ❌ Cannot send to: Any other email"
    echo ""
    echo "Question: Is '$USER_EMAIL' the EXACT email you used to sign up for Resend?"
    echo ""
    echo "If YES:"
    echo "  - This might be a domain validation issue"
    echo "  - Check Resend dashboard: https://resend.com/emails"
    echo "  - Look for error messages"
    echo ""
    echo "If NO:"
    echo "  - Run this script again"
    echo "  - Use your ACTUAL Resend account email"
    echo "  - Or verify a domain in Resend (see RESEND_SETUP_COMPLETE.md)"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo ""
    exit 1
else
    echo "❌ TEST 3 FAILED: Unknown error"
    echo ""
    echo "Error details:"
    echo "$SEND_RESPONSE"
    echo ""
    echo "🔍 Next steps:"
    echo "1. Check Supabase logs:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/logs/edge-functions"
    echo ""
    echo "2. Check Resend dashboard:"
    echo "   https://resend.com/emails"
    echo ""
    echo "3. Verify your API key is valid:"
    echo "   https://resend.com/api-keys"
    echo ""
    exit 1
fi
