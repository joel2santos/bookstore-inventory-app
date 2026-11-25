import { API_ENDPOINTS } from "../api/endpoints";
import { apiFetch } from "../api/fetchClient";
import type { BookDto, BookWriteDto } from "../interfaces/BookDto";
import type { PaginatedResponseDto } from "../interfaces/PaginatedResponseDto";
import type { PriceCalculationDto } from "../interfaces/PriceCalculationDto";

export class BookRemoteDataSource {
  list(
    page = 1,
    signal?: AbortSignal,
  ): Promise<PaginatedResponseDto<BookDto>> {
    return apiFetch<PaginatedResponseDto<BookDto>>(API_ENDPOINTS.books, {
      params: { page },
      signal,
    });
  }

  searchByCategory(
    category: string,
    page = 1,
    signal?: AbortSignal,
  ): Promise<PaginatedResponseDto<BookDto>> {
    return apiFetch<PaginatedResponseDto<BookDto>>(API_ENDPOINTS.bookSearch, {
      params: { category, page },
      signal,
    });
  }

  listLowStock(
    threshold = 10,
    page = 1,
    signal?: AbortSignal,
  ): Promise<PaginatedResponseDto<BookDto>> {
    return apiFetch<PaginatedResponseDto<BookDto>>(API_ENDPOINTS.bookLowStock, {
      params: { threshold, page },
      signal,
    });
  }

  getById(id: number, signal?: AbortSignal): Promise<BookDto> {
    return apiFetch<BookDto>(API_ENDPOINTS.bookDetail(id), { signal });
  }

  create(payload: BookWriteDto): Promise<BookDto> {
    return apiFetch<BookDto>(API_ENDPOINTS.books, {
      method: "POST",
      body: payload,
    });
  }

  update(id: number, payload: BookWriteDto): Promise<BookDto> {
    return apiFetch<BookDto>(API_ENDPOINTS.bookDetail(id), {
      method: "PUT",
      body: payload,
    });
  }

  delete(id: number): Promise<void> {
    return apiFetch<void>(API_ENDPOINTS.bookDetail(id), {
      method: "DELETE",
    });
  }

  calculatePrice(id: number): Promise<PriceCalculationDto> {
    return apiFetch<PriceCalculationDto>(API_ENDPOINTS.bookCalculatePrice(id), {
      method: "POST",
    });
  }
}
