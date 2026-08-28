import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPrivateProfileImageUrl } from "@/lib/media";
import ProfileForm from "./ProfileForm";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const { data: profile } = await supabase.from("users").select("display_name, avatar_path").eq("id", user.id).maybeSingle();
  const metadataName = user.user_metadata?.full_name ?? user.user_metadata?.name;
  const displayName = profile?.display_name || (typeof metadataName === "string" ? metadataName : "Gift giver");
  const avatarUrl = await getPrivateProfileImageUrl(profile?.avatar_path);

  return (
    <div className="min-h-screen bg-[#fbfaf7] pb-24">
      <div className="mx-auto max-w-4xl px-4 py-8 min-[390px]:px-5 sm:px-8 sm:py-10">
        <header className="border-b border-cream-200 pb-7"><p className="eyebrow">Your account</p><h1 className="display-type mt-2 text-4xl font-black tracking-[-0.04em] text-primary sm:text-5xl">Your profile.</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">Add a photo and keep the name EmptyHanded uses across your dashboard up to date.</p></header>
        <ProfileForm displayName={displayName} email={user.email ?? ""} avatarUrl={avatarUrl} />
      </div>
    </div>
  );
}
