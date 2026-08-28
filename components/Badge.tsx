import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "default" | "accent" | "warn" | "urgent";
}

const tones: Record<NonNullable<BadgeProps["tone"]>, string> = {
  default: "bg-primary-100 text-primary-600",
  accent: "bg-accent-100 text-accent-700 border border-accent-200",
  warn: "bg-amber-100 text-amber-800",
  urgent: "bg-red-100 text-red-700"
};

export default function Badge({ tone = "default", className = "", ...props }: BadgeProps) {
  return (
    <span
      {...props}
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-bold ${tones[tone]} ${className}`}
    />
  );
}
