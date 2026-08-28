import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-[#efeeeb]">
      <Nav />
      <div className="flex-1 px-3 py-5 sm:px-8 sm:py-9">
        <main className="mx-auto max-w-[560px] rounded-[24px] border border-cream-200 bg-white px-5 py-7 shadow-[0_22px_52px_-24px_rgba(15,23,42,.28)] sm:rounded-[28px] sm:px-11 sm:py-8">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
