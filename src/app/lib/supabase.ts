import { createClient, SupabaseClient } from '@supabase/supabase-js';

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CONFIGURATION
// ─────────────────────────────────────────────────────────────────────────────
// Add your credentials to the .env file:
//   VITE_SUPABASE_URL=https://your-project.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJ...
//
// OR replace the values below directly:
//   const FALLBACK_URL = 'https://your-project.supabase.co';
//   const FALLBACK_KEY = 'eyJ...';
// 
// ⚠️ IMPORTANT: After creating a new Supabase project:
// 1. Get your credentials from Project Settings → API
// 2. Update the FALLBACK_URL and FALLBACK_KEY below
// 3. See SUPABASE_SETUP_GUIDE.md for detailed instructions
// ─────────────────────────────────────────────────────────────────────────────

// 🔧 REPLACE THESE WITH YOUR NEW SUPABASE CREDENTIALS 🔧
const FALLBACK_URL = 'https://johzjtbxgtafpwaenkio.supabase.co';  // ✅ Connected to your new database!
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpvaHpqdGJ4Z3RhZnB3YWVua2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMzM1MTksImV4cCI6MjA4ODYwOTUxOX0.PBJRLSGEjwwexomPv_FespTv4z8mw8PGLl1rrXHaZaI';  // ✅ Anon public key configured!

const rawUrl = import.meta.env.VITE_SUPABASE_URL || FALLBACK_URL;
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || FALLBACK_KEY;

// Validate URL format
const isValidUrl = (url: string) => {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
};

// Validate JWT format (must have 3 base64 parts separated by dots)
// OR accept any non-empty key (for alternative key formats)
const isValidJwt = (key: string) => {
  if (!key || key.trim().length === 0) return false;
  
  // Accept standard JWT format (3 parts separated by dots)
  const parts = key.split('.');
  if (parts.length === 3 && parts.every(p => p.length > 0)) return true;
  
  // Accept alternative key formats (like sb_publishable_*)
  if (key.startsWith('sb_') && key.length > 10) return true;
  
  // Accept any other non-empty key and let Supabase validate it
  return key.length > 20;
};

const configOk = isValidUrl(rawUrl) && isValidJwt(rawKey);

if (!configOk) {
  console.warn(
    '[Mnemosyne] Supabase not configured — running in offline/demo mode.\n' +
    'To connect: add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file.'
  );
}

// Safe placeholder credentials that pass @supabase/supabase-js validation
const SAFE_URL = 'https://placeholder.supabase.co';
const SAFE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9' +
  '.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDUxOTI4MDAsImV4cCI6MTk2MDc2ODgwMH0' +
  '.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

let _supabase: SupabaseClient;

try {
  _supabase = createClient(
    configOk ? rawUrl : SAFE_URL,
    configOk ? rawKey : SAFE_KEY,
    {
      auth: {
        persistSession: true,
        storageKey: 'mnemosyne-supabase-auth',
        autoRefreshToken: true,
        detectSessionInUrl: true,
        // Disable warnings about multiple instances
        debug: false,
      },
      global: {
        headers: {
          'X-Client-Info': 'mnemosyne-inventory-v1',
        },
      },
    }
  );
} catch (e) {
  // Last-resort fallback — should never reach here with the safe credentials above
  console.error('[Mnemosyne] Failed to create Supabase client:', e);
  _supabase = createClient(SAFE_URL, SAFE_KEY, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false, debug: false },
  });
}

export const supabase = _supabase;

// Table names
export const PACKAGING_TABLE      = 'packaging_materials';
export const RAW_MATERIALS_TABLE  = 'raw_materials';
export const FINISHED_PRODUCTS_TABLE = 'finished_products';
export const ACTIVITY_LOGS_TABLE  = 'activity_logs';

/** True only when real, validated credentials are present */
export const isConfigured = () => configOk;

/** Quick connection test — returns false gracefully if not configured */
export async function testSupabaseConnection(): Promise<boolean> {
  if (!configOk) return false;
  try {
    const { error } = await supabase
      .from(PACKAGING_TABLE)
      .select('count', { count: 'exact', head: true });
    return !error || error.code === '42P01';
  } catch {
    return false;
  }
}

/** Legacy compat — kept so existing callers don't break */
export async function initializeDatabase(): Promise<boolean> {
  return testSupabaseConnection();
}