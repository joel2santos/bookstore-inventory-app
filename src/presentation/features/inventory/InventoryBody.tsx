import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Book } from "@domain";
import { useInventoryStore } from "@providers";
import {
  BookCard,
  BookCardSkeleton,
  Button,
  ConfirmModal,
  EmptyState,
  Pagination,
  Text,
} from "@presentation/components";
import {
  AppRoutes,
  bookDetailPath,
  bookEditPath,
} from "@presentation/router/routes";
import { FilterBar } from "./components/FilterBar";

const _InventoryBody = () => {
  const navigate = useNavigate();
  const {
    books,
    knownCategories,
    count,
    page,
    hasNext,
    hasPrevious,
    filterMode,
    categoryQuery,
    lowStockThreshold,
    isLoading,
    isDeleting,
    fetchBooks,
    setCategoryFilter,
    setLowStockFilter,
    resetFilters,
    setPage,
    deleteBook,
  } = useInventoryStore();

  const [bookToDelete, setBookToDelete] = useState<Book | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetchBooks(1, controller.signal);
    return () => controller.abort();
  }, [fetchBooks]);

  const handleConfirmDelete = async () => {
    if (!bookToDelete) return;
    const deleted = await deleteBook(bookToDelete.id);
    if (deleted) {
      setBookToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Text variant="h1">Inventory Catalog</Text>
          <Text variant="body" tone="muted" className="mt-1">
            Manage books, monitor low stock, and calculate local selling prices.
          </Text>
        </div>

        <Button
          variant="primary"
          size="md"
          leftIcon={<Plus className="h-4 w-4" />}
          onClick={() => navigate(AppRoutes.BOOK_CREATE)}
          className="sm:hidden"
        >
          New Book
        </Button>
      </div>

      <FilterBar
        categories={knownCategories}
        selectedCategory={filterMode === "category" ? categoryQuery : ""}
        onCategoryChange={setCategoryFilter}
        filterMode={filterMode}
        lowStockThreshold={lowStockThreshold}
        onToggleLowStock={setLowStockFilter}
        onReset={resetFilters}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, idx) => (
            <BookCardSkeleton key={idx} />
          ))}
        </div>
      ) : books.length === 0 ? (
        <EmptyState
          title={
            filterMode === "all"
              ? "No books in inventory"
              : "No matching books found"
          }
          description={
            filterMode === "all"
              ? "Add your first book to start managing catalog costs and pricing."
              : "Try selecting another category or adjusting the low-stock threshold."
          }
          actionLabel={filterMode === "all" ? "Add Book" : "Clear Filters"}
          onAction={
            filterMode === "all"
              ? () => navigate(AppRoutes.BOOK_CREATE)
              : resetFilters
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book, idx) => (
              <BookCard
                key={book.id}
                book={book}
                index={idx}
                lowStockThreshold={lowStockThreshold}
                onView={(b) => navigate(bookDetailPath(b.id))}
                onEdit={(b) => navigate(bookEditPath(b.id))}
                onDelete={(b) => setBookToDelete(b)}
              />
            ))}
          </div>

          <Pagination
            page={page}
            totalCount={count}
            hasNext={hasNext}
            hasPrevious={hasPrevious}
            isLoading={isLoading}
            onPageChange={setPage}
          />
        </>
      )}

      <ConfirmModal
        isOpen={Boolean(bookToDelete)}
        title="Delete book?"
        description={
          bookToDelete
            ? `Are you sure you want to permanently remove "${bookToDelete.title}" (ISBN ${bookToDelete.isbn}) from inventory?`
            : ""
        }
        confirmLabel="Delete Book"
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setBookToDelete(null)}
      />
    </div>
  );
};

export default _InventoryBody;
