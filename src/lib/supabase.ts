import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Lazy singleton — only created when env vars are available.
// During build-time prerendering (SSG), env vars may be absent;
// returning null prevents the "supabaseUrl is required" crash.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;
  if (!supabaseUrl || !supabaseAnonKey) return null;
  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

/**
 * Shared Supabase client for browser-side usage.
 * Returns `null` when env vars are not configured (build-time / local dev fallback).
 */
export const supabase: SupabaseClient | null = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Lazy getter — safe alternative that always returns the latest client.
 */
export { getClient };

// Server-side admin client (service role, never expose to browser)
export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!serviceKey || !supabaseUrl) {
    throw new Error("SUPABASE_SERVICE_KEY or SUPABASE_URL is not set");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
