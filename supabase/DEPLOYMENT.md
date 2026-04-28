# Supabase Edge Function Deployment Guide

## 🚀 Deploy the Mnemosyne Server Function

Your Mnemosyne inventory system needs the Supabase Edge Function deployed to work with the database. Follow these steps:

### Prerequisites

1. **Supabase CLI** - Install from https://supabase.com/docs/guides/cli
   ```bash
   npm install -g supabase
   ```

2. **Supabase Account** - Already configured with project ID: `jqbmnoxxgocjadllsipn`

### Deployment Steps

#### Option 1: Deploy via Supabase CLI (Recommended)

1. **Login to Supabase**
   ```bash
   supabase login
   ```

2. **Link to your project**
   ```bash
   supabase link --project-ref jqbmnoxxgocjadllsipn
   ```

3. **Deploy the Edge Function**
   ```bash
   supabase functions deploy server
   ```

4. **Verify deployment**
   ```bash
   curl https://jqbmnoxxgocjadllsipn.supabase.co/functions/v1/make-server-a9dec19d/health
   ```
   
   You should see: `{"status":"ok"}`

#### Option 2: Deploy via Supabase Dashboard

1. Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn
2. Navigate to **Edge Functions** in the left sidebar
3. Click **"Deploy new function"**
4. Name: `server`
5. Copy the contents of `/supabase/functions/server/index.tsx`
6. Click **Deploy**

### Environment Variables (if needed)

If you're using the password reset feature, set the Resend API key:

```bash
supabase secrets set RESEND_API_KEY=your_resend_api_key_here
```

### Verify Your Database Table

The Edge Function uses a KV store table. Make sure it exists:

1. Go to https://supabase.com/dashboard/project/jqbmnoxxgocjadllsipn/database/tables
2. Check for table: `kv_store_a9dec19d`
3. If it doesn't exist, create it:

```sql
CREATE TABLE kv_store_a9dec19d (
  key TEXT NOT NULL PRIMARY KEY,
  value JSONB NOT NULL
);
```

### Test the Deployment

After deployment, refresh your Mnemosyne app. You should see in the console:

```
✅ Supabase is connected and working!
📦 Fetching packaging materials from server...
✅ Loaded from server
```

Instead of:
```
⚠️ Server endpoint not available, using localStorage
```

### Troubleshooting

**404 Error**: Edge Function not deployed
- Solution: Follow deployment steps above

**CORS Error**: Function deployed but CORS not configured
- Solution: Redeploy with the latest `index.tsx` which includes CORS headers

**Authentication Error**: Invalid API key
- Solution: Check `/utils/supabase/info.tsx` has correct `publicAnonKey`

**Database Error**: Table doesn't exist
- Solution: Create the `kv_store_a9dec19d` table as shown above

### Current Status

Your app currently works in **offline mode** using localStorage. This means:
- ✅ All features work locally
- ✅ Data persists in your browser
- ❌ Data doesn't sync across devices
- ❌ Data doesn't persist across browsers

Once you deploy the Edge Function:
- ✅ All features work with database
- ✅ Data syncs across all devices
- ✅ Data persists in Supabase database
- ✅ Team collaboration enabled

## 🎯 Quick Deploy Command

```bash
# One-liner to deploy everything
supabase login && supabase link --project-ref jqbmnoxxgocjadllsipn && supabase functions deploy server
```

## Support

For more help, visit:
- Supabase Docs: https://supabase.com/docs
- Edge Functions Guide: https://supabase.com/docs/guides/functions
