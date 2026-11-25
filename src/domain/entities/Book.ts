export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  supplierCountry: string;
  costUsd: number;
  sellingPriceLocal: number | null;
  stockQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookInput {
  title: string;
  author: string;
  category: string;
  isbn: string;
  supplierCountry: string;
  costUsd: number;
  stockQuantity: number;
}
