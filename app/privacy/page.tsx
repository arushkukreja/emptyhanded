import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Privacy — EmptyHanded" };

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="display-type mt-3 text-4xl font-black tracking-[-0.04em] text-primary sm:text-6xl">Privacy Policy</h1>
        <p className="mt-4 text-sm text-primary-400">Last updated August 27, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-primary-600">
          <section><h2 className="text-lg font-bold text-primary">Information we collect</h2><p className="mt-2">We collect account details such as your name and email, occasion and recipient information you choose to enter, saved recommendations, and basic technical data needed to operate and secure the service.</p></section>
          <section><h2 className="text-lg font-bold text-primary">How we use information</h2><p className="mt-2">We use information to authenticate you, provide recommendations, save your calendar, send requested reminders and account messages, prevent abuse, troubleshoot problems, and understand whether the product is useful.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Service providers</h2><p className="mt-2">We use service providers including Supabase for authentication and data storage, Vercel for hosting, Resend for email delivery, and Google&apos;s Gemini service to generate recommendations. These providers process data on our behalf under their own security and privacy commitments.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Recipient information and AI</h2><p className="mt-2">Only enter recipient details you are comfortable using for gift recommendations. Relevant profile details may be sent to the recommendation provider to generate results. Avoid entering sensitive personal, financial, health, or identification information.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Cookies and retention</h2><p className="mt-2">We use essential cookies to keep you signed in and protect your session. We retain account and product data while your account is active and as reasonably needed for security, legal, and operational purposes. You may request deletion, subject to records we are legally required to keep.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Your choices</h2><p className="mt-2">You can unsubscribe from promotional emails and request access, correction, or deletion of your personal information. Account and security emails may still be sent when necessary to provide the service.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Children and contact</h2><p className="mt-2">EmptyHanded is not directed to children under 13. If you have a privacy question or request, contact <a className="font-semibold text-accent-700 underline" href="mailto:hello@emptyhanded.app">hello@emptyhanded.app</a>.</p></section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
