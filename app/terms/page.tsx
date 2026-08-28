import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export const metadata: Metadata = { title: "Terms — EmptyHanded" };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-cream">
      <Nav />
      <main className="mx-auto max-w-3xl px-5 py-14 sm:px-8 sm:py-20">
        <p className="eyebrow">Legal</p>
        <h1 className="display-type mt-3 text-4xl font-black tracking-[-0.04em] text-primary sm:text-6xl">Terms of Service</h1>
        <p className="mt-4 text-sm text-primary-400">Last updated August 27, 2026</p>
        <div className="mt-10 space-y-8 text-sm leading-7 text-primary-600">
          <section><h2 className="text-lg font-bold text-primary">Using EmptyHanded</h2><p className="mt-2">EmptyHanded helps you organize occasions and discover gift ideas. You must provide accurate account information, keep your login secure, and use the service lawfully. You may not interfere with the service, misuse other users&apos; data, or attempt unauthorized access.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Free early access</h2><p className="mt-2">EmptyHanded is currently free during early access. We may introduce optional paid features later, but we will clearly explain any price and ask for your agreement before charging you. Using the free service does not enroll you in a paid subscription.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Recommendations and affiliate links</h2><p className="mt-2">Gift recommendations are suggestions, not guarantees of price, availability, suitability, delivery, or merchant performance. Some links are affiliate links, which may earn EmptyHanded a commission at no additional cost to you. Purchases are made directly with third-party merchants and are governed by their terms.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Your content</h2><p className="mt-2">You retain ownership of information you provide. You grant us permission to process it only as needed to operate, secure, improve, and support the service. Do not submit sensitive information that is unnecessary for gift recommendations.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Availability and liability</h2><p className="mt-2">The service is provided on an “as available” basis. To the fullest extent permitted by law, EmptyHanded is not liable for indirect, incidental, special, or consequential damages, or for third-party products and services. Nothing in these terms limits rights that cannot legally be limited.</p></section>
          <section><h2 className="text-lg font-bold text-primary">Changes and contact</h2><p className="mt-2">We may update the service or these terms. Material changes will be communicated through the service or by email when appropriate. Questions can be sent to <a className="font-semibold text-accent-700 underline" href="mailto:hello@emptyhanded.app">hello@emptyhanded.app</a>.</p></section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
