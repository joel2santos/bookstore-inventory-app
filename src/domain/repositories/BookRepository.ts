import type { Book, BookInput } from "../entities/Book";
import type { PaginatedResult } from "../entities/PaginatedResult";
import type { PriceCalculation } from "../entities/PriceCalculation";

export interface BookRepository {
  list(page?: number, signal?: AbortSignal): Promise<PaginatedResult<Book>>;
  searchByCategory(
    category: string,
    page?: number,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<Book>>;
  listLowStock(
    threshold?: number,
    page?: number,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<Book>>;
  getById(id: number, signal?: AbortSignal): Promise<Book>;
  create(input: BookInput): Promise<Book>;
  update(id: number, input: BookInput): Promise<Book>;
  delete(id: number): Promise<void>;
  calculatePrice(id: number): Promise<PriceCalculation>;
}
