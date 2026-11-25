import React from "react";
import { ArrowUpRight, Pencil, Trash2 } from "lucide-react";
import type { Book } from "@domain";
import { Badge, Button, Skeleton, Text } from "../atoms";

export interface BookCardProps {
  book: Book;
  index?: number;
  lowStockThreshold?: number;
  onView: (book: Book) => void;
  onEdit: (book: Book) => void;
  onDelete: (book: Book) => void;
}

function getStockBadge(quantity: number, threshold: number) {
  if (quantity === 0) {
    return { label: "Out of stock", variant: "danger" as const };
  }
  if (quantity <= threshold) {
    return { label: `Low stock · ${quantity}`, variant: "warning" as const };
  }
  return { label: `${quantity} in stock`, variant: "success" as const };
}

export const BookCard: React.FC<BookCardProps> = ({
  book,
  index = 0,
  lowStockThreshold = 10,
  onView,
  onEdit,
  onDelete,
}) => {
  const stockBadge = getStockBadge(book.stockQuantity, lowStockThreshold);

  return (
    <article
      style={{ animationDelay: `${Math.min(index * 40, 320)}ms` }}
      className="group flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5 transition-all duration-200 hover:border-stone-300 hover:shadow-sm animate-fade-in"
    >
      <div>
        <div className="flex items-start justify-between gap-2">
          <Badge variant="neutral" size="sm">
            {book.category}
          </Badge>
          <Badge variant={stockBadge.variant} size="sm" dot>
            {stockBadge.label}
          </Badge>
        </div>

        <button
          type="button"
          onClick={() => onView(book)}
          className="mt-3.5 block w-full text-left focus:outline-none"
        >
          <Text
            variant="h3"
            className="line-clamp-2 transition-colors group-hover:text-amber-800"
          >
            {book.title}
          </Text>
          <Text variant="body" tone="muted" className="mt-0.5 line-clamp-1">
            {book.author}
          </Text>
        </button>

        <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
          <Text variant="mono" tone="muted">
            ISBN {book.isbn}
          </Text>
          <Text variant="caption" tone="muted">
            Origin: <span className="font-medium text-stone-700">{book.supplierCountry}</span>
          </Text>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between border-t border-stone-100 pt-3.5">
        <div>
          <Text variant="caption" tone="muted" className="block">
            Cost / Suggested
          </Text>
          <div className="mt-0.5 flex items-baseline gap-2 tabular-nums">
            <Text variant="subtitle" as="span">
              ${book.costUsd.toFixed(2)}
            </Text>
            <Text variant="caption" tone="muted">
              {book.sellingPriceLocal !== null
                ? `→ ${book.sellingPriceLocal.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}`
                : "· Unpriced"}
            </Text>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(book)}
            aria-label={`View ${book.title}`}
            title="View details & price calculator"
          >
            <ArrowUpRight className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(book)}
            aria-label={`Edit ${book.title}`}
            title="Edit book"
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(book)}
            aria-label={`Delete ${book.title}`}
            title="Delete book"
            className="text-stone-400 hover:bg-rose-50 hover:text-rose-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
};

export const BookCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col justify-between rounded-xl border border-stone-200 bg-white p-5">
      <div>
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded-full" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
        <Skeleton variant="text" className="mt-4 h-5 w-3/4" />
        <Skeleton variant="text" className="mt-2 h-4 w-1/2" />
        <div className="mt-4 flex justify-between border-t border-stone-100 pt-3">
          <Skeleton variant="text" className="h-3.5 w-32" />
          <Skeleton variant="text" className="h-3.5 w-16" />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3.5">
        <div className="space-y-1.5">
          <Skeleton variant="text" className="h-3 w-20" />
          <Skeleton variant="text" className="h-4 w-28" />
        </div>
        <div className="flex gap-1">
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
          <Skeleton className="h-8 w-8 rounded-md" />
        </div>
      </div>
    </div>
  );
};
