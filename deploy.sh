#!/bin/bash

# Mnemosyne Supabase Edge Function Deployment Script

echo "🚀 Deploying Mnemosyne Edge Function to Supabase..."
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null
then
    echo "❌ Supabase CLI is not installed."
    echo ""
    echo "📥 Install it with:"
    echo "   npm install -g supabase"
    echo ""
    exit 1
fi

# Check if already logged in
echo "🔐 Checking Supabase login status..."
if ! supabase projects list &> /dev/null; then
    echo "❌ Not logged in to Supabase"
    echo ""
    echo "Please run: supabase login"
    echo ""
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Link to project
echo "🔗 Linking to project jqbmnoxxgocjadllsipn..."
supabase link --project-ref jqbmnoxxgocjadllsipn

if [ $? -ne 0 ]; then
    echo "❌ Failed to link to project"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Deploy the Edge Function
echo "📦 Deploying 'server' Edge Function..."
supabase functions deploy server --no-verify-jwt

if [ $? -ne 0 ]; then
    echo "❌ Failed to deploy Edge Function"
    exit 1
fi

echo ""
echo "✅✅✅ Edge Function deployed successfully!"
echo ""
echo "🎉 Your Mnemosyne app is now connected to Supabase!"
echo ""
echo "🔗 Function URL:"
echo "   https://jqbmnoxxgocjadllsipn.supabase.co/functions/v1/make-server-a9dec19d"
echo ""
echo "🧪 Test the deployment:"
echo "   curl https://jqbmnoxxgocjadllsipn.supabase.co/functions/v1/make-server-a9dec19d/health"
echo ""
echo "📝 Refresh your app to start using Supabase database!"
