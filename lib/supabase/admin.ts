import { createClient } from "@supabase/supabase-js";

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

export const adminClient = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});
