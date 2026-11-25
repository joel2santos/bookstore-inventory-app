import React from "react";
import { BookOpen } from "lucide-react";
import { Button, Text } from "../atoms";

export interface EmptyStateProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-500">
        {icon ?? <BookOpen className="h-5 w-5" aria-hidden="true" />}
      </div>
      <Text variant="h3" className="mt-4">
        {title}
      </Text>
      <Text variant="body" tone="muted" className="mt-1 max-w-sm">
        {description}
      </Text>
      {actionLabel && onAction && (
        <Button variant="secondary" size="sm" className="mt-5" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
