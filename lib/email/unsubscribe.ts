import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

const USER_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function getUnsubscribeSecret() {
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET?.trim();
  if (!secret) throw new Error("Missing EMAIL_UNSUBSCRIBE_SECRET");
  return secret;
}

function signatureFor(userId: string) {
  return createHmac("sha256", getUnsubscribeSecret())
    .update(`occasion-reminders:${userId}`)
    .digest("base64url");
}

export function createUnsubscribeToken(userId: string) {
  if (!USER_ID_PATTERN.test(userId)) throw new Error("Invalid user ID");
  return `${userId}.${signatureFor(userId)}`;
}

export function verifyUnsubscribeToken(token?: string | null) {
  if (!token) return null;
  const separator = token.lastIndexOf(".");
  if (separator < 1) return null;

  const userId = token.slice(0, separator);
  const suppliedSignature = token.slice(separator + 1);
  if (!USER_ID_PATTERN.test(userId) || !suppliedSignature) return null;

  const expectedSignature = signatureFor(userId);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return null;
  return userId;
}

export function createUnsubscribeUrl(appUrl: string, userId: string) {
  const baseUrl = appUrl.replace(/\/$/, "");
  return `${baseUrl}/email/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(userId))}`;
}

export function createOneClickUnsubscribeUrl(appUrl: string, userId: string) {
  const baseUrl = appUrl.replace(/\/$/, "");
  return `${baseUrl}/api/email/unsubscribe?token=${encodeURIComponent(createUnsubscribeToken(userId))}`;
}
