import React from "react";
import { Calculator, Clock, TrendingUp } from "lucide-react";
import type { Book, PriceCalculation } from "@domain";
import { Badge, Button, Skeleton, Text } from "@presentation/components";

export interface PriceCalcPanelProps {
  book: Book;
  calculation: PriceCalculation | null;
  isCalculating: boolean;
  onCalculate: () => void;
}

export const PriceCalcPanel: React.FC<PriceCalcPanelProps> = ({
  book,
  calculation,
  isCalculating,
  onCalculate,
}) => {
  return (
    <section className="rounded-xl border border-stone-200 bg-white p-6">
      <div className="flex flex-col justify-between gap-4 border-b border-stone-100 pb-5 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Text variant="h2">Selling Price Calculator</Text>
            <Badge variant="accent" size="sm">
              Live FX
            </Badge>
          </div>
          <Text variant="body" tone="muted" className="mt-1">
            Converts USD cost using live exchange rates and applies the 40% retail margin.
          </Text>
        </div>

        <Button
          variant="primary"
          size="md"
          isLoading={isCalculating}
          leftIcon={<Calculator className="h-4 w-4" />}
          onClick={onCalculate}
        >
          Calc the selling price
        </Button>
      </div>

      {isCalculating ? (
        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : calculation ? (
        <div className="mt-5 space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-4">
              <Text variant="label" tone="muted">
                Original Cost
              </Text>
              <Text variant="h3" className="mt-1 tabular-nums">
                ${calculation.costUsd} USD
              </Text>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-4">
              <Text variant="label" tone="muted">
                Exchange Rate
              </Text>
              <Text variant="h3" className="mt-1 tabular-nums">
                1 USD = {calculation.exchangeRate} {calculation.currency}
              </Text>
              <Text variant="caption" tone="muted" className="mt-0.5 block tabular-nums">
                Base cost: {calculation.costLocal} {calculation.currency}
              </Text>
            </div>

            <div className="rounded-lg border border-stone-200 bg-stone-50/70 p-4">
              <Text variant="label" tone="muted">
                Margin
              </Text>
              <div className="mt-1 flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-emerald-600" />
                <Text variant="h3" tone="success" className="tabular-nums">
                  +{calculation.marginPercentage}%
                </Text>
              </div>
            </div>

            <div className="rounded-lg border border-amber-300 bg-amber-50/70 p-4">
              <Text variant="label" tone="accent">
                Suggested Selling Price
              </Text>
              <Text variant="h2" className="mt-1 tabular-nums text-stone-900">
                {calculation.sellingPriceLocal} {calculation.currency}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-stone-500">
            <Clock className="h-3.5 w-3.5" />
            <Text variant="caption" tone="muted">
              Calculated at{" "}
              {new Date(calculation.calculationTimestamp).toLocaleString()}
            </Text>
          </div>
        </div>
      ) : (
        <div className="mt-5 flex flex-col items-start justify-between gap-2 rounded-lg border border-dashed border-stone-200 bg-stone-50/50 p-4 sm:flex-row sm:items-center">
          <div>
            <Text variant="subtitle">
              {book.sellingPriceLocal !== null
                ? `Last saved selling price: ${book.sellingPriceLocal.toLocaleString(
                    undefined,
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 },
                  )}`
                : "No selling price calculated yet"}
            </Text>
            <Text variant="caption" tone="muted" className="mt-0.5 block">
              Click "Calc the selling price" to fetch the latest exchange rate breakdown.
            </Text>
          </div>
        </div>
      )}
    </section>
  );
};
