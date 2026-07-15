import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

// Placeholder values that ship with the template — NOT real credentials
const PLACEHOLDER_VALUES = [
  "your-anon-key-here",
  "your-service-role-key-here",
  "https://your-project-id.supabase.co",
];

/** True only when REAL Supabase credentials are configured */
function hasValidCredentials(): boolean {
  if (!supabaseUrl || !supabaseAnonKey) return false;
  if (PLACEHOLDER_VALUES.includes(supabaseUrl)) return false;
  if (PLACEHOLDER_VALUES.includes(supabaseAnonKey)) return false;
  // Basic format check — URL must be a real supabase URL
  if (!supabaseUrl.match(/^https:\/\/[a-z0-9]+\.supabase\.co$/)) return false;
  return true;
}

// Lazy singleton — only created when REAL credentials are available.
let _client: SupabaseClient | null = null;

function getClient(): SupabaseClient | null {
  if (_client) return _client;
  if (!hasValidCredentials()) return null;
  _client = createClient(supabaseUrl, supabaseAnonKey);
  return _client;
}

/**
 * Shared Supabase client for browser-side usage.
 * Returns `null` when env vars are not configured or are placeholders.
 */
export const supabase: SupabaseClient | null = hasValidCredentials()
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Lazy getter — safe alternative that always returns the latest client.
 */
export { getClient };

// Server-side admin client (service role, never expose to browser)
export function getAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_KEY;
  if (
    !serviceKey ||
    !supabaseUrl ||
    PLACEHOLDER_VALUES.includes(serviceKey) ||
    PLACEHOLDER_VALUES.includes(supabaseUrl)
  ) {
    throw new Error("SUPABASE_SERVICE_KEY or SUPABASE_URL is not set (or still has placeholder values)");
  }
  return createClient(supabaseUrl, serviceKey, {
    auth: { persistSession: false },
  });
}
