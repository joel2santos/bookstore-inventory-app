import { describe, it, expect, vi, beforeEach } from "vitest";
import { BookRepositoryImpl } from "@data/repositories/BookRepositoryImpl";
import { BookRemoteDataSource } from "@data/datasources/BookRemoteDataSource";
import type { BookDto } from "@data/interfaces/BookDto";
import type { PaginatedResponseDto } from "@data/interfaces/PaginatedResponseDto";
import type { PriceCalculationDto } from "@data/interfaces/PriceCalculationDto";

function makeBookDto(overrides: Partial<BookDto> = {}): BookDto {
  return {
    id: 1,
    title: "El Quijote",
    author: "Cervantes",
    category: "Literatura Clásica",
    isbn: "978-84-376-0494-7",
    supplier_country: "ES",
    cost_usd: "15.99",
    selling_price_local: "22200.00",
    stock_quantity: 25,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makePaginatedDto(
  results: BookDto[] = [makeBookDto()],
): PaginatedResponseDto<BookDto> {
  return { count: results.length, next: null, previous: null, results };
}

describe("BookRepositoryImpl", () => {
  let remote: BookRemoteDataSource;
  let repo: BookRepositoryImpl;

  beforeEach(() => {
    remote = {
      list: vi.fn().mockResolvedValue(makePaginatedDto()),
      searchByCategory: vi.fn().mockResolvedValue(makePaginatedDto()),
      listLowStock: vi.fn().mockResolvedValue(makePaginatedDto()),
      getById: vi.fn().mockResolvedValue(makeBookDto()),
      create: vi.fn().mockResolvedValue(makeBookDto()),
      update: vi.fn().mockResolvedValue(makeBookDto()),
      delete: vi.fn().mockResolvedValue(undefined),
      calculatePrice: vi.fn().mockResolvedValue({
        book_id: 1,
        cost_usd: "15.99",
        exchange_rate: "36.50",
        cost_local: "583.64",
        margin_percentage: 40,
        selling_price_local: "817.09",
        currency: "USD",
        calculation_timestamp: "2026-11-25T00:00:00Z",
      } satisfies PriceCalculationDto),
    } as unknown as BookRemoteDataSource;

    repo = new BookRepositoryImpl(remote);
  });

  describe("DTO → Entity mapping", () => {
    it("maps snake_case DTO fields to camelCase entity", async () => {
      const result = await repo.list(1);
      const book = result.results[0];
      expect(book.supplierCountry).toBe("ES");
      expect(book.costUsd).toBe(15.99);
      expect(book.sellingPriceLocal).toBe(22200);
      expect(book.stockQuantity).toBe(25);
    });

    it("maps null selling_price_local to null", async () => {
      vi.mocked(remote.list).mockResolvedValueOnce(
        makePaginatedDto([makeBookDto({ selling_price_local: null })]),
      );
      const result = await repo.list(1);
      expect(result.results[0].sellingPriceLocal).toBeNull();
    });

    it("maps pagination metadata", async () => {
      vi.mocked(remote.list).mockResolvedValueOnce({
        count: 50,
        next: "/books/?page=2",
        previous: null,
        results: [makeBookDto()],
      });
      const result = await repo.list(1);
      expect(result.count).toBe(50);
      expect(result.next).toBe("/books/?page=2");
      expect(result.previous).toBeNull();
    });

    it("delegates list() with the correct page", async () => {
      await repo.list(3);
      expect(remote.list).toHaveBeenCalledWith(3, undefined);
    });

    it("delegates searchByCategory() with correct args", async () => {
      await repo.searchByCategory("Fantasy", 2);
      expect(remote.searchByCategory).toHaveBeenCalledWith("Fantasy", 2, undefined);
    });

    it("delegates listLowStock() with threshold and page", async () => {
      await repo.listLowStock(5, 1);
      expect(remote.listLowStock).toHaveBeenCalledWith(5, 1, undefined);
    });

    it("maps BookInput to snake_case write DTO for create()", async () => {
      await repo.create({
        title: "El Quijote",
        author: "Cervantes",
        category: "Literatura Clásica",
        isbn: "978-84-376-0494-7",
        supplierCountry: "es",
        costUsd: 15.99,
        stockQuantity: 25,
      });
      expect(remote.create).toHaveBeenCalledWith(
        expect.objectContaining({
          supplier_country: "ES",
          cost_usd: 15.99,
          stock_quantity: 25,
        }),
      );
    });

    it("maps PriceCalculationDto to PriceCalculation entity", async () => {
      const result = await repo.calculatePrice(1);
      expect(result.exchangeRate).toBe("36.50");
      expect(result.sellingPriceLocal).toBe("817.09");
      expect(result.marginPercentage).toBe(40);
    });
  });

  describe("delete()", () => {
    it("calls remote.delete and resolves void", async () => {
      await expect(repo.delete(1)).resolves.toBeUndefined();
      expect(remote.delete).toHaveBeenCalledWith(1);
    });
  });
});
