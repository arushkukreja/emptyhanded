import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/stripe/webhook|api/cron|api/email/unsubscribe|email/unsubscribe|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
};
