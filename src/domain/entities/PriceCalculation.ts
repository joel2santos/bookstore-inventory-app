export interface PriceCalculation {
  bookId: number;
  costUsd: string;
  exchangeRate: string;
  costLocal: string;
  marginPercentage: number;
  sellingPriceLocal: string;
  currency: string;
  calculationTimestamp: string;
}
