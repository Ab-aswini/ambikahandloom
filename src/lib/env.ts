/**
 * env.ts — Centralized environment variable validation
 *
 * Logs warnings at startup when critical env vars are missing,
 * rather than silently falling back to defaults.
 */

interface EnvVar {
  key: string;
  required: boolean;
  description: string;
  isPublic: boolean;
}

const ENV_VARS: EnvVar[] = [
  {
    key: "NEXT_PUBLIC_SUPABASE_URL",
    required: false,
    description: "Supabase project URL (e.g. https://xxxxx.supabase.co)",
    isPublic: true,
  },
  {
    key: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    required: false,
    description: "Supabase anonymous/public API key",
    isPublic: true,
  },
  {
    key: "SUPABASE_SERVICE_KEY",
    required: false,
    description: "Supabase service role key (server-side only)",
    isPublic: false,
  },
  {
    key: "NEXT_PUBLIC_WHATSAPP_NUMBER",
    required: true,
    description: "WhatsApp number with country code, no spaces (e.g. 918658476300)",
    isPublic: true,
  },
  {
    key: "NEXT_PUBLIC_SITE_URL",
    required: true,
    description: "Production site URL (e.g. https://ambikahandloom.in)",
    isPublic: true,
  },
  {
    key: "NEXT_PUBLIC_ADMIN_PASSWORD",
    required: true,
    description: "Admin panel password",
    isPublic: true,
  },
];

export function validateEnv(): { valid: boolean; warnings: string[]; errors: string[] } {
  const warnings: string[] = [];
  const errors: string[] = [];

  for (const envVar of ENV_VARS) {
    const value = process.env[envVar.key];
    const isPlaceholder =
      value === "your-anon-key-here" ||
      value === "your-service-role-key-here" ||
      value === "https://your-project-id.supabase.co";

    if (!value || isPlaceholder) {
      if (envVar.required) {
        errors.push(`❌ MISSING: ${envVar.key} — ${envVar.description}`);
      } else {
        warnings.push(`⚠️  OPTIONAL: ${envVar.key} not set — ${envVar.description}`);
      }
    }
  }

  // Supabase pair check — if URL is set, key must be too
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && url !== "https://your-project-id.supabase.co" && (!key || key === "your-anon-key-here")) {
    errors.push("❌ SUPABASE_URL is set but SUPABASE_ANON_KEY is missing — both are required for database connection");
  }

  return { valid: errors.length === 0, warnings, errors };
}

/**
 * Log env validation results to console.
 * Call this once during app initialization.
 */
export function logEnvValidation(): void {
  if (typeof window !== "undefined") return; // Server-side only

  const { valid, warnings, errors } = validateEnv();

  if (errors.length > 0 || warnings.length > 0) {
    console.log("\n╔════════════════════════════════════════════════╗");
    console.log("║      AMBIKA HANDLOOM — ENV CONFIGURATION       ║");
    console.log("╚════════════════════════════════════════════════╝");
  }

  for (const err of errors) {
    console.error(err);
  }
  for (const warn of warnings) {
    console.warn(warn);
  }

  if (!valid) {
    console.error("\n🚨 Some required environment variables are missing. The app may not work correctly.\n");
  } else if (warnings.length === 0) {
    console.log("✅ All environment variables configured correctly.\n");
  } else {
    console.log("\n✅ Required vars OK. Optional vars above can be configured later.\n");
  }
}
