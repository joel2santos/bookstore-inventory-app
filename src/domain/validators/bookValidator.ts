export interface BookFormValues {
  title: string;
  author: string;
  category: string;
  isbn: string;
  supplierCountry: string;
  costUsd: string;
  stockQuantity: string;
}

export type BookValidationErrors = Partial<Record<keyof BookFormValues, string>>;
export function validateIsbn(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return "ISBN is required";
  }

  const digits = trimmed.replace(/[-\s]/g, "");

  if (
    digits.length === 10 &&
    /^\d{9}$/.test(digits.slice(0, 9)) &&
    /^[0-9Xx]$/.test(digits[9])
  ) {
    const check = digits[9].toUpperCase() === "X" ? 10 : Number(digits[9]);
    let total = 0;
    for (let i = 0; i < 9; i++) {
      total += Number(digits[i]) * (10 - i);
    }
    if ((total + check) % 11 !== 0) {
      return "Invalid ISBN-10 check digit";
    }
    return null;
  }

  if (digits.length === 13 && /^\d{13}$/.test(digits)) {
    let total = 0;
    for (let i = 0; i < 13; i++) {
      total += Number(digits[i]) * (i % 2 === 0 ? 1 : 3);
    }
    if (total % 10 !== 0) {
      return "Invalid ISBN-13 check digit";
    }
    return null;
  }

  return "Enter a valid ISBN-10 or ISBN-13";
}

export function validateBookInput(values: BookFormValues): BookValidationErrors {
  const errors: BookValidationErrors = {};

  if (!values.title.trim()) {
    errors.title = "Title is required";
  }
  if (!values.author.trim()) {
    errors.author = "Author is required";
  }
  if (!values.category.trim()) {
    errors.category = "Category is required";
  }

  const isbnError = validateIsbn(values.isbn);
  if (isbnError) {
    errors.isbn = isbnError;
  }

  const country = values.supplierCountry.trim();
  if (!country) {
    errors.supplierCountry = "Supplier country code is required";
  } else if (!/^[A-Za-z]{2,3}$/.test(country)) {
    errors.supplierCountry = "Use a 2- or 3-letter country code (e.g. ES, US)";
  }

  const cost = Number(values.costUsd);
  if (!values.costUsd.trim() || Number.isNaN(cost)) {
    errors.costUsd = "Cost (USD) must be a valid number";
  } else if (cost <= 0) {
    errors.costUsd = "Cost (USD) must be greater than 0";
  }

  const stock = Number(values.stockQuantity);
  if (
    !values.stockQuantity.trim() ||
    Number.isNaN(stock) ||
    !Number.isInteger(stock)
  ) {
    errors.stockQuantity = "Stock quantity must be a whole number";
  } else if (stock < 0) {
    errors.stockQuantity = "Stock quantity must be 0 or greater";
  }

  return errors;
}
