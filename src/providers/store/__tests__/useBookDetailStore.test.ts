import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import toast from "react-hot-toast";
import { useBookDetailStore } from "@providers/store/useBookDetailStore";
import * as dataModule from "@data/repositories/BookRepositoryImpl";
import * as inventoryModule from "@providers/store/useInventoryStore";
import type { Book, PriceCalculation } from "@domain";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 7,
    title: "El Quijote",
    author: "Cervantes",
    category: "Literatura Clásica",
    isbn: "978-84-376-0494-7",
    supplierCountry: "ES",
    costUsd: 15.99,
    sellingPriceLocal: null,
    stockQuantity: 25,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeCalc(overrides: Partial<PriceCalculation> = {}): PriceCalculation {
  return {
    bookId: 7,
    costUsd: "15.99",
    exchangeRate: "36.50",
    costLocal: "583.64",
    marginPercentage: 40,
    sellingPriceLocal: "817.09",
    currency: "VES",
    calculationTimestamp: "2026-11-25T00:00:00Z",
    ...overrides,
  };
}

describe("useBookDetailStore", () => {
  let mockRepo: typeof dataModule.bookRepository;

  beforeEach(() => {
    useBookDetailStore.setState({
      book: null,
      priceCalculation: null,
      isLoading: false,
      isCalculating: false,
      error: null,
    });
    vi.clearAllMocks();

    mockRepo = {
      list: vi.fn(),
      searchByCategory: vi.fn(),
      listLowStock: vi.fn(),
      getById: vi.fn().mockResolvedValue(makeBook()),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      calculatePrice: vi.fn().mockResolvedValue(makeCalc()),
    };
    vi.spyOn(dataModule, "bookRepository", "get").mockReturnValue(mockRepo);
    vi.spyOn(inventoryModule.useInventoryStore, "getState").mockReturnValue({
      syncUpdatedBook: vi.fn(),
    } as unknown as ReturnType<typeof inventoryModule.useInventoryStore.getState>);
  });

  it("fetchBook loads and sets the book", async () => {
    const { result } = renderHook(() => useBookDetailStore());

    await act(async () => {
      await result.current.fetchBook(7);
    });

    expect(result.current.book?.title).toBe("El Quijote");
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it("fetchBook sets error on failure", async () => {
    vi.mocked(mockRepo.getById).mockRejectedValueOnce(new Error("Not found"));
    const { result } = renderHook(() => useBookDetailStore());

    await act(async () => {
      await result.current.fetchBook(99);
    });

    expect(result.current.book).toBeNull();
    expect(result.current.error).toBeTruthy();
    expect(toast.error).toHaveBeenCalled();
  });

  it("fetchBook does not set error on AbortError", async () => {
    const abortError = new DOMException("Aborted", "AbortError");
    vi.mocked(mockRepo.getById).mockRejectedValueOnce(abortError);
    const { result } = renderHook(() => useBookDetailStore());

    await act(async () => {
      await result.current.fetchBook(7);
    });

    expect(result.current.error).toBeNull();
    expect(toast.error).not.toHaveBeenCalled();
  });

  it("calculatePrice sets priceCalculation and updates sellingPriceLocal on book", async () => {
    useBookDetailStore.setState({ book: makeBook() });
    const { result } = renderHook(() => useBookDetailStore());

    await act(async () => {
      await result.current.calculatePrice(7);
    });

    expect(result.current.priceCalculation?.sellingPriceLocal).toBe("817.09");
    expect(result.current.book?.sellingPriceLocal).toBe(817.09);
    expect(result.current.isCalculating).toBe(false);
    expect(toast.success).toHaveBeenCalled();
  });

  it("calculatePrice shows error toast and returns null on failure", async () => {
    vi.mocked(mockRepo.calculatePrice).mockRejectedValueOnce(
      new Error("Exchange rate unavailable"),
    );
    const { result } = renderHook(() => useBookDetailStore());

    let calc;
    await act(async () => {
      calc = await result.current.calculatePrice(7);
    });

    expect(calc).toBeNull();
    expect(result.current.isCalculating).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  it("clear resets all state", async () => {
    useBookDetailStore.setState({
      book: makeBook(),
      priceCalculation: makeCalc(),
      error: "some error",
    });
    const { result } = renderHook(() => useBookDetailStore());

    act(() => {
      result.current.clear();
    });

    expect(result.current.book).toBeNull();
    expect(result.current.priceCalculation).toBeNull();
    expect(result.current.error).toBeNull();
  });
});
