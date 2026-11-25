export interface BookDto {
  id: number;
  title: string;
  author: string;
  category: string;
  isbn: string;
  supplier_country: string;
  cost_usd: string | number;
  selling_price_local: string | number | null;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface BookWriteDto {
  title: string;
  author: string;
  category: string;
  isbn: string;
  supplier_country: string;
  cost_usd: number;
  stock_quantity: number;
}
