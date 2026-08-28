import { cookies } from "next/headers";

export async function hasSupabaseSessionCookie() {
  const cookieStore = await cookies();
  return cookieStore.getAll().some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));
}
