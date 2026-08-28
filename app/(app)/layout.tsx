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
  const name = typeof profileName === "string" && profileName.trim() ? profileName.trim() : "Gift giver";

  return (
    <div className="min-h-screen bg-cream">
      <Nav email={email} name={name} authenticated={Boolean(email)} />
      <main className="min-w-0">{children}</main>
      <Footer signedIn />
    </div>
  );
}
