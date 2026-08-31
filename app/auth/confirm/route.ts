import { type NextRequest, NextResponse } from "next/server";
import { completeSignin } from "@/lib/auth/complete-signin";
import { createClient } from "@/lib/supabase/server";

function getRedirectOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  return process.env.NODE_ENV === "development" || !forwardedHost
    ? request.nextUrl.origin
    : `https://${forwardedHost}`;
}

function getSafeNext(rawNext: string | null, redirectOrigin: string) {
  if (!rawNext) return "/dashboard";
  if (rawNext.startsWith("/") && !rawNext.startsWith("//")) return rawNext;

  try {
    const nextUrl = new URL(rawNext);
    if (nextUrl.origin === redirectOrigin) {
      if (nextUrl.pathname === "/auth/callback") {
        const callbackNext = nextUrl.searchParams.get("next");
        if (callbackNext?.startsWith("/") && !callbackNext.startsWith("//")) {
          return callbackNext;
        }
        return "/dashboard";
      }

      return `${nextUrl.pathname}${nextUrl.search}${nextUrl.hash}`;
    }
  } catch {
    // Invalid or cross-origin destinations fall back to the dashboard.
  }

  return "/dashboard";
}

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get("token_hash");
  const type = request.nextUrl.searchParams.get("type");
  const redirectOrigin = getRedirectOrigin(request);
  const next = getSafeNext(request.nextUrl.searchParams.get("next"), redirectOrigin);

  if (tokenHash && type === "email") {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type });

    if (!error && data.user) {
      await completeSignin(data.user);
      return NextResponse.redirect(`${redirectOrigin}${next}`);
    }
  }

  return NextResponse.redirect(`${redirectOrigin}/login?error=confirmation_failed`);
}
