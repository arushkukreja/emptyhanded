import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublicKey } from "./config";

const PROTECTED_PAGE_PREFIXES = ["/dashboard", "/events", "/recommendations", "/email", "/upgrade"];
const PROTECTED_API_PREFIXES = ["/api/stripe/checkout", "/api/stripe/portal"];
const PUBLIC_PAGE_PATHS = new Set(["/email/unsubscribe"]);

function matchesPrefix(pathname: string, prefixes: string[]) {
  return prefixes.some(prefix => pathname === prefix || pathname.startsWith(`${prefix}/`));
}

function copySessionState(source: NextResponse, target: NextResponse) {
  source.cookies.getAll().forEach(cookie => target.cookies.set(cookie));
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = source.headers.get(header);
    if (value) target.headers.set(header, value);
  }
  return target;
}

function loginRedirect(request: NextRequest, response: NextResponse) {
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  url.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
  return copySessionState(response, NextResponse.redirect(url));
}

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const { pathname } = request.nextUrl;
  const isProtectedPage = !PUBLIC_PAGE_PATHS.has(pathname) && matchesPrefix(pathname, PROTECTED_PAGE_PREFIXES);
  const isProtectedApi = matchesPrefix(pathname, PROTECTED_API_PREFIXES);

  const hasSessionCookie = request.cookies
    .getAll()
    .some(({ name }) => /^sb-.+-auth-token(?:\.\d+)?$/.test(name));

  if (!hasSessionCookie) {
    if (isProtectedApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (isProtectedPage) return loginRedirect(request, response);
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    getSupabasePublicKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options: CookieOptions }>, headers) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
          Object.entries(headers).forEach(([key, value]) => response.headers.set(key, value));
        }
      }
    }
  );

  const { data } = await supabase.auth.getClaims();
  const authenticated = Boolean(data?.claims?.sub);

  const isAuthPath = pathname.startsWith("/login") || pathname.startsWith("/signup");
  if (!authenticated && isProtectedApi) {
    return copySessionState(response, NextResponse.json({ error: "Unauthorized" }, { status: 401 }));
  }
  if (!authenticated && isProtectedPage) return loginRedirect(request, response);
  if (authenticated && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return copySessionState(response, NextResponse.redirect(url));
  }

  return response;
}
