import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: claimsData } = await supabase.auth.getClaims();
  if (!claimsData?.claims?.sub) redirect("/login");

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const email = user.email;
  const profileName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  const { data: appUser } = await supabase.from("users").select("display_name, is_admin").eq("id", user.id).maybeSingle();
  const name = appUser?.display_name || (typeof profileName === "string" && profileName.trim() ? profileName.trim() : "Gift giver");

  return (
    <div className="min-h-screen bg-cream">
      <Nav email={email} name={name} authenticated={Boolean(email)} isAdmin={Boolean(appUser?.is_admin)} />
      <main className="min-w-0">{children}</main>
      <Footer signedIn />
    </div>
  );
}
