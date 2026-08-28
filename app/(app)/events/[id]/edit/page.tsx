import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getPrivateProfileImageUrl } from "@/lib/media";
import EditEventForm from "./EditEventForm";

export const dynamic = "force-dynamic";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const [{ data: event }, { data: profile }] = await Promise.all([
    supabase.from("events").select("id, recipient_name, occasion_type, event_date").eq("id", id).maybeSingle(),
    supabase.from("recipient_profiles").select("relationship, age, gender, archetypes, interests, budget_tier, past_gifts, avatar_path").eq("event_id", id).maybeSingle()
  ]);

  if (!event || !profile) notFound();
  const avatarUrl = await getPrivateProfileImageUrl(profile.avatar_path);

  return (
    <div className="min-h-screen bg-[#fbfaf7] pb-24">
      <div className="mx-auto max-w-5xl px-4 py-8 min-[390px]:px-5 sm:px-8 sm:py-10">
        <Link href={`/events/${id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-primary-500 transition hover:text-primary">
          <ArrowLeft size={16} /> Back to gift plan
        </Link>
        <header className="mt-7 border-b border-cream-200 pb-7">
          <p className="eyebrow">Recipient profile</p>
          <h1 className="display-type mt-2 text-4xl font-black tracking-[-0.04em] text-primary sm:text-5xl">Edit {event.recipient_name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500">Keep their details current, then regenerate the gift list to use the updated age and interest categories.</p>
        </header>
        <EditEventForm event={event} profile={profile} avatarUrl={avatarUrl} />
      </div>
    </div>
  );
}
