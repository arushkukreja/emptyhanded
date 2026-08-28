import { SelectHTMLAttributes, forwardRef } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(({ label, className = "", children, ...props }, ref) => (
  <label className="block">
    {label && <span className="mb-2 block text-xs font-bold tracking-[0.04em] text-primary">{label}</span>}
    <select
      ref={ref}
      {...props}
      className={`focus-ring w-full rounded-xl border border-cream-200 bg-cream px-4 py-3 text-sm text-primary transition ${className}`}
    >
      {children}
    </select>
  </label>
));
Select.displayName = "Select";

export default Select;
