let logged = false;

export function logEnvOnce() {
  if (logged) return;
  logged = true;
  console.log("[supabase] env check — hasUrl:", !!process.env.NEXT_PUBLIC_SUPABASE_URL, "hasAnonKey:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
