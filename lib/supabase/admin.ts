import "server-only";
import { createClient } from "@supabase/supabase-js";

// Lazy factory — evaluated at call time (inside the route handler), not at
// module load time. This ensures missing/invalid Vercel env vars surface as a
// catchable runtime error rather than an unhandled module-init crash that
// Vercel's edge runtime swallows silently before the route can respond.
export function getAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  }
  if (!serviceRoleKey.startsWith("eyJ")) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY is not a valid JWT (must start with 'eyJ'). " +
      "Copy the real key from Supabase Dashboard → Project Settings → API.",
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
