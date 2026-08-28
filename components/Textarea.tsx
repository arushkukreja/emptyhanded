import { TextareaHTMLAttributes, forwardRef } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ label, className = "", ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-2 block text-xs font-bold tracking-[0.04em] text-primary">{label}</span>}
    <textarea
      ref={ref}
      {...props}
      className={`focus-ring min-h-[108px] w-full rounded-xl border border-cream-200 bg-cream px-4 py-3 text-sm leading-relaxed text-primary placeholder:text-primary-400 transition ${className}`}
    />
  </label>
));
Textarea.displayName = "Textarea";

export default Textarea;
