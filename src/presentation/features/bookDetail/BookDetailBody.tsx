import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";
import { useBookDetailStore, useInventoryStore } from "@providers";
import {
  Badge,
  Button,
  ConfirmModal,
  EmptyState,
  Skeleton,
  Text,
} from "@presentation/components";
import { AppRoutes, bookEditPath } from "@presentation/router/routes";
import { PriceCalcPanel } from "./components/PriceCalcPanel";

const _BookDetailBody = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const bookId = Number(id);

  const {
    book,
    priceCalculation,
    isLoading,
    isCalculating,
    error,
    fetchBook,
    calculatePrice,
    clear,
  } = useBookDetailStore();
  const { deleteBook, isDeleting } = useInventoryStore();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    if (Number.isNaN(bookId)) return;
    const controller = new AbortController();
    void fetchBook(bookId, controller.signal);
    return () => {
      controller.abort();
      clear();
    };
  }, [bookId, fetchBook, clear]);

  const handleConfirmDelete = async () => {
    if (!book) return;
    const deleted = await deleteBook(book.id);
    if (deleted) {
      setIsDeleteModalOpen(false);
      navigate(AppRoutes.HOME);
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-28" />
        <div className="rounded-xl border border-stone-200 bg-white p-6 space-y-4">
          <Skeleton className="h-7 w-2/3" />
          <Skeleton className="h-5 w-1/3" />
          <div className="grid grid-cols-2 gap-4 pt-4 sm:grid-cols-4">
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
            <Skeleton className="h-14 w-full" />
          </div>
        </div>
        <Skeleton className="h-48 w-full" />
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="space-y-4">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate(AppRoutes.HOME)}
        >
          Back to Inventory
        </Button>
        <EmptyState
          title="Book not found"
          description={
            error ?? "The requested book could not be loaded from inventory."
          }
          actionLabel="Return to Catalog"
          onAction={() => navigate(AppRoutes.HOME)}
        />
      </div>
    );
  }

  const stockVariant =
    book.stockQuantity === 0
      ? "danger"
      : book.stockQuantity <= 10
        ? "warning"
        : "success";

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<ArrowLeft className="h-4 w-4" />}
          onClick={() => navigate(AppRoutes.HOME)}
          className="self-start -ml-2"
        >
          Back to Inventory
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            leftIcon={<Pencil className="h-4 w-4" />}
            onClick={() => navigate(bookEditPath(book.id))}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            leftIcon={<Trash2 className="h-4 w-4" />}
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>

      <section className="rounded-xl border border-stone-200 bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="neutral" size="md">
            {book.category}
          </Badge>
          <Badge variant={stockVariant} size="md" dot>
            {book.stockQuantity === 0
              ? "Out of stock"
              : `${book.stockQuantity} units in stock`}
          </Badge>
        </div>

        <Text variant="h1" className="mt-4">
          {book.title}
        </Text>
        <Text variant="subtitle" tone="muted" className="mt-1">
          by {book.author}
        </Text>

        <dl className="mt-6 grid grid-cols-1 gap-4 border-t border-stone-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt>
              <Text variant="label" tone="muted">
                ISBN
              </Text>
            </dt>
            <dd className="mt-1">
              <Text variant="mono" className="text-sm">
                {book.isbn}
              </Text>
            </dd>
          </div>

          <div>
            <dt>
              <Text variant="label" tone="muted">
                Supplier Country
              </Text>
            </dt>
            <dd className="mt-1">
              <Text variant="subtitle">{book.supplierCountry}</Text>
            </dd>
          </div>

          <div>
            <dt>
              <Text variant="label" tone="muted">
                Unit Cost (USD)
              </Text>
            </dt>
            <dd className="mt-1">
              <Text variant="subtitle" className="tabular-nums">
                ${book.costUsd.toFixed(2)}
              </Text>
            </dd>
          </div>

          <div>
            <dt>
              <Text variant="label" tone="muted">
                Saved Selling Price
              </Text>
            </dt>
            <dd className="mt-1">
              <Text variant="subtitle" className="tabular-nums">
                {book.sellingPriceLocal !== null
                  ? book.sellingPriceLocal.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })
                  : "Not calculated"}
              </Text>
            </dd>
          </div>
        </dl>
      </section>

      <PriceCalcPanel
        book={book}
        calculation={priceCalculation}
        isCalculating={isCalculating}
        onCalculate={() => void calculatePrice(book.id)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete book?"
        description={`Are you sure you want to permanently remove "${book.title}" (ISBN ${book.isbn}) from inventory?`}
        confirmLabel="Delete Book"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export default _BookDetailBody;
