export const AppRoutes = {
  HOME: "/",
  INVENTORY: "/",
  BOOK_CREATE: "/books/new",
  BOOK_DETAIL: "/books/:id",
  BOOK_EDIT: "/books/:id/edit",
} as const;

export function bookDetailPath(id: number | string): string {
  return `/books/${id}`;
}

export function bookEditPath(id: number | string): string {
  return `/books/${id}/edit`;
}
