
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

// Create and export supabase client for use across the edge function
export function createSupabaseClient(authToken: string) {
  return createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: `Bearer ${authToken}` } } }
  );
}

// This will be initialized in the index.ts when a request comes in
export let supabaseClient: ReturnType<typeof createClient>;
