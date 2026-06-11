"use client";

import { forwardRef } from "react";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger" | "icon";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-(--color-primary) text-white hover:bg-(--color-primary-hover) border border-transparent",
  accent:
    "bg-(--color-accent) text-white hover:bg-(--color-accent-hover) border border-transparent",
  secondary:
    "bg-(--color-surface) text-(--color-text) hover:bg-(--color-surface-soft) border border-(--color-border)",
  ghost:
    "bg-transparent text-(--color-text) hover:bg-(--color-surface-soft) border border-transparent",
  danger:
    "bg-(--color-danger) text-white hover:opacity-90 border border-transparent",
  icon:
    "bg-transparent text-(--color-text) hover:bg-(--color-surface-soft) border border-transparent",
};

const sizeClasses: Record<Size, string> = {
  sm: "h-7 px-3 text-xs gap-1.5",
  md: "h-[34px] px-4 text-sm gap-2",
  lg: "h-10 px-5 text-sm gap-2",
};

const iconSizeClasses: Record<Size, string> = {
  sm: "h-7 w-7",
  md: "h-[34px] w-[34px]",
  lg: "h-10 w-10",
};

function Spinner() {
  return (
    <svg
      className="animate-spin"
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
    >
      <circle
        cx="7"
        cy="7"
        r="5.5"
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeWidth="2"
      />
      <path
        d="M7 1.5A5.5 5.5 0 0 1 12.5 7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      variant = "primary",
      size = "md",
      loading = false,
      disabled = false,
      children,
      className = "",
      ...props
    },
    ref
  ) {
    const isDisabled = disabled || loading;
    const isIcon = variant === "icon";
    const sizeClass = isIcon ? iconSizeClasses[size] : sizeClasses[size];

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        aria-busy={loading}
        className={[
          "inline-flex items-center justify-center font-medium rounded-(--radius-ctrl) transition-colors duration-150 cursor-pointer select-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2",
          variantClasses[variant],
          sizeClass,
          isDisabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
          className,
        ]
          .filter(Boolean)
          .join(" ")}
        {...props}
      >
        {loading && <Spinner />}
        {children}
      </button>
    );
  }
);
