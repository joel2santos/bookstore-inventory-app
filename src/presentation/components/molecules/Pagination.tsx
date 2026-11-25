import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Text } from "../atoms";

export interface PaginationProps {
  page: number;
  totalCount: number;
  pageSize?: number;
  hasNext: boolean;
  hasPrevious: boolean;
  isLoading?: boolean;
  onPageChange: (nextPage: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  page,
  totalCount,
  pageSize = 10,
  hasNext,
  hasPrevious,
  isLoading = false,
  onPageChange,
}) => {
  if (totalCount === 0) return null;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col items-center justify-between gap-3 border-t border-stone-200 pt-4 sm:flex-row"
    >
      <Text variant="caption" tone="muted">
        Showing <span className="font-medium text-stone-800">{startItem}</span>
        –<span className="font-medium text-stone-800">{endItem}</span> of{" "}
        <span className="font-medium text-stone-800">{totalCount}</span> books
      </Text>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          leftIcon={<ChevronLeft className="h-4 w-4" />}
          disabled={!hasPrevious || isLoading}
          onClick={() => onPageChange(page - 1)}
        >
          Previous
        </Button>

        <Text variant="caption" tone="muted" className="px-2 tabular-nums">
          Page <span className="font-medium text-stone-900">{page}</span> of{" "}
          {totalPages}
        </Text>

        <Button
          variant="secondary"
          size="sm"
          rightIcon={<ChevronRight className="h-4 w-4" />}
          disabled={!hasNext || isLoading}
          onClick={() => onPageChange(page + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
};
