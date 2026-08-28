"use client";

import Image from "next/image";
import { useEffect, useState, useTransition, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Camera, Check, Save } from "lucide-react";
import { ARCHETYPES, BUDGET_TIERS, OCCASIONS, RELATIONSHIPS, type OccasionType } from "@/lib/occasions";
import { updateEventProfile, uploadRecipientPhoto } from "../../actions";

type EventData = {
  id: string;
  recipient_name: string;
  occasion_type: string;
  event_date: string;
};

type ProfileData = {
  relationship: string | null;
  age: number | null;
  gender: string | null;
  archetypes: string[];
  interests: string | null;
  budget_tier: string | null;
  past_gifts: string | null;
  avatar_path: string | null;
};

const labelClass = "text-xs font-bold uppercase tracking-[0.12em] text-primary-400";
const inputClass = "mt-2 w-full rounded-2xl border border-cream-200 bg-white px-4 py-3.5 text-sm font-semibold text-primary outline-none transition placeholder:text-primary-300 focus:border-accent focus:ring-4 focus:ring-accent/10";

export default function EditEventForm({ event, profile, avatarUrl }: { event: EventData; profile: ProfileData; avatarUrl: string | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [recipientName, setRecipientName] = useState(event.recipient_name);
  const [occasion, setOccasion] = useState(event.occasion_type);
  const [eventDate, setEventDate] = useState(event.event_date);
  const [relationship, setRelationship] = useState(profile.relationship ?? "");
  const [age, setAge] = useState(profile.age?.toString() ?? "");
  const [gender, setGender] = useState(profile.gender ?? "");
  const [archetypes, setArchetypes] = useState<string[]>(profile.archetypes ?? []);
  const [interests, setInterests] = useState(profile.interests ?? "");
  const [budgetTier, setBudgetTier] = useState(profile.budget_tier ?? "");
  const [pastGifts, setPastGifts] = useState(profile.past_gifts ?? "");
  const [recipientPhoto, setRecipientPhoto] = useState<File | null>(null);
  const [recipientPhotoPreview, setRecipientPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (recipientPhotoPreview) URL.revokeObjectURL(recipientPhotoPreview);
    };
  }, [recipientPhotoPreview]);

  function toggleCategory(category: string) {
    setArchetypes(current => current.includes(category) ? current.filter(item => item !== category) : [...current, category]);
  }

  function onSubmit(formEvent: FormEvent) {
    formEvent.preventDefault();
    setError(null);
    startTransition(async () => {
      let avatarPath = profile.avatar_path ?? undefined;
      if (recipientPhoto) {
        const formData = new FormData();
        formData.set("photo", recipientPhoto);
        const upload = await uploadRecipientPhoto(formData);
        if ("error" in upload && upload.error) {
          setError(upload.error);
          return;
        }
        if ("path" in upload) avatarPath = upload.path;
      }

      const result = await updateEventProfile(event.id, {
        recipient_name: recipientName,
        occasion_type: occasion as OccasionType,
        event_date: eventDate,
        relationship: relationship || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        archetypes,
        interests: interests || undefined,
        budget_tier: budgetTier || undefined,
        past_gifts: pastGifts || undefined,
        avatar_path: avatarPath
      });
      if (result.error) {
        setError(result.error);
        return;
      }
      router.push(`/events/${event.id}`);
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-6">
      <section className="grid gap-5 rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:grid-cols-2 sm:p-7">
        <div className="flex items-center gap-4 sm:col-span-2">
          <div className="relative flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-xl font-black text-accent">
            {(recipientPhotoPreview || avatarUrl) ? <Image src={recipientPhotoPreview || avatarUrl || ""} alt={recipientName} fill unoptimized={Boolean(recipientPhotoPreview)} className="object-cover" /> : (recipientName.trim().slice(0, 1).toUpperCase() || <Camera size={24} />)}
          </div>
          <div className="min-w-0 flex-1">
            <p className={labelClass}>Recipient photo</p>
            <p className="mt-1 text-sm leading-6 text-primary-500">JPG, PNG, or WebP up to 5 MB.</p>
          </div>
          <label className="cursor-pointer rounded-full border border-primary-200 px-4 py-2.5 text-xs font-bold text-primary transition hover:border-accent hover:bg-accent-50">
            {avatarUrl ? "Change" : "Add photo"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={inputEvent => {
                const file = inputEvent.target.files?.[0] ?? null;
                setRecipientPhoto(file);
                setRecipientPhotoPreview(current => {
                  if (current) URL.revokeObjectURL(current);
                  return file ? URL.createObjectURL(file) : null;
                });
              }}
            />
          </label>
        </div>
        <label><span className={labelClass}>Recipient name</span><input required maxLength={100} value={recipientName} onChange={e => setRecipientName(e.target.value)} className={inputClass} /></label>
        <label><span className={labelClass}>Age</span><input type="number" inputMode="numeric" min="0" max="120" step="1" value={age} onChange={e => setAge(e.target.value)} placeholder="For example, 32" className={inputClass} /></label>
        <label><span className={labelClass}>Occasion</span><select value={occasion} onChange={e => setOccasion(e.target.value)} className={inputClass}>{OCCASIONS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label><span className={labelClass}>Date</span><input required type="date" value={eventDate} onChange={e => setEventDate(e.target.value)} className={inputClass} /></label>
        <label><span className={labelClass}>Relationship</span><select value={relationship} onChange={e => setRelationship(e.target.value)} className={inputClass}><option value="">Not specified</option>{RELATIONSHIPS.map(item => <option key={item} value={item}>{item}</option>)}</select></label>
        <label><span className={labelClass}>Pronouns</span><input value={gender} onChange={e => setGender(e.target.value)} placeholder="For example, she/her" className={inputClass} /></label>
      </section>

      <section className="rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:p-7">
        <div>
          <p className={labelClass}>Interest categories</p>
          <h2 className="display-type mt-2 text-2xl font-bold text-primary">What fits {recipientName.split(" ")[0] || "them"}?</h2>
          <p className="mt-2 text-sm leading-6 text-primary-500">Recommendations prioritize products matching both these categories and their age.</p>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
          {ARCHETYPES.map(item => {
            const selected = archetypes.includes(item);
            return <button key={item} type="button" onClick={() => toggleCategory(item)} className={`flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left text-sm font-semibold transition ${selected ? "border-accent bg-accent-100 text-accent-700" : "border-cream-200 bg-white text-primary hover:border-accent"}`}><span>{item}</span>{selected && <Check size={16} />}</button>;
          })}
        </div>
      </section>

      <section className="grid gap-5 rounded-[24px] border border-cream-200 bg-white p-5 shadow-soft sm:grid-cols-2 sm:p-7">
        <label className="sm:col-span-2"><span className={labelClass}>Specific interests</span><textarea rows={4} value={interests} onChange={e => setInterests(e.target.value)} placeholder="Rituals, hobbies, favorite places, or current obsessions" className={`${inputClass} resize-y font-normal leading-6`} /></label>
        <label><span className={labelClass}>Budget</span><select value={budgetTier} onChange={e => setBudgetTier(e.target.value)} className={inputClass}><option value="">Not specified</option>{BUDGET_TIERS.map(item => <option key={item.value} value={item.value}>{item.label}</option>)}</select></label>
        <label><span className={labelClass}>Past gifts</span><textarea rows={3} value={pastGifts} onChange={e => setPastGifts(e.target.value)} placeholder="Things you have already given" className={`${inputClass} resize-y font-normal leading-6`} /></label>
      </section>

      {error && <p role="alert" className="rounded-2xl bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-50"><Save size={16} className="text-accent" />{pending ? "Saving…" : "Save profile"}</button>
      </div>
    </form>
  );
}
