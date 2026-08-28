"use client";

import { Children, useRef, useState, type ReactNode } from "react";

export default function DashboardSwipeCards({ labels, children }: { labels: string[]; children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setActive(index);
    scroller.scrollTo({ left: scroller.clientWidth * index, behavior: "smooth" });
  }

  return (
    <section className="mt-8" aria-label="Dashboard overview">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div className="flex rounded-full border border-cream-200 bg-white p-1 shadow-sm" role="tablist" aria-label="Dashboard view">
          {labels.map((label, index) => (
            <button
              key={label}
              type="button"
              role="tab"
              aria-selected={active === index}
              onClick={() => goTo(index)}
              className={`rounded-full px-4 py-2 text-xs font-bold transition ${active === index ? "bg-primary text-white" : "text-primary-400 hover:text-primary"}`}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="hidden text-xs font-semibold text-primary-400 sm:block">Swipe to review your calendar</p>
      </div>
      <div
        ref={scrollerRef}
        onScroll={event => {
          const width = event.currentTarget.clientWidth;
          if (width) setActive(Math.round(event.currentTarget.scrollLeft / width));
        }}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {Children.map(children, child => <div className="w-full shrink-0 snap-start">{child}</div>)}
      </div>
    </section>
  );
}
