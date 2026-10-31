import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Retrieve environment variables configured for Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    '[VÍNEA] Supabase credentials not found in environment variables (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY). Please configure them in your .env file.'
  );
}

/**
 * Shared Supabase Client singleton for VÍNEA Wine Marketplace.
 * Provides access to PostgreSQL tables (products, orders, users, reviews, categories),
 * Realtime Postgres changes subscriptions, and Supabase Auth.
 */
export const supabase: SupabaseClient = createClient(
  supabaseUrl || 'https://placeholder-project.supabase.co',
  supabaseAnonKey || 'placeholder-anon-key',
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
    realtime: {
      params: {
        eventsPerSecond: 10,
      },
    },
  }
);

export default supabase;
