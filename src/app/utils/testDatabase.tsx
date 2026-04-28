/**
 * Database Diagnostic Utilities
 * Run diagnostics to check Supabase connection and table status
 */

import { supabase, isConfigured } from '../lib/supabase';

export async function runDatabaseDiagnostic() {
  console.log('🔍 Running Database Diagnostic...');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  
  // Check Supabase configuration
  if (!isConfigured) {
    console.warn('⚠️  Supabase not configured');
    console.log('📋 Please check /src/app/lib/supabase.ts');
    return;
  }
  
  console.log('✅ Supabase configured');
  
  // Check each table
  const tables = [
    'packaging_materials',
    'raw_materials',
    'finished_products',
    'activity_logs'
  ];
  
  for (const table of tables) {
    try {
      const { data, error, count } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.error(`❌ Table '${table}': ${error.message}`);
      } else {
        console.log(`✅ Table '${table}': ${count ?? 0} rows`);
      }
    } catch (err) {
      console.error(`❌ Table '${table}': Connection error`, err);
    }
  }
  
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ Diagnostic complete');
}

export default runDatabaseDiagnostic;
