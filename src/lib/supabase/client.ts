import { createBrowserClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a mock client for when Supabase is not configured
const createMockClient = () => ({
  auth: {
    getSession: async () => ({ data: { session: null }, error: null }),
    getUser: async () => ({ data: { user: null }, error: null }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    signUp: async () => ({ data: { user: null, session: null }, error: { message: 'Supabase not configured' } }),
    signOut: async () => ({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
  },
  from: () => ({
    select: () => ({
      eq: () => ({
        single: async () => ({ data: null, error: { code: 'PGRST116' } }),
        order: () => ({
          limit: () => ({
            single: async () => ({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      }),
      order: () => ({ data: [], error: null }),
    }),
    insert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      }),
    }),
    upsert: () => ({
      select: () => ({
        single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
      }),
    }),
    update: () => ({
      eq: () => ({
        eq: () => ({
          select: () => ({
            single: async () => ({ data: null, error: { message: 'Supabase not configured' } }),
          }),
        }),
      }),
    }),
  }),
}) as unknown as SupabaseClient;

export function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local');
    return createMockClient();
  }
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function isSupabaseConfigured() {
  return !!(supabaseUrl && supabaseAnonKey);
}
