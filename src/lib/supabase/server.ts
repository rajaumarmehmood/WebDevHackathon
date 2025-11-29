import { createServerClient } from '@supabase/ssr';
import type { SupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

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

export async function createClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured');
    return createMockClient();
  }

  const cookieStore = await cookies();

  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // The `setAll` method was called from a Server Component.
          // This can be ignored if you have middleware refreshing user sessions.
        }
      },
    },
  });
}
