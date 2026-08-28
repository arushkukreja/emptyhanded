import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({ label, className = "", id, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-2 block text-xs font-bold tracking-[0.04em] text-primary">{label}</span>}
    <input
      ref={ref}
      id={id}
      {...props}
      className={`focus-ring w-full rounded-xl border border-cream-200 bg-cream px-4 py-3 text-sm text-primary placeholder:text-primary-400 transition ${className}`}
    />
  </label>
));
Input.displayName = "Input";

export default Input;
