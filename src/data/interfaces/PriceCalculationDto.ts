export interface PriceCalculationDto {
  book_id: number;
  cost_usd: string;
  exchange_rate: string;
  cost_local: string;
  margin_percentage: number;
  selling_price_local: string;
  currency: string;
  calculation_timestamp: string;
}
