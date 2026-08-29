export function getSupabasePublicKey() {
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error("Missing Supabase publishable key");
  }

  return key;
}
