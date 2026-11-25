import React from "react";

export type BadgeVariant =
  | "neutral"
  | "success"
  | "warning"
  | "danger"
  | "accent";
export type BadgeSize = "sm" | "md";

export interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  dot?: boolean;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-stone-100 text-stone-700 border-stone-200",
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-800 border-amber-200",
  danger: "bg-rose-50 text-rose-700 border-rose-200",
  accent: "bg-stone-900 text-stone-50 border-stone-900",
};

const DOT_CLASSES: Record<BadgeVariant, string> = {
  neutral: "bg-stone-500",
  success: "bg-emerald-500",
  warning: "bg-amber-500",
  danger: "bg-rose-500",
  accent: "bg-amber-400",
};

const SIZE_CLASSES: Record<BadgeSize, string> = {
  sm: "px-2 py-0.5 text-[11px]",
  md: "px-2.5 py-1 text-xs",
};

export const Badge: React.FC<BadgeProps> = ({
  variant = "neutral",
  size = "sm",
  dot = false,
  className = "",
  children,
}) => {
  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border font-medium leading-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        className,
      ].join(" ")}
    >
      {dot && (
        <span
          className={`h-1.5 w-1.5 rounded-full ${DOT_CLASSES[variant]}`}
          aria-hidden="true"
        />
      )}
      {children}
    </span>
  );
};
