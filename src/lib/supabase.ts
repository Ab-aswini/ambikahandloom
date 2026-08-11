import { createClient, SupabaseClient } from "@supabase/supabase-js";

export const DEFAULT_SUPABASE_URL = "https://mouqetmwwxcazgwodkzd.supabase.co";
export const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXFldG13d3hjYXpnd29ka3pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwMzE1ODUsImV4cCI6MjA5OTYwNzU4NX0.L7ysOX8zOCdFREQGJt6b00aREH8np0B3uGZBSs74e8Q";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

// Placeholder values that ship with the template — NOT real credentials
const PLACEHOLDER_VALUES = [
  "your-anon-key-here",
  "your-service-role-key-here",
  "https://your-project-id.supabase.co",
];

/** True only when REAL Supabase credentials are configured */
export function hasValidCredentials(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (PLACEHOLDER_VALUES.includes(supabaseUrl)) return false;
  if (PLACEHOLDER_VALUES.includes(supabaseAnonKey)) return false;
  // Basic format check — URL must be a real supabase URL
  if (!supabaseUrl.match(/^https:\/\/[a-z0-9]+\.supabase\.co$/)) return false;
  return true;
}

export function isSupabaseConfigured(): boolean {
  return hasValidCredentials();
}

// Shared Supabase client for browser-side usage.
export const supabase: SupabaseClient | null = hasValidCredentials()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Lazy getter — safe alternative that always returns the latest client.
 */
export function getClient(): SupabaseClient | null {
  return supabase;
}

// Server-side admin client (service role, never expose to browser)
export function getAdminClient() {
  const serviceKey =
    process.env.SUPABASE_SERVICE_KEY ||
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1vdXFldG13d3hjYXpnd29ka3pkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDAzMTU4NSwiZXhwIjoyMDk5NjA3NTg1fQ.EYzCot-1zf7phG7ZEUlzI5t8OH3PW057LcY-VDE9ehw";

  if (
    !serviceKey ||
    !supabaseUrl ||
    PLACEHOLDER_VALUES.includes(serviceKey) ||
    PLACEHOLDER_VALUES.includes(supabaseUrl)
  ) {
    throw new Error("SUPABASE_SERVICE_KEY or SUPABASE_URL is not set");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
