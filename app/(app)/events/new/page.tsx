"use client";

import Image from "next/image";
import { useEffect, useState, useTransition, type FormEvent, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Camera, Check, Sparkles } from "lucide-react";
import { ARCHETYPES, BUDGET_TIERS, OCCASIONS, RELATIONSHIPS, type OccasionType } from "@/lib/occasions";
import { createEvent, uploadRecipientPhoto } from "../actions";
import { createClient as createBrowserClient } from "@/lib/supabase/client";

const TOTAL_STEPS = 10;
const optionClass = "rounded-xl border px-3.5 py-3.5 text-left text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 sm:rounded-2xl sm:px-5";
const fieldClass = "w-full border-0 border-b-2 border-primary-200 bg-transparent px-0 py-4 text-xl font-semibold text-primary outline-none transition placeholder:text-primary-300 focus:border-accent min-[390px]:text-2xl sm:text-3xl";

export default function NewEventPage() {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [step, setStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [occasion, setOccasion] = useState("birthday");
  const [eventDate, setEventDate] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [relationship, setRelationship] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [archetypes, setArchetypes] = useState<string[]>([]);
  const [interests, setInterests] = useState("");
  const [budgetTier, setBudgetTier] = useState("");
  const [pastGifts, setPastGifts] = useState("");
  const [recipientPhoto, setRecipientPhoto] = useState<File | null>(null);
  const [recipientPhotoPreview, setRecipientPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (recipientPhotoPreview) URL.revokeObjectURL(recipientPhotoPreview);
    };
  }, [recipientPhotoPreview]);

  const firstName = recipientName.trim().split(" ")[0] || "them";
  const canContinue = step === 1 ? recipientName.trim().length > 0 : step === 2 ? eventDate.length > 0 : true;

  function toggleArchetype(value: string) {
    setArchetypes(current => current.includes(value) ? current.filter(item => item !== value) : [...current, value]);
  }

  function goBack() {
    setError(null);
    if (step === 0) router.back();
    else setStep(current => current - 1);
  }

  function submitEvent() {
    setError(null);
    start(async () => {
      const { data: { session } } = await createBrowserClient().auth.getSession();
      if (!session) {
        router.push("/recommendations");
        return;
      }

      let avatarPath: string | undefined;
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

      const result = await createEvent({
        occasion_type: occasion as OccasionType,
        event_date: eventDate,
        recipient_name: recipientName,
        relationship: relationship || undefined,
        age: age ? Number(age) : undefined,
        gender: gender || undefined,
        archetypes,
        interests: interests || undefined,
        budget_tier: budgetTier || undefined,
        past_gifts: pastGifts || undefined,
        avatar_path: avatarPath
      });
      if ("error" in result && result.error) {
        setError(result.error);
        return;
      }
      if ("id" in result) router.push(`/events/${result.id}`);
    });
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!canContinue) return;
    if (step < TOTAL_STEPS - 1) {
      setStep(current => current + 1);
      return;
    }
    submitEvent();
  }

  function question() {
    switch (step) {
      case 0:
        return (
          <Question number="01" title="What are we celebrating?" helper="Choose the occasion so we can time the reminder and shape the gift ideas.">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {OCCASIONS.map(item => <button key={item.value} type="button" onClick={() => setOccasion(item.value)} className={`${optionClass} ${occasion === item.value ? "border-primary bg-primary text-white shadow-soft" : "border-cream-200 bg-white text-primary hover:border-accent hover:bg-accent-50"}`}><span className="block text-base">{item.label}</span></button>)}
            </div>
          </Question>
        );
      case 1:
        return (
          <Question number="02" title="Who is this for?" helper="Their first name is enough. Add a last name if it helps you keep people organized.">
            <label className="sr-only" htmlFor="recipient-name">Recipient name</label>
            <input id="recipient-name" autoFocus required value={recipientName} onChange={event => setRecipientName(event.target.value)} placeholder="Type their name..." className={fieldClass} />
            <div className="mt-6 flex items-center gap-4 rounded-2xl border border-cream-200 bg-white p-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-primary text-lg font-black text-accent">
                {recipientPhotoPreview ? <Image src={recipientPhotoPreview} alt="Recipient preview" fill unoptimized className="object-cover" /> : (recipientName.trim().slice(0, 1).toUpperCase() || <Camera size={22} />)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-primary">Add a photo</p>
                <p className="mt-1 text-xs leading-5 text-primary-400">Optional. JPG, PNG, or WebP up to 5 MB.</p>
              </div>
              <label className="cursor-pointer rounded-full border border-primary-200 px-4 py-2 text-xs font-bold text-primary transition hover:border-accent hover:bg-accent-50">
                Choose
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="sr-only"
                  onChange={event => {
                    const file = event.target.files?.[0] ?? null;
                    setRecipientPhoto(file);
                    setRecipientPhotoPreview(current => {
                      if (current) URL.revokeObjectURL(current);
                      return file ? URL.createObjectURL(file) : null;
                    });
                  }}
                />
              </label>
            </div>
          </Question>
        );
      case 2:
        return (
          <Question number="03" title={`When is ${firstName}'s occasion?`} helper="We’ll use this date to send your reminder with enough time to choose well.">
            <label className="sr-only" htmlFor="event-date">Occasion date</label>
            <input id="event-date" autoFocus required type="date" min={new Date().toISOString().slice(0, 10)} value={eventDate} onChange={event => setEventDate(event.target.value)} className={`${fieldClass} max-w-md`} />
          </Question>
        );
      case 3:
        return (
          <Question number="04" title={`How do you know ${firstName}?`} helper="This helps us get the tone of the gift right.">
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">{RELATIONSHIPS.map(item => <button key={item} type="button" onClick={() => setRelationship(item)} className={`${optionClass} ${relationship === item ? "border-primary bg-primary text-white" : "border-cream-200 bg-white text-primary hover:border-accent"}`}>{item}</button>)}</div>
          </Question>
        );
      case 4:
        return (
          <Question number="05" title={`How old is ${firstName}?`} helper="Enter one number. We use their exact age together with their interests to improve the matches—and you can skip this if you’re unsure.">
            <label className="sr-only" htmlFor="recipient-age">Age</label>
            <input id="recipient-age" autoFocus type="number" inputMode="numeric" min="0" max="120" step="1" value={age} onChange={event => setAge(event.target.value)} placeholder="For example, 32" className={`${fieldClass} max-w-xs`} />
          </Question>
        );
      case 5:
        return (
          <Question number="06" title={`What pronouns does ${firstName} use?`} helper="Optional. This only helps us write more natural recommendations.">
            <label className="sr-only" htmlFor="gender">Pronouns</label>
            <input id="gender" autoFocus value={gender} onChange={event => setGender(event.target.value)} placeholder="For example, she/her" className={fieldClass} />
          </Question>
        );
      case 6:
        return (
          <Question number="07" title={`Which interest categories fit ${firstName}?`} helper={`Choose all that apply. We match these categories together with age${archetypes.length ? ` — ${archetypes.length} selected` : ""}.`}>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">{ARCHETYPES.map(item => <button key={item} type="button" onClick={() => toggleArchetype(item)} className={`${optionClass} flex items-center justify-between gap-2 ${archetypes.includes(item) ? "border-accent bg-accent-100 text-accent-700" : "border-cream-200 bg-white text-primary hover:border-accent"}`}><span>{item}</span>{archetypes.includes(item) && <Check size={17} className="shrink-0" />}</button>)}</div>
          </Question>
        );
      case 7:
        return (
          <Question number="08" title={`What does ${firstName} genuinely enjoy?`} helper="Specific details make the best picks: rituals, hobbies, favorite places, or current obsessions.">
            <label className="sr-only" htmlFor="interests">Interests</label>
            <textarea id="interests" autoFocus rows={4} value={interests} onChange={event => setInterests(event.target.value)} placeholder="Makes pour-over every morning, collects jazz records..." className={`${fieldClass} resize-none leading-relaxed`} />
          </Question>
        );
      case 8:
        return (
          <Question number="09" title="What feels comfortable to spend?" helper="We’ll keep every recommendation inside your range.">
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{BUDGET_TIERS.map(item => <button key={item.value} type="button" onClick={() => setBudgetTier(item.value)} className={`${optionClass} min-h-20 ${budgetTier === item.value ? "border-primary bg-primary text-white" : "border-cream-200 bg-white text-primary hover:border-accent"}`}><span className="display-type block text-xl font-bold">{item.label}</span></button>)}</div>
          </Question>
        );
      default:
        return (
          <Question number="10" title={`Anything you've already given ${firstName}?`} helper="Optional. We’ll avoid repeats and use past wins as a clue.">
            <label className="sr-only" htmlFor="past-gifts">Past gifts</label>
            <textarea id="past-gifts" autoFocus rows={4} value={pastGifts} onChange={event => setPastGifts(event.target.value)} placeholder="A cookbook they loved, concert tickets, a candle..." className={`${fieldClass} resize-none leading-relaxed`} />
          </Question>
        );
    }
  }

  return (
    <main className="mx-auto flex min-h-[calc(100svh-64px)] max-w-4xl flex-col px-4 py-6 min-[390px]:px-5 sm:min-h-[calc(100svh-72px)] sm:px-8 sm:py-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="eyebrow">Add someone new</p>
          <p className="mt-1 text-xs text-primary-400">One thoughtful detail at a time.</p>
        </div>
        <p className="text-xs font-bold tabular-nums text-primary-400">{String(step + 1).padStart(2, "0")} / {TOTAL_STEPS}</p>
      </div>
      <div className="mt-5 h-1 overflow-hidden rounded-full bg-cream-200" aria-label={`Step ${step + 1} of ${TOTAL_STEPS}`}><span className="block h-full rounded-full bg-accent transition-[width] duration-500" style={{ width: `${((step + 1) / TOTAL_STEPS) * 100}%` }} /></div>

      <form onSubmit={handleSubmit} className="flex flex-1 flex-col justify-between py-5 sm:py-8">
        <div key={step} className="animate-fade-up">{question()}</div>

        <div className="mt-10">
          {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-medium text-red-700">{error}</p>}
          <div className="flex items-center justify-between gap-3 border-t border-cream-200 pt-5 sm:gap-4 sm:pt-6">
            <button type="button" onClick={goBack} className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-primary-500 transition hover:bg-white hover:text-primary"><ArrowLeft size={16} /> {step === 0 ? "Cancel" : "Back"}</button>
            <div className="flex items-center gap-3">
              {step > 2 && step < TOTAL_STEPS - 1 && <span className="hidden text-xs text-primary-400 sm:block">Optional — you can continue</span>}
              <button type="submit" disabled={!canContinue || pending} className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:bg-primary-800 disabled:cursor-not-allowed disabled:opacity-40 sm:px-6 sm:py-3.5">
                {step === TOTAL_STEPS - 1 ? <><Sparkles size={16} className="text-accent" /> {pending ? "Finding thoughtful gifts..." : "Generate gift ideas"}</> : <>Continue <ArrowRight size={16} /></>}
              </button>
            </div>
          </div>
        </div>
      </form>
    </main>
  );
}

function Question({ number, title, helper, children }: { number: string; title: string; helper: string; children: ReactNode }) {
  return (
    <section className="mx-auto w-full max-w-3xl">
      <p className="text-xs font-extrabold tracking-[0.16em] text-accent-700">{number} →</p>
      <h1 className="display-type mt-3 text-3xl font-black leading-[1.04] tracking-[-0.04em] text-primary min-[390px]:text-4xl sm:text-5xl">{title}</h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-primary-500 sm:text-base">{helper}</p>
      <div className="mt-6">{children}</div>
    </section>
  );
}
