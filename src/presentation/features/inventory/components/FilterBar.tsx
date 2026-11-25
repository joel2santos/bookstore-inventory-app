import React from "react";
import { AlertTriangle, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import type { InventoryFilterMode } from "@providers";
import { Button, Field } from "@presentation/components";

export interface FilterBarProps {
  categoryInput: string;
  onCategoryInputChange: (value: string) => void;
  filterMode: InventoryFilterMode;
  lowStockThreshold: number;
  onToggleLowStock: (enabled: boolean, threshold?: number) => void;
  onReset: () => void;
}

const THRESHOLD_OPTIONS = [
  { label: "Threshold: ≤ 5", value: "5" },
  { label: "Threshold: ≤ 10", value: "10" },
  { label: "Threshold: ≤ 20", value: "20" },
  { label: "Threshold: ≤ 50", value: "50" },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  categoryInput,
  onCategoryInputChange,
  filterMode,
  lowStockThreshold,
  onToggleLowStock,
  onReset,
}) => {
  const isLowStockActive = filterMode === "low-stock";
  const hasActiveFilter = filterMode !== "all" || categoryInput.trim() !== "";

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-stone-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="w-full sm:max-w-xs">
          <Field
            type="text"
            name="categorySearch"
            placeholder="Search by category..."
            value={categoryInput}
            onChange={(e) => onCategoryInputChange(e.target.value)}
            leftIcon={<Search className="h-4 w-4" />}
            aria-label="Search by category"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant={isLowStockActive ? "primary" : "secondary"}
            size="md"
            leftIcon={<AlertTriangle className="h-4 w-4" />}
            onClick={() => onToggleLowStock(!isLowStockActive)}
          >
            Low Stock
          </Button>

          {isLowStockActive && (
            <div className="w-40">
              <Field
                type="select"
                name="lowStockThreshold"
                value={String(lowStockThreshold)}
                onChange={(e) =>
                  onToggleLowStock(true, Number(e.target.value))
                }
                leftIcon={<SlidersHorizontal className="h-4 w-4" />}
                options={THRESHOLD_OPTIONS}
              />
            </div>
          )}
        </div>
      </div>

      {hasActiveFilter && (
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
          onClick={onReset}
        >
          Reset
        </Button>
      )}
    </div>
  );
};
