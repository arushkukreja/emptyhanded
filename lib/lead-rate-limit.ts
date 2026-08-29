import "server-only";

import { createHmac } from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";

export class LeadRateLimitError extends Error {
  constructor() {
    super("Too many lead capture attempts");
    this.name = "LeadRateLimitError";
  }
}

function getClientIp(request: Request) {
  const forwarded =
    request.headers.get("x-vercel-forwarded-for") ??
    request.headers.get("x-forwarded-for") ??
    request.headers.get("x-real-ip") ??
    "local";
  return forwarded.split(",", 1)[0]?.trim().slice(0, 128) || "unknown";
}

function hashIdentifier(scope: "ip" | "email", value: string) {
  const secret = process.env.RATE_LIMIT_SECRET ?? process.env.EMAIL_UNSUBSCRIBE_SECRET;
  if (!secret) throw new Error("Missing RATE_LIMIT_SECRET");
  return createHmac("sha256", secret)
    .update(`${scope}\0${value}`)
    .digest("hex");
}

export async function reserveLeadCapture(request: Request, email: string) {
  const ipHash = hashIdentifier("ip", getClientIp(request));
  const emailHash = hashIdentifier("email", email.toLowerCase());
  const { error } = await createAdminClient().rpc("reserve_lead_capture", {
    p_ip_hash: ipHash,
    p_email_hash: emailHash
  });

  if (!error) return;
  if (
    error.message.includes("lead_ip_burst_limit") ||
    error.message.includes("lead_ip_daily_limit") ||
    error.message.includes("lead_email_rate_limit")
  ) {
    throw new LeadRateLimitError();
  }
  throw new Error("Unable to check the lead capture rate limit");
}
