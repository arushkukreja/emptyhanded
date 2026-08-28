"use client";

import Image from "next/image";
import { useActionState, useEffect, useState } from "react";
import { Camera, Save } from "lucide-react";
import { updateOwnProfile, type ProfileFormState } from "./actions";

const initialState: ProfileFormState = { ok: false, message: "" };

export default function ProfileForm({ displayName, email, avatarUrl }: { displayName: string; email: string; avatarUrl: string | null }) {
  const [state, action, pending] = useActionState(updateOwnProfile, initialState);
  const [preview, setPreview] = useState<string | null>(null);
  const shownAvatar = preview || avatarUrl;

  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);

  function onImageChange(file?: File) {
    if (preview) URL.revokeObjectURL(preview);
    setPreview(file ? URL.createObjectURL(file) : null);
  }

  return (
    <form action={action} className="mt-8 rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:p-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <label className="group relative h-28 w-28 shrink-0 cursor-pointer overflow-hidden rounded-full border-4 border-cream-100 bg-accent-100 shadow-soft">
          {shownAvatar ? <Image src={shownAvatar} alt="Your profile" fill sizes="112px" unoptimized={Boolean(preview)} className="object-cover" /> : <span className="grid h-full place-items-center text-3xl font-black text-accent-700">{displayName.split(/\s+/).map(part => part[0]).slice(0, 2).join("").toUpperCase()}</span>}
          <span className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-1 bg-primary/80 py-2 text-[10px] font-bold text-white"><Camera size={12} /> Change</span>
          <input name="image" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={event => onImageChange(event.target.files?.[0])} />
        </label>
        <div className="grid min-w-0 flex-1 gap-5 sm:grid-cols-2">
          <label><span className="text-xs font-bold uppercase tracking-[0.12em] text-primary-400">Your name</span><input name="display_name" required defaultValue={displayName} className="mt-2 h-12 w-full rounded-xl border border-cream-200 px-4 text-sm font-semibold text-primary outline-none focus:border-accent focus:ring-4 focus:ring-accent/10" /></label>
          <label><span className="text-xs font-bold uppercase tracking-[0.12em] text-primary-400">Email</span><input value={email} disabled className="mt-2 h-12 w-full rounded-xl border border-cream-200 bg-cream-50 px-4 text-sm font-semibold text-primary-400" /></label>
        </div>
      </div>
      {state.message && <p role="status" className={`mt-5 rounded-xl p-3 text-sm font-semibold ${state.ok ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{state.message}</p>}
      <div className="mt-6 flex justify-end"><button disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-primary-800 disabled:opacity-50"><Save size={16} className="text-accent" />{pending ? "Saving…" : "Save profile"}</button></div>
    </form>
  );
}
