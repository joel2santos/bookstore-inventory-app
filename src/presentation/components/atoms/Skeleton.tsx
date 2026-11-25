import React from "react";

export type SkeletonVariant = "text" | "rect" | "circle";

export interface SkeletonProps {
  variant?: SkeletonVariant;
  className?: string;
}

const VARIANT_CLASSES: Record<SkeletonVariant, string> = {
  text: "h-4 rounded",
  rect: "rounded-lg",
  circle: "rounded-full",
};

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = "rect",
  className = "",
}) => {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse bg-stone-200/80 ${VARIANT_CLASSES[variant]} ${className}`}
    />
  );
};
