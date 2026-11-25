import { create } from "zustand";
import toast from "react-hot-toast";
import { ApiError, bookRepository } from "@data";
import type { Book, PriceCalculation } from "@domain";
import { useInventoryStore } from "./useInventoryStore";

interface BookDetailState {
  book: Book | null;
  priceCalculation: PriceCalculation | null;
  isLoading: boolean;
  isCalculating: boolean;
  error: string | null;

  fetchBook: (id: number, signal?: AbortSignal) => Promise<void>;
  calculatePrice: (id: number) => Promise<PriceCalculation | null>;
  clear: () => void;
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

export const useBookDetailStore = create<BookDetailState>((set, get) => ({
  book: null,
  priceCalculation: null,
  isLoading: false,
  isCalculating: false,
  error: null,

  fetchBook: async (id, signal) => {
    set({ isLoading: true, error: null, priceCalculation: null });
    try {
      const book = await bookRepository.getById(id, signal);
      set({ book, isLoading: false });
    } catch (err) {
      if (isAbortError(err)) return;
      const message = getErrorMessage(err, "Failed to load book details");
      set({ isLoading: false, error: message, book: null });
      toast.error(message);
    }
  },

  calculatePrice: async (id) => {
    set({ isCalculating: true });
    try {
      const calculation = await bookRepository.calculatePrice(id);
      const currentBook = get().book;
      const updatedBook = currentBook
        ? {
            ...currentBook,
            sellingPriceLocal: Number(calculation.sellingPriceLocal),
          }
        : null;

      set({
        priceCalculation: calculation,
        book: updatedBook,
        isCalculating: false,
      });

      if (updatedBook) {
        useInventoryStore.getState().syncUpdatedBook(updatedBook);
      }

      toast.success(
        `Suggested price: ${calculation.sellingPriceLocal} ${calculation.currency}`,
      );
      return calculation;
    } catch (err) {
      const message = getErrorMessage(err, "Failed to calculate selling price");
      set({ isCalculating: false });
      toast.error(message);
      return null;
    }
  },

  clear: () => {
    set({
      book: null,
      priceCalculation: null,
      isLoading: false,
      isCalculating: false,
      error: null,
    });
  },
}));
