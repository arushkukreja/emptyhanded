import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyUnsubscribeToken } from "@/lib/email/unsubscribe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const token = new URL(request.url).searchParams.get("token");
  const userId = verifyUnsubscribeToken(token);
  if (!userId) return new NextResponse("Invalid unsubscribe link", { status: 400 });

  const { error } = await createAdminClient()
    .from("users")
    .update({ email_reminders_enabled: false })
    .eq("id", userId);

  if (error) return new NextResponse("Could not update reminder preferences", { status: 500 });
  return new NextResponse("Email reminders unsubscribed", { status: 200 });
}
