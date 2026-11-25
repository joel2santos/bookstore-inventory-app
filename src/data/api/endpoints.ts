export const API_ENDPOINTS = {
  books: "/books/",
  bookDetail: (id: number) => `/books/${id}/`,
  bookSearch: "/books/search/",
  bookLowStock: "/books/low-stock/",
  bookCalculatePrice: (id: number) => `/books/${id}/calculate-price/`,
} as const;
