import { ButtonHTMLAttributes, forwardRef } from "react";

type Variant = "primary" | "accent" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-primary-800 shadow-sm hover:shadow-soft",
  accent: "bg-accent text-primary hover:bg-accent-400 shadow-sm hover:shadow-[0_12px_28px_-10px_rgba(245,158,11,.7)]",
  ghost: "bg-transparent text-primary-600 hover:bg-primary-100 hover:text-primary",
  danger: "bg-red-50 text-red-700 border border-red-100 hover:bg-red-600 hover:text-white"
};

const sizes: Record<Size, string> = {
  sm: "px-3.5 py-2 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-[15px]"
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", ...props }, ref) => (
    <button
      ref={ref}
      {...props}
      className={`rounded-full font-semibold transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    />
  )
);
Button.displayName = "Button";

export default Button;
