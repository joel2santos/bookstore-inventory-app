import React from "react";

export type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "subtitle"
  | "body"
  | "caption"
  | "label"
  | "mono";

export type TextTone = "default" | "muted" | "accent" | "danger" | "success";

export interface TextProps {
  variant?: TextVariant;
  tone?: TextTone;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

const VARIANT_CLASSES: Record<TextVariant, string> = {
  h1: "text-2xl font-semibold tracking-tight sm:text-3xl",
  h2: "text-lg font-semibold tracking-tight sm:text-xl",
  h3: "text-base font-semibold tracking-tight",
  subtitle: "text-sm font-medium",
  body: "text-sm leading-relaxed",
  caption: "text-xs leading-normal",
  label: "text-xs font-medium uppercase tracking-wider",
  mono: "font-mono text-xs tabular-nums",
};

const TONE_CLASSES: Record<TextTone, string> = {
  default: "text-stone-900",
  muted: "text-stone-500",
  accent: "text-amber-700",
  danger: "text-rose-600",
  success: "text-emerald-700",
};

const DEFAULT_ELEMENT: Record<TextVariant, React.ElementType> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  subtitle: "p",
  body: "p",
  caption: "span",
  label: "span",
  mono: "span",
};

export const Text: React.FC<TextProps> = ({
  variant = "body",
  tone = "default",
  as,
  className = "",
  children,
}) => {
  const Component = as ?? DEFAULT_ELEMENT[variant];

  return (
    <Component
      className={`${VARIANT_CLASSES[variant]} ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </Component>
  );
};
