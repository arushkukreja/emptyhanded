import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { trackValidationEvent } from "@/lib/validation-events";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const requestedNext = searchParams.get("next") ?? "/dashboard";
  const next = requestedNext.startsWith("/") && !requestedNext.startsWith("//") ? requestedNext : "/dashboard";
  const forwardedHost = request.headers.get("x-forwarded-host");
  const redirectOrigin = process.env.NODE_ENV === "development" || !forwardedHost ? origin : `https://${forwardedHost}`;

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email && process.env.SUPABASE_SERVICE_ROLE_KEY) {
        const now = new Date().toISOString();
        await createAdminClient()
          .from("launch_leads")
          .update({ converted_user_id: user.id, converted_at: now, updated_at: now })
          .eq("email", user.email.trim().toLowerCase());
        await trackValidationEvent(user.id, "account_created");
      }
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${redirectOrigin}/login?error=auth_callback`);
}
