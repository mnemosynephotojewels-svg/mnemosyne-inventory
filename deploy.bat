@echo off
echo.
echo 🚀 Deploying Mnemosyne Edge Function to Supabase...
echo.

REM Check if Supabase CLI is installed
where supabase >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI is not installed.
    echo.
    echo 📥 Install it with:
    echo    npm install -g supabase
    echo.
    pause
    exit /b 1
)

REM Check if logged in
echo 🔐 Checking Supabase login status...
supabase projects list >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ Not logged in to Supabase
    echo.
    echo Please run: supabase login
    echo.
    pause
    exit /b 1
)

echo ✅ Logged in to Supabase
echo.

REM Link to project
echo 🔗 Linking to project jqbmnoxxgocjadllsipn...
supabase link --project-ref jqbmnoxxgocjadllsipn

if %errorlevel% neq 0 (
    echo ❌ Failed to link to project
    pause
    exit /b 1
)

echo ✅ Project linked
echo.

REM Deploy the Edge Function
echo 📦 Deploying 'server' Edge Function...
supabase functions deploy server --no-verify-jwt

if %errorlevel% neq 0 (
    echo ❌ Failed to deploy Edge Function
    pause
    exit /b 1
)

echo.
echo ✅✅✅ Edge Function deployed successfully!
echo.
echo 🎉 Your Mnemosyne app is now connected to Supabase!
echo.
echo 🔗 Function URL:
echo    https://jqbmnoxxgocjadllsipn.supabase.co/functions/v1/make-server-a9dec19d
echo.
echo 🧪 Test the deployment:
echo    curl https://jqbmnoxxgocjadllsipn.supabase.co/functions/v1/make-server-a9dec19d/health
echo.
echo 📝 Refresh your app to start using Supabase database!
echo.
pause
