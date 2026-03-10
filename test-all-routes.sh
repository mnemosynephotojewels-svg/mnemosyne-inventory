#!/bin/bash

# =============================================================================
# TEST ALL POSSIBLE ROUTE COMBINATIONS
# =============================================================================
# This will test all possible URL variations to find the working one
# =============================================================================

PROJECT_REF="anntzpswficnoekklsdr"
ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFubnR6cHN3Zmljbm9la2tsc2RyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI1MjUwOTgsImV4cCI6MjA4ODEwMTA5OH0.No_ryirFyZGBXl2Q2mnY01dJwRDb0q9-ma1VneknGNk"

clear

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║              🔍 TESTING ALL ROUTE COMBINATIONS                 ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo "  This will try different URL patterns to find what works"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# TEST 1: Health endpoint without prefix
# =============================================================================

echo "📋 Test 1: /health (no prefix)"
echo ""
URL1="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/health"
echo "🌐 URL: $URL1"
echo ""

RESPONSE1=$(curl -s -w "\n%{http_code}" "$URL1" 2>&1)
HTTP_CODE1=$(echo "$RESPONSE1" | tail -n1)
BODY1=$(echo "$RESPONSE1" | head -n-1)

echo "📥 Status: $HTTP_CODE1"
echo "📦 Response: $BODY1"
echo ""

if [ "$HTTP_CODE1" = "200" ] && echo "$BODY1" | grep -q '"status"'; then
    echo "✅ THIS WORKS!"
    WORKING_PATTERN="/health"
else
    echo "❌ Doesn't work"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# TEST 2: Health endpoint with prefix
# =============================================================================

echo "📋 Test 2: /make-server-a9dec19d/health (with prefix)"
echo ""
URL2="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/health"
echo "🌐 URL: $URL2"
echo ""

RESPONSE2=$(curl -s -w "\n%{http_code}" "$URL2" 2>&1)
HTTP_CODE2=$(echo "$RESPONSE2" | tail -n1)
BODY2=$(echo "$RESPONSE2" | head -n-1)

echo "📥 Status: $HTTP_CODE2"
echo "📦 Response: $BODY2"
echo ""

if [ "$HTTP_CODE2" = "200" ] && echo "$BODY2" | grep -q '"status"'; then
    echo "✅ THIS WORKS!"
    WORKING_PATTERN="/make-server-a9dec19d/health"
else
    echo "❌ Doesn't work"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# TEST 3: Send verification code without prefix
# =============================================================================

echo "📋 Test 3: /send-verification-code (no prefix)"
echo ""
URL3="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code"
echo "🌐 URL: $URL3"
echo ""

RESPONSE3=$(curl -s -w "\n%{http_code}" -X POST "$URL3" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"recipientEmail":"test@example.com","recipientName":"Test User","verificationCode":"123456"}' 2>&1)
HTTP_CODE3=$(echo "$RESPONSE3" | tail -n1)
BODY3=$(echo "$RESPONSE3" | head -n-1)

echo "📥 Status: $HTTP_CODE3"
echo "📦 Response: $BODY3"
echo ""

if [ "$HTTP_CODE3" = "200" ] && echo "$BODY3" | grep -q '"success"\|"demoMode"'; then
    echo "✅ THIS WORKS!"
    WORKING_PATTERN="/send-verification-code"
else
    echo "❌ Doesn't work"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# TEST 4: Send verification code with prefix
# =============================================================================

echo "📋 Test 4: /make-server-a9dec19d/send-verification-code (with prefix)"
echo ""
URL4="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/make-server-a9dec19d/send-verification-code"
echo "🌐 URL: $URL4"
echo ""

RESPONSE4=$(curl -s -w "\n%{http_code}" -X POST "$URL4" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ANON_KEY" \
  -d '{"recipientEmail":"test@example.com","recipientName":"Test User","verificationCode":"123456"}' 2>&1)
HTTP_CODE4=$(echo "$RESPONSE4" | tail -n1)
BODY4=$(echo "$RESPONSE4" | head -n-1)

echo "📥 Status: $HTTP_CODE4"
echo "📦 Response: $BODY4"
echo ""

if [ "$HTTP_CODE4" = "200" ] && echo "$BODY4" | grep -q '"success"\|"demoMode"'; then
    echo "✅ THIS WORKS!"
    WORKING_PATTERN="/make-server-a9dec19d/send-verification-code"
else
    echo "❌ Doesn't work"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# =============================================================================
# SUMMARY
# =============================================================================

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                          SUMMARY                               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

if [ "$HTTP_CODE1" = "200" ] && echo "$BODY1" | grep -q '"status"'; then
    echo "✅ WORKING PATTERN: No prefix"
    echo ""
    echo "   Routes should be:"
    echo "   • /health"
    echo "   • /send-verification-code"
    echo ""
    echo "   📝 Your emailService.ts should use:"
    echo "   https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code"
    echo ""
elif [ "$HTTP_CODE2" = "200" ] && echo "$BODY2" | grep -q '"status"'; then
    echo "✅ WORKING PATTERN: With prefix"
    echo ""
    echo "   Routes should be:"
    echo "   • /make-server-a9dec19d/health"
    echo "   • /make-server-a9dec19d/send-verification-code"
    echo ""
    echo "   📝 Your emailService.ts should use:"
    echo "   https://${PROJECT_REF}.supabase.co/functions/v1/make-server-a9dec19d/send-verification-code"
    echo ""
    echo "   ⚠️  Note: This is currently what's deployed."
    echo "   Your code is already correct!"
    echo ""
else
    echo "❌ NO WORKING ROUTES FOUND"
    echo ""
    echo "   Possible reasons:"
    echo "   1. Function not deployed"
    echo "   2. Function name is different"
    echo "   3. Authentication issue"
    echo ""
    echo "   🔍 Check Supabase dashboard:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_REF/functions"
    echo ""
    echo "   📋 Check available functions:"
    echo "   supabase functions list --project-ref $PROJECT_REF"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
