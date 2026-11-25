import React from "react";
import { Loader2 } from "lucide-react";

export type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary:
    "bg-stone-900 text-white hover:bg-stone-800 active:bg-stone-950 focus-visible:ring-stone-900/30 shadow-xs",
  secondary:
    "border border-stone-300 bg-white text-stone-800 hover:bg-stone-50 hover:border-stone-400 active:bg-stone-100 focus-visible:ring-stone-500/20",
  danger:
    "bg-rose-600 text-white hover:bg-rose-700 active:bg-rose-800 focus-visible:ring-rose-600/30 shadow-xs",
  ghost:
    "bg-transparent text-stone-600 hover:bg-stone-100 hover:text-stone-900 active:bg-stone-200 focus-visible:ring-stone-500/20",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-xs gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-lg",
  lg: "h-11 px-5 text-sm gap-2 rounded-lg",
};

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  disabled,
  type = "button",
  className = "",
  children,
  ...rest
}) => {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={[
        "inline-flex items-center justify-center font-medium transition-colors duration-150",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "cursor-pointer select-none",
        VARIANT_CLASSES[variant],
        SIZE_CLASSES[size],
        fullWidth ? "w-full" : "",
        className,
      ].join(" ")}
      {...rest}
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
      ) : (
        leftIcon && (
          <span className="inline-flex shrink-0 items-center" aria-hidden="true">
            {leftIcon}
          </span>
        )
      )}

      {children && <span>{children}</span>}

      {!isLoading && rightIcon && (
        <span className="inline-flex shrink-0 items-center" aria-hidden="true">
          {rightIcon}
        </span>
      )}
    </button>
  );
};
