import { createClient } from "@supabase/supabase-js";

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } }
);

if (process.argv[2] === "delete") {
  const userId = process.argv[3];
  if (!userId) throw new Error("A user ID is required");
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) throw error;
  console.log("Deleted E2E user");
} else {
  const email = `codex-validation-${Date.now()}@example.com`;
  const password = "Codex-Validation-Only-9x!";
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: "Codex Validator" }
  });
  if (error) throw error;
  console.log(JSON.stringify({ id: data.user.id, email }));
}
