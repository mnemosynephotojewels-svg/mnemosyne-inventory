import { supabase, isConfigured } from '../lib/supabase';

const TABLES = ['raw_materials', 'finished_products', 'packaging_materials', 'activity_logs'];

export async function runDatabaseDiagnostic(): Promise<void> {
  console.log('\n══════════════════════════════════════════');
  console.log('🔍  MNEMOSYNE DATABASE DIAGNOSTIC');
  console.log('══════════════════════════════════════════');

  if (!isConfigured()) {
    console.log('  ⚠️  Supabase not configured — offline/demo mode');
    console.log('  📖 Add credentials to .env or edit /src/app/lib/supabase.ts');
    console.log('══════════════════════════════════════════\n');
    return;
  }

  console.log('  ✅  Credentials found — testing tables…\n');

  let allOk = true;
  for (const table of TABLES) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count', { count: 'exact', head: true });

      if (error) {
        console.log(`  ❌  ${table}: ${error.message}`);
        allOk = false;
      } else {
        console.log(`  ✅  ${table}: OK`);
      }
    } catch {
      console.log(`  ❌  ${table}: network error`);
      allOk = false;
    }
  }

  console.log('\n══════════════════════════════════════════');
  if (allOk) {
    console.log('🎉  ALL TESTS PASSED — database is fully configured!');
  } else {
    console.log('⚠️   Some tests failed. Run the SQL setup script in Supabase.');
  }
  console.log('══════════════════════════════════════════\n');
}
