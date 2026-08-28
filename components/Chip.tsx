"use client";

interface ChipProps {
  label: string;
  selected: boolean;
  onToggle: () => void;
}

export default function Chip({ label, selected, onToggle }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={`rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
        selected
          ? "border-accent bg-accent-100 text-accent-700 shadow-sm"
          : "border-cream-200 bg-white text-primary-600 hover:border-accent hover:text-accent-700"
      }`}
    >
      {label}
    </button>
  );
}
