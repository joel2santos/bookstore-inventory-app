import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import toast from "react-hot-toast";
import { useInventoryStore } from "@providers/store/useInventoryStore";
import * as dataModule from "@data/repositories/BookRepositoryImpl";
import type { Book, PaginatedResult } from "@domain";

vi.mock("react-hot-toast", () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 1,
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

function makePaginated(
  overrides: Partial<PaginatedResult<Book>> = {},
): PaginatedResult<Book> {
  return {
    count: 1,
    next: null,
    previous: null,
    results: [makeBook()],
    ...overrides,
  };
}

describe("useInventoryStore", () => {
  let mockRepo: typeof dataModule.bookRepository;

  beforeEach(() => {
    useInventoryStore.setState({
      books: [],
      knownCategories: [],
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
    });
    vi.clearAllMocks();

    mockRepo = {
      list: vi.fn().mockResolvedValue(makePaginated()),
      searchByCategory: vi.fn().mockResolvedValue(makePaginated()),
      listLowStock: vi.fn().mockResolvedValue(makePaginated()),
      getById: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn().mockResolvedValue(undefined),
      calculatePrice: vi.fn(),
    };

    vi.spyOn(dataModule, "bookRepository", "get").mockReturnValue(mockRepo);
  });

  it("fetchBooks sets loading then populates books", async () => {
    const { result } = renderHook(() => useInventoryStore());

    expect(result.current.isLoading).toBe(false);

    await act(async () => {
      await result.current.fetchBooks(1);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.books).toHaveLength(1);
    expect(result.current.books[0].title).toBe("El Quijote");
    expect(result.current.count).toBe(1);
  });

  it("fetchBooks with filterMode=category calls searchByCategory", async () => {
    useInventoryStore.setState({ filterMode: "category", categoryQuery: "Fantasy" });
    const { result } = renderHook(() => useInventoryStore());

    await act(async () => {
      await result.current.fetchBooks(1);
    });

    expect(mockRepo.searchByCategory).toHaveBeenCalledWith("Fantasy", 1, undefined);
    expect(mockRepo.list).not.toHaveBeenCalled();
  });

  it("fetchBooks with filterMode=low-stock calls listLowStock", async () => {
    useInventoryStore.setState({ filterMode: "low-stock", lowStockThreshold: 5 });
    const { result } = renderHook(() => useInventoryStore());

    await act(async () => {
      await result.current.fetchBooks(1);
    });

    expect(mockRepo.listLowStock).toHaveBeenCalledWith(5, 1, undefined);
  });

  it("setCategoryFilter switches filterMode to category", async () => {
    const { result } = renderHook(() => useInventoryStore());

    await act(async () => {
      result.current.setCategoryFilter("Fantasy");
    });

    expect(result.current.filterMode).toBe("category");
    expect(result.current.categoryQuery).toBe("Fantasy");
  });

  it("setCategoryFilter with empty string resets to all", async () => {
    useInventoryStore.setState({ filterMode: "category", categoryQuery: "Fantasy" });
    const { result } = renderHook(() => useInventoryStore());

    await act(async () => {
      result.current.setCategoryFilter("");
    });

    expect(result.current.filterMode).toBe("all");
  });

  it("setLowStockFilter enables low-stock mode with threshold", async () => {
    const { result } = renderHook(() => useInventoryStore());

    await act(async () => {
      result.current.setLowStockFilter(true, 5);
    });

    expect(result.current.filterMode).toBe("low-stock");
    expect(result.current.lowStockThreshold).toBe(5);
    expect(result.current.categoryQuery).toBe("");
  });

  it("resetFilters restores default state", async () => {
    useInventoryStore.setState({ filterMode: "low-stock", lowStockThreshold: 5, page: 3 });
    const { result } = renderHook(() => useInventoryStore());

    await act(async () => {
      result.current.resetFilters();
    });

    expect(result.current.filterMode).toBe("all");
    expect(result.current.categoryQuery).toBe("");
    expect(result.current.lowStockThreshold).toBe(10);
    expect(result.current.page).toBe(1);
  });

  it("deleteBook removes book and shows success toast", async () => {
    useInventoryStore.setState({ books: [makeBook({ id: 42 })] });
    const { result } = renderHook(() => useInventoryStore());

    let success: boolean = false;
    await act(async () => {
      success = await result.current.deleteBook(42);
    });

    expect(success).toBe(true);
    expect(mockRepo.delete).toHaveBeenCalledWith(42);
    expect(toast.success).toHaveBeenCalled();
  });

  it("deleteBook shows error toast and returns false on failure", async () => {
    vi.mocked(mockRepo.delete).mockRejectedValueOnce(new Error("Server error"));
    const { result } = renderHook(() => useInventoryStore());

    let success = true;
    await act(async () => {
      success = await result.current.deleteBook(1);
    });

    expect(success).toBe(false);
    expect(toast.error).toHaveBeenCalled();
  });

  it("syncUpdatedBook updates only the matching book", () => {
    const bookA = makeBook({ id: 1, title: "Original" });
    const bookB = makeBook({ id: 2, title: "Other" });
    useInventoryStore.setState({ books: [bookA, bookB] });
    const { result } = renderHook(() => useInventoryStore());

    act(() => {
      result.current.syncUpdatedBook({ ...bookA, sellingPriceLocal: 999 });
    });

    expect(result.current.books[0].sellingPriceLocal).toBe(999);
    expect(result.current.books[1].title).toBe("Other");
  });
});
