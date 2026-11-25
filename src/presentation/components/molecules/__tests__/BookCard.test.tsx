import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BookCard } from "@presentation/components/molecules/BookCard";
import type { Book } from "@domain";

function makeBook(overrides: Partial<Book> = {}): Book {
  return {
    id: 1,
    title: "El Quijote",
    author: "Cervantes",
    category: "Literatura Clásica",
    isbn: "978-84-376-0494-7",
    supplierCountry: "ES",
    costUsd: 15.99,
    sellingPriceLocal: null,
    stockQuantity: 25,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function renderCard(overrides: Partial<Book> = {}) {
  const onView = vi.fn();
  const onEdit = vi.fn();
  const onDelete = vi.fn();
  const book = makeBook(overrides);
  render(
    <BookCard
      book={book}
      onView={onView}
      onEdit={onEdit}
      onDelete={onDelete}
    />,
  );
  return { book, onView, onEdit, onDelete };
}

describe("BookCard molecule", () => {
  it("renders the book title and author", () => {
    renderCard();
    expect(screen.getByText("El Quijote")).toBeInTheDocument();
    expect(screen.getByText("Cervantes")).toBeInTheDocument();
  });

  it("renders the category badge", () => {
    renderCard();
    expect(screen.getByText("Literatura Clásica")).toBeInTheDocument();
  });

  it("shows success badge for healthy stock", () => {
    renderCard({ stockQuantity: 25 });
    expect(screen.getByText(/25 in stock/i)).toBeInTheDocument();
  });

  it("shows warning badge for low stock", () => {
    renderCard({ stockQuantity: 5, });
    expect(screen.getByText(/low stock/i)).toBeInTheDocument();
  });

  it("shows danger badge when out of stock", () => {
    renderCard({ stockQuantity: 0 });
    expect(screen.getByText(/out of stock/i)).toBeInTheDocument();
  });

  it("displays USD cost", () => {
    renderCard({ costUsd: 15.99 });
    expect(screen.getByText(/\$15\.99/)).toBeInTheDocument();
  });

  it("shows Unpriced when sellingPriceLocal is null", () => {
    renderCard({ sellingPriceLocal: null });
    expect(screen.getByText(/unpriced/i)).toBeInTheDocument();
  });

  it("calls onView when title is clicked", async () => {
    const user = userEvent.setup();
    const { onView, book } = renderCard();
    // The title button has no aria-label; find it by its text content
    const titleBtn = screen.getByText("El Quijote").closest("button")!;
    await user.click(titleBtn);
    expect(onView).toHaveBeenCalledWith(book);
  });

  it("calls onEdit when edit button is clicked", async () => {
    const user = userEvent.setup();
    const { onEdit, book } = renderCard();
    await user.click(screen.getByRole("button", { name: /edit el quijote/i }));
    expect(onEdit).toHaveBeenCalledWith(book);
  });

  it("calls onDelete when delete button is clicked", async () => {
    const user = userEvent.setup();
    const { onDelete, book } = renderCard();
    await user.click(screen.getByRole("button", { name: /delete el quijote/i }));
    expect(onDelete).toHaveBeenCalledWith(book);
  });
});
