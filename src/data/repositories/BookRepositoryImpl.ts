import type {
  Book,
  BookInput,
  BookRepository,
  PaginatedResult,
  PriceCalculation,
} from "@domain";
import { BookRemoteDataSource } from "../datasources/BookRemoteDataSource";
import type { BookDto, BookWriteDto } from "../interfaces/BookDto";
import type { PaginatedResponseDto } from "../interfaces/PaginatedResponseDto";
import type { PriceCalculationDto } from "../interfaces/PriceCalculationDto";

function toBookEntity(dto: BookDto): Book {
  return {
    id: dto.id,
    title: dto.title,
    author: dto.author,
    category: dto.category,
    isbn: dto.isbn,
    supplierCountry: dto.supplier_country,
    costUsd: Number(dto.cost_usd),
    sellingPriceLocal:
      dto.selling_price_local !== null && dto.selling_price_local !== undefined
        ? Number(dto.selling_price_local)
        : null,
    stockQuantity: dto.stock_quantity,
    createdAt: dto.created_at,
    updatedAt: dto.updated_at,
  };
}

function toWriteDto(input: BookInput): BookWriteDto {
  return {
    title: input.title.trim(),
    author: input.author.trim(),
    category: input.category.trim(),
    isbn: input.isbn.trim(),
    supplier_country: input.supplierCountry.trim().toUpperCase(),
    cost_usd: input.costUsd,
    stock_quantity: input.stockQuantity,
  };
}

function toPaginatedBooks(
  dto: PaginatedResponseDto<BookDto>,
): PaginatedResult<Book> {
  return {
    count: dto.count,
    next: dto.next,
    previous: dto.previous,
    results: dto.results.map(toBookEntity),
  };
}

function toPriceCalculation(dto: PriceCalculationDto): PriceCalculation {
  return {
    bookId: dto.book_id,
    costUsd: dto.cost_usd,
    exchangeRate: dto.exchange_rate,
    costLocal: dto.cost_local,
    marginPercentage: dto.margin_percentage,
    sellingPriceLocal: dto.selling_price_local,
    currency: dto.currency,
    calculationTimestamp: dto.calculation_timestamp,
  };
}

export class BookRepositoryImpl implements BookRepository {
  constructor(
    private readonly remote = new BookRemoteDataSource(),
  ) {}

  async list(page = 1, signal?: AbortSignal): Promise<PaginatedResult<Book>> {
    const dto = await this.remote.list(page, signal);
    return toPaginatedBooks(dto);
  }

  async searchByCategory(
    category: string,
    page = 1,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<Book>> {
    const dto = await this.remote.searchByCategory(category, page, signal);
    return toPaginatedBooks(dto);
  }

  async listLowStock(
    threshold = 10,
    page = 1,
    signal?: AbortSignal,
  ): Promise<PaginatedResult<Book>> {
    const dto = await this.remote.listLowStock(threshold, page, signal);
    return toPaginatedBooks(dto);
  }

  async getById(id: number, signal?: AbortSignal): Promise<Book> {
    const dto = await this.remote.getById(id, signal);
    return toBookEntity(dto);
  }

  async create(input: BookInput): Promise<Book> {
    const dto = await this.remote.create(toWriteDto(input));
    return toBookEntity(dto);
  }

  async update(id: number, input: BookInput): Promise<Book> {
    const dto = await this.remote.update(id, toWriteDto(input));
    return toBookEntity(dto);
  }

  async delete(id: number): Promise<void> {
    await this.remote.delete(id);
  }

  async calculatePrice(id: number): Promise<PriceCalculation> {
    const dto = await this.remote.calculatePrice(id);
    return toPriceCalculation(dto);
  }
}

export const bookRepository: BookRepository = new BookRepositoryImpl();
