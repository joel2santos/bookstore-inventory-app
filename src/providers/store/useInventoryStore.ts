import { create } from "zustand";
import toast from "react-hot-toast";
import { ApiError, bookRepository } from "@data";
import type { Book } from "@domain";

export type InventoryFilterMode = "all" | "category" | "low-stock";

interface InventoryState {
  books: Book[];
  count: number;
  page: number;
  hasNext: boolean;
  hasPrevious: boolean;
  filterMode: InventoryFilterMode;
  categoryQuery: string;
  lowStockThreshold: number;
  isLoading: boolean;
  isDeleting: boolean;
  error: string | null;

  fetchBooks: (page?: number, signal?: AbortSignal) => Promise<void>;
  setCategoryFilter: (category: string) => void;
  setLowStockFilter: (enabled: boolean, threshold?: number) => void;
  resetFilters: () => void;
  setPage: (page: number) => void;
  deleteBook: (id: number) => Promise<boolean>;
  syncUpdatedBook: (book: Book) => void;
}

function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === "AbortError";
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof ApiError || err instanceof Error) {
    return err.message;
  }
  return fallback;
}

export const useInventoryStore = create<InventoryState>((set, get) => ({
  books: [],
  count: 0,
  page: 1,
  hasNext: false,
  hasPrevious: false,
  filterMode: "all",
  categoryQuery: "",
  lowStockThreshold: 10,
  isLoading: false,
  isDeleting: false,
  error: null,

  fetchBooks: async (requestedPage, signal) => {
    const state = get();
    const targetPage = requestedPage ?? state.page;
    set({ isLoading: true, error: null, page: targetPage });

    try {
      const { filterMode, categoryQuery, lowStockThreshold } = get();
      const result =
        filterMode === "category" && categoryQuery.trim()
          ? await bookRepository.searchByCategory(
              categoryQuery.trim(),
              targetPage,
              signal,
            )
          : filterMode === "low-stock"
            ? await bookRepository.listLowStock(
                lowStockThreshold,
                targetPage,
                signal,
              )
            : await bookRepository.list(targetPage, signal);

      set({
        books: result.results,
        count: result.count,
        hasNext: Boolean(result.next),
        hasPrevious: Boolean(result.previous),
        isLoading: false,
      });
    } catch (err) {
      if (isAbortError(err)) return;
      const message = getErrorMessage(err, "Failed to load books");
      set({ isLoading: false, error: message });
      toast.error(message);
    }
  },

  setCategoryFilter: (category) => {
    const trimmed = category.trim();
    set({
      categoryQuery: category,
      filterMode: trimmed ? "category" : "all",
      page: 1,
    });
    void get().fetchBooks(1);
  },

  setLowStockFilter: (enabled, threshold) => {
    set((state) => ({
      filterMode: enabled ? "low-stock" : "all",
      categoryQuery: enabled ? "" : state.categoryQuery,
      lowStockThreshold: threshold ?? state.lowStockThreshold,
      page: 1,
    }));
    void get().fetchBooks(1);
  },

  resetFilters: () => {
    set({
      filterMode: "all",
      categoryQuery: "",
      lowStockThreshold: 10,
      page: 1,
    });
    void get().fetchBooks(1);
  },

  setPage: (nextPage) => {
    void get().fetchBooks(nextPage);
  },

  deleteBook: async (id) => {
    set({ isDeleting: true });
    try {
      await bookRepository.delete(id);
      toast.success("Book deleted from inventory");

      const { books, page } = get();
      const nextPage = books.length === 1 && page > 1 ? page - 1 : page;
      set({ isDeleting: false });
      await get().fetchBooks(nextPage);
      return true;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to delete book");
      set({ isDeleting: false });
      toast.error(message);
      return false;
    }
  },

  syncUpdatedBook: (updated) => {
    set((state) => ({
      books: state.books.map((b) => (b.id === updated.id ? updated : b)),
    }));
  },
}));
