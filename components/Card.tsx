import { HTMLAttributes } from "react";

export default function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`bg-white rounded-2xl shadow-soft border border-cream-200 ${className}`}
    />
  );
}
